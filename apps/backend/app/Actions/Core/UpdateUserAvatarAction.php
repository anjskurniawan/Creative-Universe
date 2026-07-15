<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use App\Services\Core\FileStorageService;
use Illuminate\Http\UploadedFile;
use Throwable;

class UpdateUserAvatarAction
{
    public function __construct(private readonly FileStorageService $files) {}

    public function handle(User $user, UploadedFile $avatar): User
    {
        $oldPath = $user->avatar_path;
        $storedFile = $this->files->store(
            file: $avatar,
            applicationKey: 'core',
            contextType: 'users',
            contextId: $user->id,
            category: 'avatars',
            uploadedBy: $user->id,
            visibility: 'public',
        );

        try {
            $user->avatar_path = $storedFile->path;
            $user->updated_by = $user->id;
            $user->save();
        } catch (Throwable $exception) {
            $this->files->deleteByPath($storedFile->path, $storedFile->disk);
            throw $exception;
        }

        if ($oldPath && $oldPath !== $storedFile->path) {
            $this->files->deleteByPath($oldPath, 'public');
        }

        return $user->refresh();
    }
}
