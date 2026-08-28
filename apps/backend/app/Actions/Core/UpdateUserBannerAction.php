<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use App\Services\Core\FileStorageService;
use Illuminate\Http\UploadedFile;
use Throwable;

class UpdateUserBannerAction
{
    public function __construct(private readonly FileStorageService $files) {}

    public function handle(User $user, UploadedFile $banner): User
    {
        $oldPath = $user->banner_path;
        $storedFile = $this->files->store($banner, 'core', 'users', $user->id, 'banners', $user->id, 'public');

        try {
            $user->banner_path = $storedFile->path;
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
