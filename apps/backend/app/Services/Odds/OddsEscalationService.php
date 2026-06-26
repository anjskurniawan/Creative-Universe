<?php

namespace App\Services\Odds;

use App\Enums\Odds\TaskStatusEnum;
use App\Models\Core\User;
use App\Models\Odds\SystemRule;
use App\Models\Odds\Task;
use App\Models\Odds\TaskCancelRequest;
use Illuminate\Support\Facades\DB;

class OddsEscalationService
{
    public function __construct(
        private OddsQueueService $queue,
        private OddsRevisionService $revisions,
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
        $task->update([
            'assigned_designer_id' => $designerId,
            'updated_by' => $reviewerId,
        ]);
        $this->queue->enqueue($task, $task->task_type, $designerId);
        activity('odds')->performedOn($task)->event('task_reassigned')->log('Task reassigned');

        return $task->refresh()->load(['assignedDesigner', 'currentQueue']);
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
}
