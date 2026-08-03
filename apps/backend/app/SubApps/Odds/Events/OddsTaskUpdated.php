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
        // Realtime events must stay small. The detail page fetches the complete
        // task from the API, so large collections (history, outputs, reviews,
        // revisions and time logs) must never be published through Pusher.
        $task = $this->task;

        return [
            'task' => array_merge($task->withoutRelations()->toArray(), [
                'category' => $task->category?->only(['id', 'name']),
                'requester' => $task->requester?->only(['id', 'name', 'avatar']),
                'assigned_designer' => $task->assignedDesigner?->only(['id', 'name', 'avatar']),
                'assignedDesigner' => $task->assignedDesigner?->only(['id', 'name', 'avatar']),
                'current_queue' => $task->currentQueue?->only(['id', 'status', 'started_at']),
            ]),
        ];
    }
}
