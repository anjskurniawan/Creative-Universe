<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class UserProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $safeSettings = Arr::only($this->settings ?? [], [
            'theme',
            'navbar_variant',
            'redirect_to',
            'notify_new_registration',
            'default_pricetag_expiry_days',
            'max_prints_per_batch',
            'default_pricetag_layout',
            'default_pricetag_paper_size',
            'auto_save_checklist',
        ]);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'whatsapp_number' => $this->whatsapp_number,
            'avatar_url' => $this->avatar_path
                ? Storage::disk('public')->url($this->avatar_path)
                : null,
            'is_active' => (bool) $this->is_active,
            'roles' => $this->getRoleNames()->values()->all(),
            'permissions' => $this->getAllPermissions()->pluck('name')->values()->all(),
            'settings' => $safeSettings,
        ];
    }
}
