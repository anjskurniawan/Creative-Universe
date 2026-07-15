<?php

namespace App\SubApps\Odds\Services;

use App\Enums\Odds\DesignerAvailabilityEnum;
use App\Enums\Odds\TaskStatusEnum;
use App\Models\Core\User;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\SystemRule;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskCancelRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OddsEscalationService
{
    public function __construct(
        private OddsQueueService $queue,
        private OddsRevisionService $revisions,
        private OddsTimeLogService $timeLogs,
        private OddsTaskConversationService $conversations,
        private OddsNotificationService $notifications
    ) {}

    public function runSchedulerChecks(): array
    {
        $overdue = 0;
        $reminders = 0;
        $autoDone = 0;
        $noResponseHours = (int) data_get($this->ruleValue('no_response_hours', ['hours' => 24]), 'hours', 24);
        $clientTimeoutDays = (int) data_get($this->ruleValue('client_review_timeout_days', ['days' => 3]), 'days', 3);

        Task::query()
            ->whereNotIn('status', [TaskStatusEnum::DONE->value, TaskStatusEnum::CANCELLED->value, TaskStatusEnum::CANCELLED_BY_SPV->value])
            ->where('deadline', '<', now())
            ->chunkById(50, function ($tasks) use (&$overdue) {
                foreach ($tasks as $task) {
                    activity('odds')->performedOn($task)->event('task_overdue')->log('Task overdue');
                    $this->notifications->send($task->assignedDesigner, 'task_overdue', 'Task ODDS overdue', 'Task melewati deadline.', $task);
                    $this->notifications->send($task->requester, 'task_overdue', 'Task ODDS overdue', 'Task melewati deadline.', $task);
                    $overdue++;
                }
            });

        Task::query()
            ->whereIn('status', [
                TaskStatusEnum::SUBMITTED->value,
                TaskStatusEnum::BRIEF_REVISION_REQUESTED->value,
                TaskStatusEnum::QUEUED->value,
                TaskStatusEnum::IN_PROGRESS->value,
                TaskStatusEnum::SPV_REVIEW->value,
                TaskStatusEnum::CLIENT_REVIEW->value,
            ])
            ->where('updated_at', '<', now()->subHours($noResponseHours))
            ->chunkById(50, function ($tasks) use (&$reminders) {
                foreach ($tasks as $task) {
                    activity('odds')->performedOn($task)->event('no_response_reminder')->log('No response reminder');
                    $this->notifyCurrentOwner($task);
                    $reminders++;
                }
            });

        Task::query()
            ->where('status', TaskStatusEnum::CLIENT_REVIEW->value)
            ->where('updated_at', '<', now()->subDays($clientTimeoutDays))
            ->get()
            ->each(function (Task $task) use (&$autoDone) {
                $this->revisions->autoDone($task, 'Client timeout auto done');
                $autoDone++;
            });

        return ['overdue' => $overdue, 'reminders' => $reminders, 'auto_done' => $autoDone];
    }

    public function requestCancel(Task $task, int $userId, string $reason): Task|TaskCancelRequest
    {
        if (! $task->started_at) {
            $task->update([
                'status' => TaskStatusEnum::CANCELLED->value,
                'cancel_reason' => $reason,
                'cancelled_at' => now(),
            ]);
            activity('odds')->performedOn($task)->event('task_cancelled')->log($reason);
            $this->conversations->closeForTask($task->refresh(), 'Task dibatalkan client sebelum dimulai.');
            $this->notifications->send($task->assignedDesigner, 'task_cancelled', 'Task ODDS dibatalkan', $reason, $task);

            return $task->refresh();
        }

        $cancelRequest = $task->cancelRequests()->create([
            'requested_by' => $userId,
            'reason' => $reason,
            'status' => 'pending',
        ]);

        $this->notifications->sendToRoles(['Manajer', 'SPV'], 'cancel_requested', 'Cancel ODDS perlu review', $reason, $task);
        activity('odds')->performedOn($task)->event('cancel_requested')->log($reason);

        return $cancelRequest;
    }

    public function reviewCancel(TaskCancelRequest $request, int $reviewerId, string $decision, ?string $note = null): TaskCancelRequest
    {
        return DB::transaction(function () use ($request, $reviewerId, $decision, $note) {
            $request->update([
                'status' => $decision,
                'reviewed_by' => $reviewerId,
                'reviewed_at' => now(),
                'review_note' => $note,
            ]);

            if ($decision === 'approved') {
                $request->task->update([
                    'status' => TaskStatusEnum::CANCELLED->value,
                    'cancel_reason' => $request->reason,
                    'cancelled_at' => now(),
                ]);
                activity('odds')->performedOn($request->task)->event('task_cancelled')->log($request->reason);
                $this->conversations->closeForTask($request->task->refresh(), 'Task dibatalkan setelah request cancel disetujui.');
                $this->notifications->send($request->task->requester, 'cancel_approved', 'Cancel ODDS disetujui', $request->reason, $request->task);
                $this->notifications->send($request->task->assignedDesigner, 'cancel_approved', 'Task ODDS dibatalkan', $request->reason, $request->task);
            } else {
                activity('odds')->performedOn($request->task)->event('cancel_rejected')->log($note ?? 'Cancel rejected');
                $this->notifications->send($request->task->requester, 'cancel_rejected', 'Cancel ODDS ditolak', $note ?? 'Cancel request ditolak SPV.', $request->task);
            }

            return $request->refresh();
        });
    }

    public function reassign(Task $task, int $designerId, int $reviewerId): Task
    {
        return DB::transaction(function () use ($task, $designerId, $reviewerId) {
            if (in_array($task->status, [
                TaskStatusEnum::DONE->value,
                TaskStatusEnum::CANCELLED->value,
                TaskStatusEnum::CANCELLED_BY_SPV->value,
            ], true)) {
                throw ValidationException::withMessages([
                    'task_id' => 'Task yang sudah selesai atau dibatalkan tidak bisa direassign.',
                ]);
            }

            if ((int) $task->assigned_designer_id === $designerId) {
                throw ValidationException::withMessages([
                    'designer_id' => 'Task ini sudah diassign ke desainer tersebut.',
                ]);
            }

            $profile = DesignerProfile::query()
                ->where('user_id', $designerId)
                ->where('is_active', true)
                ->first();

            if (! $profile || $profile->status === DesignerAvailabilityEnum::OFF->value) {
                throw ValidationException::withMessages([
                    'designer_id' => 'Desainer tujuan tidak aktif atau sedang off.',
                ]);
            }

            $this->assertDesignerCanTakeTask($task, $profile);

            $oldDesigner = $task->assignedDesigner;
            $oldDesignerId = $task->assigned_designer_id;
            $oldStatus = $task->status;
            $taskType = $task->task_type;

            if ($oldStatus === TaskStatusEnum::IN_PROGRESS->value) {
                $this->timeLogs->stopOpen($task, 'work');
                $this->timeLogs->stopOpen($task, 'revision');
            }

            $task->queueEntries()
                ->whereIn('queue_status', ['queued', 'ready_to_start'])
                ->update([
                    'queue_status' => 'reassigned',
                    'completed_at' => now(),
                ]);

            if ($this->shouldRequeueAfterReassign($oldStatus)) {
                $task->revisions()
                    ->whereNull('completed_at')
                    ->whereIn('status', ['open', 'queued', 'approved'])
                    ->latest('id')
                    ->first()
                    ?->update(['assigned_to' => $designerId]);
            }

            $task->update([
                'assigned_designer_id' => $designerId,
                'updated_by' => $reviewerId,
            ]);

            if ($this->shouldRequeueAfterReassign($oldStatus)) {
                $this->queue->enqueue($task->refresh(), $taskType, $designerId);
            }

            $task->refresh()->load(['requester', 'assignedDesigner', 'currentQueue']);
            $this->conversations->syncParticipants($task);
            $this->queue->refreshEstimates($oldDesignerId);
            $this->queue->refreshEstimates($designerId);

            activity('odds')->performedOn($task)->event('task_reassigned')->log(sprintf(
                'Task reassigned from %s to %s',
                $oldDesigner?->name ?? 'unassigned',
                $task->assignedDesigner?->name ?? 'unknown'
            ));

            $this->notifications->send($oldDesigner, 'task_reassigned_from', 'Task ODDS dipindahkan', 'Task dipindahkan ke desainer lain.', $task);
            $this->notifications->send($task->assignedDesigner, 'task_reassigned_to', 'Task ODDS baru dialihkan ke Anda', 'Task ODDS dialihkan dan perlu ditindaklanjuti.', $task);
            $this->notifications->send($task->requester, 'task_reassigned', 'Designer ODDS diperbarui', 'Task dialihkan ke '.$task->assignedDesigner?->name.'.', $task);

            return $task->refresh()->load(['assignedDesigner', 'currentQueue']);
        });
    }

    public function extendDeadline(Task $task, string $deadline, ?string $note, int $reviewerId): Task
    {
        $task->update([
            'deadline' => $deadline,
            'updated_by' => $reviewerId,
        ]);
        activity('odds')->performedOn($task)->event('deadline_extended')->log($note ?? 'Deadline extended');

        return $task->refresh();
    }

    private function ruleValue(string $key, array $default): array
    {
        $value = SystemRule::query()
            ->where('key', $key)
            ->where('is_active', true)
            ->value('value');

        return is_array($value) ? $value : $default;
    }

    private function notifyCurrentOwner(Task $task): void
    {
        match ($task->status) {
            TaskStatusEnum::SUBMITTED->value,
            TaskStatusEnum::QUEUED->value,
            TaskStatusEnum::IN_PROGRESS->value => $this->notifications->send($task->assignedDesigner, 'no_response_reminder', 'Reminder ODDS', 'Task perlu ditindaklanjuti.', $task),
            TaskStatusEnum::BRIEF_REVISION_REQUESTED->value,
            TaskStatusEnum::CLIENT_REVIEW->value => $this->notifications->send($task->requester, 'no_response_reminder', 'Reminder ODDS', 'Task perlu ditindaklanjuti.', $task),
            TaskStatusEnum::SPV_REVIEW->value => User::role(['Manajer', 'SPV'])->get()->each(fn (User $user) => $this->notifications->send($user, 'no_response_reminder', 'Reminder review ODDS', 'Output menunggu review SPV.', $task)),
            default => null,
        };
    }

    private function shouldRequeueAfterReassign(string $status): bool
    {
        return in_array($status, [
            TaskStatusEnum::QUEUED->value,
            TaskStatusEnum::READY_TO_START->value,
            TaskStatusEnum::IN_PROGRESS->value,
        ], true);
    }

    private function assertDesignerCanTakeTask(Task $task, DesignerProfile $profile): void
    {
        $specializations = $profile->specializations ?? [];
        $categoryName = $task->category_snapshot['name'] ?? null;

        if (
            $specializations !== []
            && ! in_array($task->category_id, $specializations, true)
            && ! in_array((string) $task->category_id, $specializations, true)
            && ! in_array($categoryName, $specializations, true)
        ) {
            throw ValidationException::withMessages([
                'designer_id' => 'Desainer tujuan tidak cocok dengan kategori task ini.',
            ]);
        }

        if ($task->workload_point > $profile->daily_capacity_points) {
            throw ValidationException::withMessages([
                'designer_id' => 'Workload task melebihi daily capacity desainer tujuan.',
            ]);
        }
    }
}
