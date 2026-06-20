<?php

namespace App\Notifications\Core;

use App\Models\Core\User;
use App\Notifications\Channels\FonnteChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

/**
 * UserRegisteredNotification — SRD v6.2 Seksi 11.4
 *
 * Penerima: Root/Manajer (semua user ber-permission approve-users)
 * Trigger: setelah user baru berhasil mendaftar
 */
class UserRegisteredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(private User $newUser) {}

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
        return "Ada pendaftar baru di Creative Universe!\n"
             ."Nama: {$this->newUser->name}\n"
             ."Email: {$this->newUser->email}\n"
             .'Catatan: '.($this->newUser->registration_note ?? '-')."\n"
             .'Buka dashboard untuk approve atau reject.';
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Pendaftar baru: {$this->newUser->name} ({$this->newUser->email})",
            'url' => route('core.users.pending'),
            'new_user_id' => $this->newUser->id,
        ];
    }
}
