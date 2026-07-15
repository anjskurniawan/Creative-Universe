<?php

namespace App\Policies\Core;

use App\Models\Core\Conversation;
use App\Models\Core\User;
use App\SubApps\Odds\Contracts\OddsTaskReader;

class ConversationPolicy
{
    public function __construct(private readonly OddsTaskReader $oddsTasks) {}

    public function view(User $user, Conversation $conversation): bool
    {
        if ($conversation->users()->whereKey($user->id)->exists()) {
            return true;
        }

        if ($conversation->context_type !== Conversation::CONTEXT_ODDS_TASK || ! $conversation->context_id) {
            return false;
        }

        $task = $this->oddsTasks->findSummary((int) $conversation->context_id);

        return $task && (
            $user->can('view-all-odds-tasks')
            || ($user->can('view-own-odds-tasks') && $task->requesterId === $user->id)
            || ($user->can('view-assigned-odds-tasks') && $task->assignedDesignerId === $user->id)
        );
    }

    public function sendMessage(User $user, Conversation $conversation): bool
    {
        if ($conversation->status === Conversation::STATUS_CLOSED) {
            return false;
        }

        if (! $conversation->users()->whereKey($user->id)->exists()) {
            return false;
        }

        if ($conversation->context_type !== Conversation::CONTEXT_ODDS_TASK) {
            return true;
        }

        $task = $conversation->context_id
            ? $this->oddsTasks->findSummary((int) $conversation->context_id)
            : null;

        return $task
            && ($task->requesterId === $user->id || $task->assignedDesignerId === $user->id);
    }
}
