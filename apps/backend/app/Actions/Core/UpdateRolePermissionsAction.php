<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UpdateRolePermissionsAction
{
    public function handle(Role $role, array $permissions, User $admin): void
    {
        $oldPermissions = $role->permissions()->pluck('name')->all();

        $role->syncPermissions($permissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        activity('rbac')
            ->causedBy($admin)
            ->performedOn($role)
            ->withProperties([
                'old' => $oldPermissions,
                'new' => $permissions,
                'ip' => request()->ip(),
                'sub_app' => 'core',
            ])
            ->log('[CORE] Role permissions updated: '.$role->name);

        Log::info('[CORE] Role permissions updated: '.$role->name.' by admin#'.$admin->id);
    }
}
