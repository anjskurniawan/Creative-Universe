<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * RolePermissionSeeder — SRD v6.2 Seksi 6.4
 *
 * Seeder idempotent — aman dijalankan berulang kali.
 * Core-only: tidak termasuk permission Sub-App ODDS.
 */
class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ─── Core Permissions ────────────────────────────
        $permissions = [
            'access-core',
            'manage-users',
            'manage-roles',
            'approve-users',
            'view-logs',
            'run-artisan',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ─── Roles ────────────────────────────────────────
        $superadmin = Role::firstOrCreate(['name' => 'Superadmin']);
        $manajer    = Role::firstOrCreate(['name' => 'Manajer']);
        $desainer   = Role::firstOrCreate(['name' => 'Desainer']);

        // ─── Sync Permissions to Roles ────────────────────
        // Superadmin mendapat semua permission
        $superadmin->syncPermissions($permissions);

        // Manajer: akses core saja (Sub-App permission ditambahkan di seeder Sub-App)
        $manajer->syncPermissions([
            'access-core',
        ]);

        // Desainer: akses core saja
        $desainer->syncPermissions([
            'access-core',
        ]);
    }
}
