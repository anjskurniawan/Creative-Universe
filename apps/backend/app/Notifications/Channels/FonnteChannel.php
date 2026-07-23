<?php

namespace App\Notifications\Channels;

use App\Services\Fonnte\FonnteService;
use Illuminate\Notifications\Notification;

/**
 * FonnteChannel — SRD v6.2 Seksi 11.3
 *
 * Custom notification channel untuk WhatsApp via Fonnte.
 */
class FonnteChannel
{
    public function __construct(private FonnteService $fonnte) {}

    public function send(object $notifiable, Notification $notification): void
    {
        $target = $notifiable->whatsapp_number;

        if (! $target) {
            return; // User tidak punya nomor WA — skip tanpa error
        }

        // SRD v6.3 Seksi 11.3: Normalisasi Format Nomor WA (mengubah awalan 0 menjadi 62)
        $target = preg_replace('/[^0-9]/', '', $target);
        if (str_starts_with($target, '0')) {
            $target = '62' . substr($target, 1);
        }

        $this->fonnte->send($target, $notification->toFonnte($notifiable));
    }
}
