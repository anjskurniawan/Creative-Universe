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

        if (!$target) {
            return; // User tidak punya nomor WA — skip tanpa error
        }

        $this->fonnte->send($target, $notification->toFonnte($notifiable));
    }
}
