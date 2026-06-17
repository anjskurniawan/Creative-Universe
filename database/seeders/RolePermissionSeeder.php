<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

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
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ─── Core Permissions ────────────────────────────
        $permissions = [
            'access-core',
            'manage-users',
            'manage-roles',
            'approve-users',
            'view-logs',
            'run-artisan',
            'access-pricetag',
            'pricetag.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ─── Roles ────────────────────────────────────────
        $superadmin = Role::firstOrCreate(['name' => 'Superadmin']);
        $manajer = Role::firstOrCreate(['name' => 'Manajer']);
        $desainer = Role::firstOrCreate(['name' => 'Desainer']);

        // ─── Sync Permissions to Roles ────────────────────
        // Superadmin mendapat semua permission
        $superadmin->syncPermissions($permissions);

        // Manajer: akses core & pricetag
        $manajer->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Desainer: akses core & pricetag
        $desainer->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);
    }
}
