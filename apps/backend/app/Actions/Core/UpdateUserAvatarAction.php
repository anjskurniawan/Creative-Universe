<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UpdateUserAvatarAction
{
    public function handle(User $user, UploadedFile $avatar): User
    {
        $oldPath = $user->avatar_path;
        $newPath = $avatar->store('avatars', 'public');

        try {
            $user->avatar_path = $newPath;
            $user->updated_by = $user->id;
            $user->save();
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($newPath);
            throw $exception;
        }

        if ($oldPath && $oldPath !== $newPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return $user->refresh();
    }
}
