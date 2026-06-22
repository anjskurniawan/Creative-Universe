<?php

namespace App\Notifications\Odds;

use App\Models\Odds\Ticket;
use App\Notifications\Channels\FonnteChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class OddsTicketNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Ticket $ticket,
        public string $customMessage,
        public string $urlPath = '/odds'
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', FonnteChannel::class];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return (new BroadcastMessage($this->toArray($notifiable)))->onConnection('sync');
    }

    /**
     * Get the WhatsApp representation of the notification via Fonnte.
     */
    public function toFonnte(object $notifiable): string
    {
        return "Creative Universe ODDS - Update Tiket\n\n"
             ."Halo {$notifiable->name},\n"
             ."{$this->customMessage}\n\n"
             ."ID Tiket: {$this->ticket->ticket_number}\n"
             ."Keperluan: {$this->ticket->design_purpose}\n"
             ."Status: {$this->ticket->status->value}\n\n"
             ."Silahkan cek sistem untuk detail lebih lanjut.";
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->customMessage . ' (' . $this->ticket->ticket_number . ')',
            'url' => $this->urlPath . '/tickets/' . $this->ticket->id,
        ];
    }
}
