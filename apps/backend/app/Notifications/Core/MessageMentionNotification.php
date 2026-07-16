<?php

namespace App\Notifications\Core;

use App\Models\Core\Message;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class MessageMentionNotification extends Notification
{
    public function __construct(private Message $message) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => sprintf('%s menyebut Anda dalam sebuah pesan.', $this->message->sender?->name ?? 'Seseorang'),
            'url' => '/messages?conversation='.$this->message->conversation_id,
            'conversation_id' => $this->message->conversation_id,
            'message_id' => $this->message->id,
            'type' => 'message_mention',
        ];
    }
}
