<?php

namespace App\Actions\Core;

use App\Models\Core\User;

class UpdateUserPasswordAction
{
    public function handle(User $user, string $password): void
    {
        $user->password = $password;
        $user->updated_by = $user->id;
        $user->save();

        activity('core-user')
            ->causedBy($user)
            ->performedOn($user)
            ->log('[CORE] Password akun diperbarui oleh pemilik akun.');
    }
}
