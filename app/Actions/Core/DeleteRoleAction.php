<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DeleteRoleAction
{
    public const PROTECTED_ROLES = ['Superadmin', 'Manajer', 'Desainer'];

    public function handle(Role $role, User $admin): void
    {
        if (in_array($role->name, self::PROTECTED_ROLES, true)) {
            throw new RuntimeException("Role '{$role->name}' adalah role inti yang dilindungi dan tidak dapat dihapus.");
        }

        $activeUserCount = $role->users()->where('is_active', true)->count();

        if ($activeUserCount > 0) {
            throw new RuntimeException(
                "Role '{$role->name}' masih memiliki {$activeUserCount} user aktif. "
                .'Pindahkan semua user ke role lain sebelum menghapus.'
            );
        }

        $roleName = $role->name;

        $role->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        activity('rbac')
            ->causedBy($admin)
            ->withProperties([
                'deleted_role' => $roleName,
                'ip' => request()->ip(),
                'sub_app' => 'core',
            ])
            ->log('[CORE] Role deleted: '.$roleName);

        Log::info('[CORE] Role deleted: '.$roleName.' by admin#'.$admin->id);
    }
}
