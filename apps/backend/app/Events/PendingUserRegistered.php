<?php

namespace App\Events;

use App\Models\Core\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PendingUserRegistered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public User $user) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('admin.notifications');
    }

    public function broadcastAs(): string
    {
        return 'PendingUserRegistered';
    }

    /** @return array{user_id: int, registered_at: string|null} */
    public function broadcastWith(): array
    {
        return [
            'user_id' => $this->user->id,
            'registered_at' => $this->user->created_at?->toIso8601String(),
        ];
    }
}
