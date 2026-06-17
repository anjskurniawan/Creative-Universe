<?php

namespace App\Notifications\Core;

use App\Notifications\Channels\FonnteChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

/**
 * AccountApprovedNotification — SRD v6.2 Seksi 11.4
 *
 * Penerima: user yang baru diapprove
 * Trigger: setelah Superadmin approve akun
 */
class AccountApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries   = 3;
    public int $backoff = 60;

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', FonnteChannel::class];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    public function toFonnte(object $notifiable): string
    {
        return "Halo {$notifiable->name}! Akunmu di Creative Universe telah disetujui. "
             . "Kamu sekarang bisa login dan menggunakan aplikasi.";
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Akunmu telah disetujui. Selamat datang di Creative Universe!',
            'url'     => route('dashboard'),
        ];
    }
}
