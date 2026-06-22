<?php

namespace App\Http\Resources;

use App\Actions\Core\DeleteRoleAction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'guard_name' => $this->guard_name,
            'protected' => in_array($this->name, DeleteRoleAction::PROTECTED_ROLES, true),
            'users_count' => $this->users_count ?? $this->users()->count(),
            'active_users_count' => $this->active_users_count ?? $this->users()->count(),
            'permissions' => $this->relationLoaded('permissions')
                ? $this->permissions->pluck('name')->values()->all()
                : $this->permissions()->pluck('name')->values()->all(),
        ];
    }
}
