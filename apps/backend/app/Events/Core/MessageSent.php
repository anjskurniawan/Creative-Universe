<?php

namespace App\Events\Core;

use App\Models\Core\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('conversation.'.$this->message->conversation_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        $message = $this->message->loadMissing(['sender.roles:id,name', 'replyTo.sender.roles:id,name']);
        $payload = $message->toArray();

        if ($message->sender) {
            $payload['sender']['roles'] = $message->sender->roles->pluck('name')->values()->all();
        }
        if ($message->replyTo?->sender) {
            $payload['reply_to']['sender']['roles'] = $message->replyTo->sender->roles->pluck('name')->values()->all();
        }

        return ['message' => $payload];
    }
}
