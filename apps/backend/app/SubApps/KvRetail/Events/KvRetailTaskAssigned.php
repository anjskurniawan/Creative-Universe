<?php

namespace App\SubApps\KvRetail\Events;

use App\SubApps\KvRetail\Models\KvRetailTask;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KvRetailTaskAssigned implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public KvRetailTask $task,
        public array $userIds,
    ) {}

    /**
     * @return array<int, Channel>
     */
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
        return 'kv-retail.task.assigned';
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->loadMissing('users')->toArray(),
        ];
    }
}
