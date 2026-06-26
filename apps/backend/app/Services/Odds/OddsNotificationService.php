<?php

namespace App\Services\Odds;

use App\Models\Core\User;
use App\Models\Odds\Task;
use App\Notifications\Odds\OddsWorkflowNotification;

class OddsNotificationService
{
    public function send(?User $user, string $event, string $title, string $message, ?Task $task = null): void
    {
        if (! $user) {
            return;
        }

        $user->notify(new OddsWorkflowNotification($event, $title, $message, $task));
    }

    public function sendToPermission(string $permission, string $event, string $title, string $message, ?Task $task = null): void
    {
        User::permission($permission)->get()->each(function (User $user) use ($event, $title, $message, $task) {
            $this->send($user, $event, $title, $message, $task);
        });
    }

    public function sendToRoles(array $roles, string $event, string $title, string $message, ?Task $task = null): void
    {
        User::role($roles)->get()->unique('id')->each(function (User $user) use ($event, $title, $message, $task) {
            $this->send($user, $event, $title, $message, $task);
        });
    }
}
