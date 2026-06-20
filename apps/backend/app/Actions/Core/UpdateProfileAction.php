<?php

namespace App\Actions\Core;

use App\Models\Core\User;

class UpdateProfileAction
{
    public function handle(User $user, array $data): User
    {
        $settings = $data['settings'] ?? null;
        unset($data['settings']);

        $user->fill($data);
        $user->updated_by = $user->id;

        if (is_array($settings)) {
            $user->settings = array_merge($user->settings ?? [], $settings);
        }

        $user->save();

        return $user->refresh();
    }
}
