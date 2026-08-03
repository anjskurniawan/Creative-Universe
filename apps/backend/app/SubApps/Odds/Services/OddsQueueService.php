<?php

namespace App\SubApps\Odds\Services;

use App\Enums\Odds\DesignerAvailabilityEnum;
use App\Enums\Odds\TaskStatusEnum;
use App\Enums\Odds\TaskTypeEnum;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskQueue;
use App\SubApps\Odds\Models\TaskPriorityRequest;
use App\SubApps\Odds\Models\TaskSkipRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OddsQueueService
{
    private const MONTHLY_PRIORITY_REQUEST_LIMIT = 5;
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
                $this->priority->activeWorkload($profile),
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

        $activeCount = Task::query()
            ->where('assigned_designer_id', $designerProfile->user_id)
            ->where('status', TaskStatusEnum::IN_PROGRESS->value)
            ->whereKeyNot($task->id)
            ->count();

        if ($activeCount > 0) {
            $cursor = $this->addWorkingHours($cursor, $activeCount * 2);
        }

        $queuedBefore = TaskQueue::query()
            ->with('task')
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
            $taskSla = (int) ($queued->task?->category_snapshot['sla_minutes'] ?? 120);
            $taskHours = max(1, (int) ceil($taskSla / 60));
            $cursor = $this->addWorkingHours($cursor, $taskHours);
        }

        $start = $cursor;
        $currentTaskSla = (int) ($task->category_snapshot['sla_minutes'] ?? 120);
        $currentTaskHours = max(1, (int) ceil($currentTaskSla / 60));
        $finish = $this->addWorkingHours($start, $currentTaskHours);

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
            $activeCount = Task::query()
                ->where('assigned_designer_id', $queuedDesignerId)
                ->where('status', TaskStatusEnum::IN_PROGRESS->value)
                ->count();

            if ($activeCount > 0) {
                $cursor = $this->addWorkingHours($cursor, $activeCount * 2);
            }

            $queuedItems = TaskQueue::query()
                ->with('task')
                ->where('designer_id', $queuedDesignerId)
                ->where('queue_status', 'queued')
                ->orderByDesc('priority_score')
                ->orderBy('created_at')
                ->get();

            foreach ($queuedItems as $queued) {
                $start = $cursor;
                $taskSla = (int) ($queued->task?->category_snapshot['sla_minutes'] ?? 120);
                $taskHours = max(1, (int) ceil($taskSla / 60));
                $finish = $this->addWorkingHours($start, $taskHours);
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
        if ($task->assigned_designer_id !== $designerId) {
            throw ValidationException::withMessages([
                'task_id' => 'Permintaan skip hanya dapat diajukan oleh desainer yang ditugaskan.',
            ]);
        }

        if (! in_array($task->status, [TaskStatusEnum::QUEUED->value, TaskStatusEnum::READY_TO_START->value], true)) {
            throw ValidationException::withMessages([
                'task_id' => 'Permintaan skip hanya tersedia saat task berada dalam antrean.',
            ]);
        }

        if ($task->skipRequests()->where('status', 'pending')->exists()) {
            throw ValidationException::withMessages([
                'task_id' => 'Permintaan skip untuk task ini masih menunggu review.',
            ]);
        }

        $this->assertIsNext($task, $designerId);
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
        if ($request->status !== 'pending') {
            throw ValidationException::withMessages([
                'skip_request_id' => 'Permintaan skip ini sudah ditinjau.',
            ]);
        }

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

    public function requestPriority(Task $task, int $requesterId, string $reason): TaskPriorityRequest
    {
        if ($task->requester_id !== $requesterId) {
            throw ValidationException::withMessages([
                'task_id' => 'Prioritas antrean hanya dapat diajukan oleh Client pemilik task.',
            ]);
        }

        if (! in_array($task->status, [TaskStatusEnum::QUEUED->value, TaskStatusEnum::READY_TO_START->value], true)) {
            throw ValidationException::withMessages([
                'task_id' => 'Prioritas antrean hanya tersedia saat task berada dalam antrean.',
            ]);
        }

        if ($task->priorityRequests()->where('status', 'pending')->exists()) {
            throw ValidationException::withMessages([
                'task_id' => 'Permintaan prioritas untuk task ini masih menunggu approval Leader.',
            ]);
        }

        $usedThisMonth = TaskPriorityRequest::query()
            ->where('requested_by', $requesterId)
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->count();

        if ($usedThisMonth >= self::MONTHLY_PRIORITY_REQUEST_LIMIT) {
            throw ValidationException::withMessages([
                'priority' => 'Kuota prioritas antrean bulan ini sudah habis (maksimal 5 pengajuan).',
            ]);
        }

        $request = $task->priorityRequests()->create([
            'requested_by' => $requesterId,
            'reason' => $reason,
            'status' => 'pending',
        ]);

        $this->notifications->sendToRoles(['Manajer', 'Supervisor', 'SPV'], 'priority_requested', 'Prioritas antrean perlu approval Leader', $reason, $task);
        activity('odds')->performedOn($task)->event('priority_requested')->log($reason);

        return $request;
    }

    public function reviewPriority(TaskPriorityRequest $request, int $reviewerId, string $decision, ?string $note = null): TaskPriorityRequest
    {
        if ($request->status !== 'pending') {
            throw ValidationException::withMessages([
                'priority_request_id' => 'Permintaan prioritas ini sudah ditinjau.',
            ]);
        }

        return DB::transaction(function () use ($request, $reviewerId, $decision, $note) {
            $request->update([
                'status' => $decision,
                'reviewed_by' => $reviewerId,
                'reviewed_at' => now(),
                'review_note' => $note,
            ]);

            $task = $request->task->refresh();
            if ($decision === 'approved') {
                $queue = $task->currentQueue;
                if ($queue) {
                    $highestScore = TaskQueue::query()
                        ->where('designer_id', $queue->designer_id)
                        ->whereIn('queue_status', ['queued', 'ready_to_start'])
                        ->max('priority_score') ?? 0;

                    $queue->update(['priority_score' => $highestScore + 1]);
                    $task->update(['priority_score' => $highestScore + 1]);
                    $this->refreshEstimates($queue->designer_id);
                }

                activity('odds')->performedOn($task)->event('priority_approved')->log($request->reason);
                $this->notifications->send($task->requester, 'priority_approved', 'Prioritas antrean disetujui', $request->reason, $task);
                $this->notifications->send($task->assignedDesigner, 'priority_approved', 'Task diprioritaskan dalam antrean', $request->reason, $task);
            } else {
                activity('odds')->performedOn($task)->event('priority_rejected')->log($note ?? 'Priority request rejected');
                $this->notifications->send($task->requester, 'priority_rejected', 'Prioritas antrean ditolak', $note ?? 'Permintaan prioritas ditolak Leader.', $task);
            }

            return $request->refresh();
        });
    }
}
