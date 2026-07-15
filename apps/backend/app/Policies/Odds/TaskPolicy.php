<?php

namespace App\Policies\Odds;

use App\Models\Core\User;
use App\SubApps\Odds\Models\Task;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        return $user->can('view-all-odds-tasks')
            || ($user->can('view-own-odds-tasks') && $task->requester_id === $user->id)
            || ($user->can('view-assigned-odds-tasks') && $task->assigned_designer_id === $user->id);
    }
}
