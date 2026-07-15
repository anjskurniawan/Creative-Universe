<?php

namespace App\Policies\Core;

use App\Models\Core\StoredFile;
use App\Models\Core\User;

class StoredFilePolicy
{
    public function view(User $user, StoredFile $file): bool
    {
        return $file->visibility === 'public'
            || $file->uploaded_by === $user->id
            || $user->hasRole('Root');
    }

    public function delete(User $user, StoredFile $file): bool
    {
        return $file->uploaded_by === $user->id || $user->hasRole('Root');
    }
}
