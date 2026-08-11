<?php

namespace App\Http\Resources;

use App\Http\Resources\Core\ApplicationResource;
use App\SubApps\CreativeReport\Models\CreativeMember;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $safeSettings = Arr::only($this->settings ?? [], [
            'theme',
            'language',
            'timezone',
            'reduce_motion',
            'high_contrast',
            'notification_in_app',
            'notification_whatsapp',
            'notification_task_updates',
            'notification_mentions',
            'notification_deadlines',
            'notification_quiet_start',
            'notification_quiet_end',
            'profile_show_applications',
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
            'card_image_path' => CreativeMember::query()->where('user_id', $this->id)->value('card_image_path'),

            'created_at' => $this->created_at?->toIso8601String(),
            'roles' => $this->getRoleNames()->values()->all(),
            'permissions' => $this->relationLoaded('permissions')
                ? $this->permissions->pluck('name')->values()->all()
                : $this->permissions()->pluck('name')->values()->all(),
            'all_permissions' => $this->getAllPermissions()->pluck('name')->values()->all(),
            'applications' => ApplicationResource::collection(
                $this->relationLoaded('applications') ? $this->applications : $this->applications()->orderBy('sort_order')->get()
            )->resolve($request),
            'settings' => $safeSettings,
        ];
    }
}
