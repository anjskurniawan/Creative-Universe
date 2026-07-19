<?php

namespace App\SubApps\KvRetail\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KvRetailTaskDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /** @param array<int, int> $userIds */
    public function __construct(
        public int $taskId,
        public array $userIds,
    ) {}

    /** @return array<int, Channel> */
    public function broadcastOn(): array
    {
        return collect($this->userIds)
            ->unique()
            ->map(fn (int $userId) => new PrivateChannel('App.Models.Core.User.'.$userId))
            ->values()
            ->all();
    }

    public function broadcastAs(): string
    {
        return 'kv-retail.task.deleted';
    }

    public function broadcastWith(): array
    {
        return ['task_id' => $this->taskId];
    }
}
