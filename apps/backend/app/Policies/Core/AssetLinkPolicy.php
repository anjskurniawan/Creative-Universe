<?php

namespace App\Policies\Core;

use App\Models\Core\AssetLink;
use App\Models\Core\User;

class AssetLinkPolicy
{
    public function view(User $user, AssetLink $assetLink): bool
    {
        return true;
    }

    public function update(User $user, AssetLink $assetLink): bool
    {
        return $assetLink->created_by === $user->id || $user->hasRole('Root');
    }

    public function delete(User $user, AssetLink $assetLink): bool
    {
        return $this->update($user, $assetLink);
    }
}
