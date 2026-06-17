<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use App\Notifications\Core\AccountApprovedNotification;
use Illuminate\Support\Facades\Log;

/**
 * ApproveUserAction — SRD v6.2 Seksi 8.2
 *
 * Menyetujui akun pending: set is_active = true,
 * assign role, kirim notifikasi ke user.
 */
class ApproveUserAction
{
    public function handle(User $user, User $admin, string $roleName): void
    {
        $user->update([
            'is_active' => true,
            'approved_by' => $admin->id,
            'approved_at' => now(),
            'updated_by' => $admin->id,
        ]);

        $user->assignRole($roleName);
        $user->notify(new AccountApprovedNotification);

        activity('auth')
            ->causedBy($admin)
            ->performedOn($user)
            ->withProperties([
                'ip' => request()->ip(),
                'role_assigned' => $roleName,
            ])
            ->log('[CORE] User account approved: '.$user->email);

        Log::info('[CORE] Account approved: '.$user->email.' by admin#'.$admin->id);
    }
}
