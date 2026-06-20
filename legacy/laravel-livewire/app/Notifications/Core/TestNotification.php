<?php

namespace App\Notifications\Core;

use App\Notifications\Channels\FonnteChannel;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class TestNotification extends Notification
{
    public int $tries = 3;
    public int $backoff = 60;

    /**
     * Create a new notification instance.
     */
    public function __construct(private string $testMessage, private array $channels = ['database', 'broadcast', FonnteChannel::class])
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return $this->channels;
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
        return "Creative Universe - Uji Coba Notifikasi WhatsApp\n\n"
             . "Halo {$notifiable->name},\n"
             . "Ini adalah pesan uji coba pengiriman notifikasi dari sistem.\n\n"
             . "Pesan Anda: \"{$this->testMessage}\"\n\n"
             . "Waktu Uji: " . now()->format('Y-m-d H:i:s') . " (WIB)\n"
             . "Status: Koneksi Fonnte Channel Berfungsi.";
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Uji coba notifikasi berhasil dikirim: "' . $this->testMessage . '"',
            'url' => route('dashboard'),
        ];
    }
}
