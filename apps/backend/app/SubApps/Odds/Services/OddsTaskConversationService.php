<?php

namespace App\SubApps\Odds\Services;

use App\Models\Core\Conversation;
use App\Models\Core\User;
use App\SubApps\Odds\Contracts\OddsConversationPresenter;
use App\SubApps\Odds\Models\Task;
use Illuminate\Support\Facades\DB;

class OddsTaskConversationService implements OddsConversationPresenter
{
    public function openForTask(Task $task): ?Conversation
    {
        if (! $task->requester_id || ! $task->assigned_designer_id) {
            return null;
        }

        return DB::transaction(function () use ($task) {
            $conversation = Conversation::query()->firstOrCreate(
                [
                    'context_type' => Conversation::CONTEXT_ODDS_TASK,
                    'context_id' => $task->id,
                ],
                [
                    'status' => Conversation::STATUS_OPEN,
                ]
            );

            $conversation->update([
                'status' => Conversation::STATUS_OPEN,
                'closed_at' => null,
                'closed_reason' => null,
            ]);

            $conversation->users()->sync($this->participantIds($task));

            activity('odds')->performedOn($task)->event('task_conversation_opened')->log('ODDS task conversation opened');

            return $conversation->refresh();
        });
    }

    public function syncParticipants(Task $task): ?Conversation
    {
        $conversation = $this->findForTask($task);

        if (! $conversation || $conversation->status === Conversation::STATUS_CLOSED) {
            return $conversation;
        }

        $conversation->users()->sync($this->participantIds($task));

        activity('odds')->performedOn($task)->event('task_conversation_reassigned')->log('ODDS task conversation participants updated');

        return $conversation->refresh();
    }

    public function closeForTask(Task $task, string $reason): ?Conversation
    {
        $conversation = $this->findForTask($task);

        if (! $conversation || $conversation->status === Conversation::STATUS_CLOSED) {
            return $conversation;
        }

        $conversation->update([
            'status' => Conversation::STATUS_CLOSED,
            'closed_at' => now(),
            'closed_reason' => $reason,
        ]);

        activity('odds')->performedOn($task)->event('task_conversation_closed')->log($reason);

        return $conversation->refresh();
    }

    public function findForTask(Task $task): ?Conversation
    {
        return Conversation::query()
            ->where('context_type', Conversation::CONTEXT_ODDS_TASK)
            ->where('context_id', $task->id)
            ->first();
    }

    public function payloadForTask(Task $task, User $user): ?array
    {
        $conversation = $this->findForTask($task);

        return $conversation ? $this->payload($conversation, $user, $task) : null;
    }

    public function payload(Conversation $conversation, User $user, ?Task $task = null): array
    {
        $conversation->loadMissing(['users.roles', 'messages' => fn ($query) => $query->latest()->limit(1)]);
        $task ??= $this->taskForConversation($conversation);
        $lastMessage = $conversation->messages->first();
        $partner = $conversation->users->firstWhere('id', '!=', $user->id);

        return [
            'id' => $conversation->id,
            'context_type' => $conversation->context_type,
            'context_id' => $conversation->context_id,
            'status' => $conversation->status,
            'closed_at' => $conversation->closed_at,
            'closed_reason' => $conversation->closed_reason,
            'can_send' => $this->userCanSend($user, $conversation, $task),
            'partner' => $partner ? [
                'id' => $partner->id,
                'name' => $partner->name,
                'avatar' => $partner->avatar_path,
                'roles' => $partner->roles->pluck('name')->values(),
            ] : null,
            'participants' => $conversation->users
                ->map(fn (User $participant) => [
                    'id' => $participant->id,
                    'name' => $participant->name,
                    'avatar' => $participant->avatar_path,
                    'roles' => $participant->roles->pluck('name')->values(),
                ])
                ->values(),
            'task' => $task ? [
                'id' => $task->id,
                'task_number' => $task->task_number,
                'design_purpose' => $task->design_purpose,
                'status' => $task->status,
                'requester_id' => $task->requester_id,
                'assigned_designer_id' => $task->assigned_designer_id,
            ] : null,
            'last_message' => $lastMessage ? [
                'body' => $lastMessage->body,
                'created_at' => $lastMessage->created_at,
                'is_read' => $lastMessage->read_at !== null,
                'sender_id' => $lastMessage->sender_id,
            ] : null,
            'updated_at' => $conversation->updated_at,
        ];
    }

    public function userCanRead(User $user, Conversation $conversation, ?Task $task = null): bool
    {
        if ($conversation->users()->whereKey($user->id)->exists()) {
            return true;
        }

        $task ??= $this->taskForConversation($conversation);

        if (! $task) {
            return false;
        }

        return $this->userCanViewTask($user, $task);
    }

    public function userCanSend(User $user, Conversation $conversation, ?Task $task = null): bool
    {
        if ($conversation->status === Conversation::STATUS_CLOSED) {
            return false;
        }

        if ($conversation->context_type !== Conversation::CONTEXT_ODDS_TASK) {
            return $conversation->users()->whereKey($user->id)->exists();
        }

        $task ??= $this->taskForConversation($conversation);

        return $task
            && ((int) $task->requester_id === (int) $user->id || (int) $task->assigned_designer_id === (int) $user->id)
            && $conversation->users()->whereKey($user->id)->exists();
    }

    public function userCanViewTask(User $user, Task $task): bool
    {
        return $user->can('view-all-odds-tasks')
            || ($user->can('view-own-odds-tasks') && (int) $task->requester_id === (int) $user->id)
            || ($user->can('view-assigned-odds-tasks') && (int) $task->assigned_designer_id === (int) $user->id);
    }

    public function taskForConversation(Conversation $conversation): ?Task
    {
        if ($conversation->context_type !== Conversation::CONTEXT_ODDS_TASK || ! $conversation->context_id) {
            return null;
        }

        return Task::query()->find($conversation->context_id);
    }

    private function participantIds(Task $task): array
    {
        return collect([$task->requester_id, $task->assigned_designer_id])
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}
