<?php

namespace App\Services\Odds;

use App\Enums\Odds\TaskStatusEnum;
use App\Models\Core\User;
use App\Models\Odds\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OddsBriefReviewService
{
    public function __construct(
        private OddsConfigService $config,
        private OddsQueueService $queue,
        private OddsTaskConversationService $conversations,
        private OddsNotificationService $notifications
    ) {}

    public function returnBrief(Task $task, string $note, int $reviewerId): Task
    {
        if ($task->status !== TaskStatusEnum::SUBMITTED->value) {
            throw ValidationException::withMessages([
                'task_id' => 'Brief hanya bisa dikembalikan saat status submitted.',
            ]);
        }

        if ($task->assigned_designer_id !== $reviewerId) {
            throw ValidationException::withMessages([
                'task_id' => 'Task ini bukan assignment desainer tersebut.',
            ]);
        }

        $task->increment('brief_return_count');
        $task->update([
            'status' => TaskStatusEnum::BRIEF_REVISION_REQUESTED->value,
            'updated_by' => $reviewerId,
        ]);

        $task->brief?->update([
            'last_return_note' => $note,
            'updated_by' => $reviewerId,
        ]);

        activity('odds')->performedOn($task)->event('brief_returned')->log($note);

        $limit = (int) data_get($this->config->ruleValue('brief_return_limit', ['count' => 2]), 'count', 2);
        $event = $task->brief_return_count >= $limit ? 'brief_escalated_to_spv' : 'brief_update_required';

        $this->notifications->send($task->requester, $event, 'Brief ODDS perlu diperbarui', $note, $task);

        if ($event === 'brief_escalated_to_spv') {
            User::permission('review-odds-spv')->get()->each(function (User $spv) use ($note, $task) {
                $this->notifications->send($spv, 'brief_escalated_to_spv', 'Brief ODDS perlu keputusan SPV', $note, $task);
            });
        }

        return $task->refresh()->load('brief');
    }

    public function acceptBrief(Task $task, int $reviewerId): Task
    {
        return DB::transaction(function () use ($task, $reviewerId) {
            $task = Task::query()->whereKey($task->id)->lockForUpdate()->firstOrFail();

            if ($task->status !== TaskStatusEnum::SUBMITTED->value) {
                throw ValidationException::withMessages([
                    'task_id' => 'Brief hanya bisa diterima saat status submitted.',
                ]);
            }

            if ($task->assigned_designer_id !== $reviewerId) {
                throw ValidationException::withMessages([
                    'task_id' => 'Task ini bukan assignment desainer tersebut.',
                ]);
            }

            $task->update(['updated_by' => $reviewerId]);
            activity('odds')->performedOn($task)->event('brief_accepted')->log('Designer accepted brief');
            $queue = $this->queue->enqueue($task);
            $this->conversations->openForTask($queue->task->refresh());

            return $queue->task->refresh()->load(['brief', 'currentQueue', 'assignedDesigner']);
        });
    }

    public function forceContinue(Task $task, int $reviewerId): Task
    {
        return DB::transaction(function () use ($task, $reviewerId) {
            $task = Task::query()->whereKey($task->id)->lockForUpdate()->firstOrFail();

            $task->update(['updated_by' => $reviewerId]);
            activity('odds')->performedOn($task)->event('brief_forced_continue')->log('SPV forced brief into queue');
            $this->queue->enqueue($task);
            $this->conversations->openForTask($task->refresh());

            return $task->refresh()->load(['currentQueue', 'assignedDesigner']);
        });
    }

    public function cancelBySpv(Task $task, string $reason, int $reviewerId): Task
    {
        $task->update([
            'status' => TaskStatusEnum::CANCELLED_BY_SPV->value,
            'cancel_reason' => $reason,
            'cancelled_at' => now(),
            'updated_by' => $reviewerId,
        ]);

        activity('odds')->performedOn($task)->event('task_cancelled')->log($reason);
        $this->conversations->closeForTask($task->refresh(), 'Task dibatalkan SPV.');
        $this->notifications->send($task->requester, 'task_cancelled', 'Task ODDS dibatalkan SPV', $reason, $task);

        return $task->refresh();
    }
}
