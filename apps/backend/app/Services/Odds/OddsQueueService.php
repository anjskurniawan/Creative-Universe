<?php

namespace App\Services\Odds;

use App\Enums\Odds\DesignerAvailabilityEnum;
use App\Enums\Odds\TaskStatusEnum;
use App\Enums\Odds\TaskTypeEnum;
use App\Models\Odds\DesignerProfile;
use App\Models\Odds\Task;
use App\Models\Odds\TaskQueue;
use App\Models\Odds\TaskSkipRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OddsQueueService
{
    public function __construct(
        private OddsPriorityService $priority,
        private OddsNotificationService $notifications
    ) {}

    public function recommendDesigner(Task $task): ?DesignerProfile
    {
        $profiles = DesignerProfile::query()
            ->where('is_active', true)
            ->whereIn('status', ['available', 'semi_off'])
            ->with('user')
            ->get();

        return $profiles
            ->filter(function (DesignerProfile $profile) use ($task) {
                $specializations = $profile->specializations ?? [];

                return empty($specializations)
                    || in_array($task->category_id, $specializations, true)
                    || in_array((string) $task->category_id, $specializations, true)
                    || in_array($task->category_snapshot['name'] ?? null, $specializations, true);
            })
            ->sortBy(fn (DesignerProfile $profile) => [
                $profile->assignment_priority,
                $this->priority->activeWorkload($profile),
                $profile->status === 'semi_off' ? 1 : 0,
            ])
            ->first();
    }

    public function enqueue(Task $task, string $taskType = TaskTypeEnum::NEW_TASK->value, ?int $designerId = null): TaskQueue
    {
        return DB::transaction(function () use ($task, $taskType, $designerId) {
            $designerProfile = $designerId
                ? DesignerProfile::where('user_id', $designerId)->first()
                : null;

            if (! $designerProfile && $task->assigned_designer_id) {
                $designerProfile = DesignerProfile::where('user_id', $task->assigned_designer_id)->first();
            }

            if (! $designerProfile) {
                $designerProfile = $this->recommendDesigner($task);
            }

            if (! $designerProfile || $designerProfile->status === DesignerAvailabilityEnum::OFF->value) {
                throw ValidationException::withMessages([
                    'assigned_designer_id' => 'Tidak ada desainer valid untuk task ODDS ini.',
                ]);
            }

            $score = $this->priority->score($task, $designerProfile);
            $activeWorkload = $this->priority->activeWorkload($designerProfile);
            $start = now()->startOfHour();

            if ($activeWorkload >= $designerProfile->daily_capacity_points) {
                $start = now()->addDay()->startOfDay();
            }

            $queue = TaskQueue::create([
                'task_id' => $task->id,
                'designer_id' => $designerProfile->user_id,
                'queue_status' => 'queued',
                'task_type' => $taskType,
                'priority_score' => $score,
                'estimated_start_at' => $start,
                'estimated_finish_at' => $start->copy()->addHours(max(1, $task->workload_point)),
            ]);

            $task->update([
                'assigned_designer_id' => $designerProfile->user_id,
                'current_queue_id' => $queue->id,
                'task_type' => $taskType,
                'priority_score' => $score,
                'status' => TaskStatusEnum::QUEUED->value,
            ]);

            $this->notifications->send(
                $task->requester,
                'task_queued',
                'Task ODDS masuk antrean',
                'Task masuk antrean dengan estimasi mulai '.$queue->estimated_start_at?->format('Y-m-d H:i').'.',
                $task
            );
            $this->notifications->send(
                $task->assignedDesigner,
                'task_queued',
                'Task baru masuk antrean',
                'Task ODDS baru masuk antrean kerja Anda.',
                $task
            );

            activity('odds')->performedOn($task)->event('task_queued')->log('Task queued');

            return $queue->refresh();
        });
    }

    public function nextForDesigner(int $designerId): ?TaskQueue
    {
        return TaskQueue::query()
            ->with('task')
            ->where('designer_id', $designerId)
            ->where('queue_status', 'queued')
            ->orderByDesc('priority_score')
            ->orderBy('created_at')
            ->first();
    }

    public function assertIsNext(Task $task, int $designerId): void
    {
        $next = $this->nextForDesigner($designerId);

        if ($next && $next->task_id !== $task->id) {
            throw ValidationException::withMessages([
                'task_id' => 'Desainer wajib memulai task prioritas tertinggi terlebih dahulu.',
            ]);
        }
    }

    public function requestSkip(Task $task, int $designerId, string $reason): TaskSkipRequest
    {
        activity('odds')->performedOn($task)->event('task_skip_requested')->log($reason);

        return TaskSkipRequest::create([
            'task_id' => $task->id,
            'designer_id' => $designerId,
            'reason' => $reason,
            'status' => 'pending',
        ]);
    }

    public function reviewSkip(TaskSkipRequest $request, int $reviewerId, string $decision, ?string $note = null): TaskSkipRequest
    {
        return DB::transaction(function () use ($request, $reviewerId, $decision, $note) {
            $request->update([
                'status' => $decision,
                'reviewed_by' => $reviewerId,
                'reviewed_at' => now(),
                'review_note' => $note,
            ]);

            if ($decision === 'approved') {
                $request->task->currentQueue?->update([
                    'queue_status' => 'skipped',
                    'skip_reason' => $request->reason,
                    'skipped_at' => now(),
                ]);
                $this->enqueue($request->task, $request->task->task_type);
            }

            return $request->refresh();
        });
    }
}
