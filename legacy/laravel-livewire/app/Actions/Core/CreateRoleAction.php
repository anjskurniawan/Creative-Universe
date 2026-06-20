<?php

namespace App\Actions\Core;

use App\Livewire\Forms\Core\RoleForm;
use App\Models\Core\User;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class CreateRoleAction
{
    public function handle(RoleForm $form, User $admin): Role
    {
        $role = Role::create([
            'name' => $form->name,
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($form->permissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        activity('rbac')
            ->causedBy($admin)
            ->performedOn($role)
            ->withProperties([
                'role_name' => $role->name,
                'permissions' => $form->permissions,
                'ip' => request()->ip(),
                'sub_app' => 'core',
            ])
            ->log('[CORE] New role created: '.$role->name);

        Log::info('[CORE] New role created: '.$role->name.' by admin#'.$admin->id);

        return $role;
    }
}
