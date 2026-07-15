<?php

namespace App\Http\Resources;

use App\Http\Resources\Core\ApplicationResource;
use App\Models\Core\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use App\Models\AppSetting;

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

        $applications = $this->hasRole('Root')
            ? Application::query()->orderBy('sort_order')->get()
            : Application::query()
                ->where('key', 'core')
                ->orWhereHas('users', fn ($query) => $query->whereKey($this->getKey()))
                ->orderBy('sort_order')
                ->get();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'whatsapp_number' => $this->whatsapp_number,
            'is_onboarded' => $this->is_onboarded,
            'division_id' => $this->division_id,
            'position_id' => $this->position_id,
            'avatar_url' => $this->avatar_path
                ? Storage::disk('public')->url($this->avatar_path)
                : null,

            'roles' => $this->getRoleNames()->values()->all(),
            'permissions' => $this->getAllPermissions()->pluck('name')->values()->all(),
            'applications' => ApplicationResource::collection($applications)->resolve($request),
            'settings' => $safeSettings,
            'emergency_maintenance' => AppSetting::query()
                ->where('key', 'emergency_maintenance_mode')
                ->value('value') === '1',
        ];
    }
}
