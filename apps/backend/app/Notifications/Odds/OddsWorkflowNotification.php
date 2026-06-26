<?php

namespace App\Notifications\Odds;

use App\Models\Odds\Task;
use App\Notifications\Channels\FonnteChannel;
use Illuminate\Notifications\Notification;

class OddsWorkflowNotification extends Notification
{
    public function __construct(
        public string $event,
        public string $title,
        public string $message,
        public ?Task $task = null,
        public string $urlPath = '/odds'
    ) {}

    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if (! app()->environment('testing') && $notifiable->whatsapp_number && class_exists(FonnteChannel::class)) {
            $channels[] = FonnteChannel::class;
        }

        return $channels;
    }

    public function toArray(object $notifiable): array
    {
        return [
            'app' => 'odds',
            'event' => $this->event,
            'title' => $this->title,
            'message' => $this->message,
            'task_id' => $this->task?->id,
            'task_number' => $this->task?->task_number,
            'url' => $this->task ? $this->urlPath.'/detail?id='.$this->task->id : $this->urlPath,
        ];
    }

    public function toFonnte(object $notifiable): string
    {
        $taskLine = $this->task ? "\nTask: {$this->task->task_number}" : '';

        return "Creative Universe ODDS\n{$this->title}{$taskLine}\n\n{$this->message}";
    }
}
