<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use App\Notifications\Core\AccountRejectedNotification;
use Illuminate\Support\Facades\Log;

/**
 * RejectUserAction — SRD v6.2 Seksi 8.2
 *
 * Menolak akun pending: kirim notifikasi, soft delete.
 */
class RejectUserAction
{
    public function handle(User $user, User $admin): void
    {
        $user->notify(new AccountRejectedNotification());

        $user->update(['deleted_by' => $admin->id]);
        $user->delete(); // soft delete

        activity('auth')
            ->causedBy($admin)
            ->performedOn($user)
            ->withProperties(['ip' => request()->ip()])
            ->log('[CORE] User account rejected and removed: ' . $user->email);

        Log::info('[CORE] Account rejected: ' . $user->email . ' by admin#' . $admin->id);
    }
}
