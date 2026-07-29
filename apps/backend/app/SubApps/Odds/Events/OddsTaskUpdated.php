<?php

namespace App\SubApps\Odds\Events;

use App\SubApps\Odds\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OddsTaskUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /** @param array<int, int> $userIds */
    public function __construct(public Task $task, public array $userIds) {}

    /** @return array<int, Channel> */
    public function broadcastOn(): array
    {
        return collect($this->userIds)
            ->filter()
            ->unique()
            ->map(fn (int $userId) => new PrivateChannel('App.Models.Core.User.'.$userId))
            ->values()
            ->all();
    }

    public function broadcastAs(): string
    {
        return 'odds.task.updated';
    }

    public function broadcastWith(): array
    {
        return ['task' => $this->task->toArray()];
    }
}
