<?php

namespace App\Actions\Core;

use App\Events\Core\UserStatusUpdated;
use App\Events\PendingUserRegistered;
use App\Models\Core\User;
use App\Notifications\Core\UserRegisteredNotification;
use Illuminate\Support\Facades\Log;

/**
 * RegisterUserAction — SRD v6.2 Seksi 8.2
 *
 * Membuat user baru dengan is_active = false (pending approval).
 * Mengirim notifikasi ke semua user ber-permission approve-users.
 */
class RegisterUserAction
{
    public function handle(object $form): User
    {
        $user = User::create([
            'name' => $form->name,
            'username' => $form->username,
            'email' => $form->email,
            'whatsapp_number' => $form->whatsapp_number,
            'password' => bcrypt($form->password),
            'registration_note' => $form->registration_note,
            'is_active' => false, // WAJIB false — pending approval
        ]);

        // Notifikasi ke semua user yang bisa approve
        $admins = User::permission('approve-users')->where('is_active', true)->get();
        foreach ($admins as $admin) {
            $admin->notify(new UserRegisteredNotification($user));
        }

        PendingUserRegistered::dispatch($user);

        activity('auth')
            ->performedOn($user)
            ->withProperties(['ip' => request()->ip()])
            ->log('[CORE] New user registered — pending approval: '.$user->email);

        Log::info('[CORE] New registration: '.$user->email);

        event(new UserStatusUpdated);

        return $user;
    }
}
