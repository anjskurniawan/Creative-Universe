<?php

namespace App\Services\Odds;

use App\Enums\Odds\DesignerAvailabilityEnum;
use App\Enums\Odds\TaskStatusEnum;
use App\Enums\Odds\TaskTypeEnum;
use App\Models\Odds\DesignerProfile;
use App\Models\Odds\Task;
use App\Models\Odds\TaskQueue;
use App\Models\Odds\TaskSkipRequest;
use Carbon\Carbon;
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
            [$start, $finish] = $this->estimateWindow($task, $designerProfile, $score);

            $queue = TaskQueue::create([
                'task_id' => $task->id,
                'designer_id' => $designerProfile->user_id,
                'queue_status' => 'queued',
                'task_type' => $taskType,
                'priority_score' => $score,
                'estimated_start_at' => $start,
                'estimated_finish_at' => $finish,
            ]);

            $task->update([
                'assigned_designer_id' => $designerProfile->user_id,
                'current_queue_id' => $queue->id,
                'task_type' => $taskType,
                'priority_score' => $score,
                'status' => TaskStatusEnum::QUEUED->value,
            ]);

            $isLeaderRevision = $taskType === TaskTypeEnum::LEADER_REVISION->value;
            $designerTitle = match ($taskType) {
                TaskTypeEnum::LEADER_REVISION->value => 'Revisi SPV masuk antrean',
                TaskTypeEnum::CLIENT_REVISION->value => 'Revisi client masuk antrean',
                TaskTypeEnum::EXTRA_REVISION->value => 'Extra revision masuk antrean',
                TaskTypeEnum::URGENT_REVISION->value => 'Urgent revision masuk antrean',
                default => 'Task baru masuk antrean',
            };
            $designerMessage = match ($taskType) {
                TaskTypeEnum::LEADER_REVISION->value => 'SPV meminta revisi. Task masuk antrean kerja Anda.',
                TaskTypeEnum::CLIENT_REVISION->value => 'Client meminta revisi. Task masuk antrean kerja Anda.',
                TaskTypeEnum::EXTRA_REVISION->value => 'Extra revision sudah disetujui dan masuk antrean kerja Anda.',
                TaskTypeEnum::URGENT_REVISION->value => 'Urgent final revision sudah disetujui dan masuk antrean kerja Anda.',
                default => 'Task ODDS baru masuk antrean kerja Anda.',
            };

            if (! $isLeaderRevision) {
                $this->notifications->send(
                    $task->requester,
                    'task_queued',
                    'Task ODDS masuk antrean',
                    'Task masuk antrean dengan estimasi mulai '.$queue->estimated_start_at?->format('Y-m-d H:i').'.',
                    $task
                );
            }

            $this->notifications->send(
                $task->assignedDesigner,
                'task_queued',
                $designerTitle,
                $designerMessage,
                $task
            );

            activity('odds')->performedOn($task)->event('task_queued')->log('Task queued');

            return $queue->refresh();
        });
    }

    private function estimateWindow(Task $task, DesignerProfile $designerProfile, float|int|string $score): array
    {
        $cursor = $this->nextWorkingHour(now());

        $activeHours = Task::query()
            ->where('assigned_designer_id', $designerProfile->user_id)
            ->where('status', TaskStatusEnum::IN_PROGRESS->value)
            ->whereKeyNot($task->id)
            ->sum('workload_point');

        if ($activeHours > 0) {
            $cursor = $this->addWorkingHours($cursor, (int) $activeHours);
        }

        $queuedBefore = TaskQueue::query()
            ->with('task:id,workload_point')
            ->where('designer_id', $designerProfile->user_id)
            ->where('queue_status', 'queued')
            ->where('task_id', '!=', $task->id)
            ->where(function ($query) use ($score) {
                $query->where('priority_score', '>', $score)
                    ->orWhere(function ($samePriority) use ($score) {
                        $samePriority->where('priority_score', $score)
                            ->where('created_at', '<=', now());
                    });
            })
            ->orderByDesc('priority_score')
            ->orderBy('created_at')
            ->get();

        foreach ($queuedBefore as $queued) {
            $cursor = $this->addWorkingHours($cursor, max(1, (int) ($queued->task?->workload_point ?? 1)));
        }

        $start = $cursor;
        $finish = $this->addWorkingHours($start, max(1, (int) $task->workload_point));

        return [$start, $finish];
    }

    private function nextWorkingHour(Carbon $time): Carbon
    {
        $cursor = $time->copy()->minute(0)->second(0);
        if ($time->minute > 0 || $time->second > 0) {
            $cursor->addHour();
        }

        if ($cursor->hour < 9) {
            return $cursor->setTime(9, 0);
        }

        if ($cursor->hour >= 17) {
            return $cursor->addDay()->setTime(9, 0);
        }

        return $cursor;
    }

    private function addWorkingHours(Carbon $start, int $hours): Carbon
    {
        $cursor = $this->nextWorkingHour($start);
        $remaining = max(1, $hours);

        while ($remaining > 0) {
            $availableToday = 17 - $cursor->hour;
            if ($availableToday <= 0) {
                $cursor = $this->nextWorkingHour($cursor->addDay()->setTime(9, 0));
                continue;
            }

            $step = min($remaining, $availableToday);
            $cursor->addHours($step);
            $remaining -= $step;
        }

        return $cursor;
    }

    public function nextForDesigner(int $designerId): ?TaskQueue
    {
        $this->refreshEstimates($designerId);

        return TaskQueue::query()
            ->with('task')
            ->where('designer_id', $designerId)
            ->where('queue_status', 'queued')
            ->orderByDesc('priority_score')
            ->orderBy('created_at')
            ->first();
    }

    public function refreshEstimates(?int $designerId = null): void
    {
        $designerIds = TaskQueue::query()
            ->where('queue_status', 'queued')
            ->when($designerId, fn ($query) => $query->where('designer_id', $designerId))
            ->distinct()
            ->pluck('designer_id');

        foreach ($designerIds as $queuedDesignerId) {
            $cursor = $this->nextWorkingHour(now());
            $activeHours = Task::query()
                ->where('assigned_designer_id', $queuedDesignerId)
                ->where('status', TaskStatusEnum::IN_PROGRESS->value)
                ->sum('workload_point');

            if ($activeHours > 0) {
                $cursor = $this->addWorkingHours($cursor, (int) $activeHours);
            }

            $queuedItems = TaskQueue::query()
                ->with('task:id,workload_point')
                ->where('designer_id', $queuedDesignerId)
                ->where('queue_status', 'queued')
                ->orderByDesc('priority_score')
                ->orderBy('created_at')
                ->get();

            foreach ($queuedItems as $queued) {
                $start = $cursor;
                $finish = $this->addWorkingHours($start, max(1, (int) ($queued->task?->workload_point ?? 1)));
                $queued->update([
                    'estimated_start_at' => $start,
                    'estimated_finish_at' => $finish,
                ]);
                $cursor = $finish;
            }
        }
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
