<?php

namespace App\Services\Odds;

use App\Enums\Odds\TaskStatusEnum;
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
        $autoDone = 0;

        Task::query()
            ->whereNotIn('status', [TaskStatusEnum::DONE->value, TaskStatusEnum::CANCELLED->value, TaskStatusEnum::CANCELLED_BY_SPV->value])
            ->where('deadline', '<', now())
            ->chunkById(50, function ($tasks) use (&$overdue) {
                foreach ($tasks as $task) {
                    activity('odds')->performedOn($task)->event('task_overdue')->log('Task overdue');
                    $this->notifications->send($task->assignedDesigner, 'task_overdue', 'Task ODDS overdue', 'Task melewati deadline.', $task);
                    $overdue++;
                }
            });

        Task::query()
            ->where('status', TaskStatusEnum::CLIENT_REVIEW->value)
            ->where('updated_at', '<', now()->subDays(3))
            ->get()
            ->each(function (Task $task) use (&$autoDone) {
                $this->revisions->autoDone($task, 'Client timeout auto done');
                $autoDone++;
            });

        return ['overdue' => $overdue, 'auto_done' => $autoDone];
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

            return $task->refresh();
        }

        return $task->cancelRequests()->create([
            'requested_by' => $userId,
            'reason' => $reason,
            'status' => 'pending',
        ]);
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
}
