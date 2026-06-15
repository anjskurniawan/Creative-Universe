<?php

namespace App\Notifications\Core;

use App\Notifications\Channels\FonnteChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

/**
 * AccountRejectedNotification — SRD v6.2 Seksi 11.4
 *
 * Penerima: user yang ditolak
 * Trigger: setelah Superadmin reject akun
 */
class AccountRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries   = 3;
    public int $backoff = 60;

    public function via(object $notifiable): array
    {
        return ['database', FonnteChannel::class];
    }

    public function toFonnte(object $notifiable): string
    {
        return "Halo {$notifiable->name}. Pendaftaran akunmu di Creative Universe "
             . "tidak dapat disetujui. Hubungi admin divisi untuk informasi lebih lanjut.";
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Pendaftaran akunmu tidak disetujui. Hubungi admin divisi.',
            'url'     => null,
        ];
    }
}
