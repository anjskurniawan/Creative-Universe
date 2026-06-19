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
 * Menghasilkan 7 role inti sistem.
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
        $root = Role::firstOrCreate(['name' => 'Root']);
        $manajer = Role::firstOrCreate(['name' => 'Manajer']);
        $supervisor = Role::firstOrCreate(['name' => 'Supervisor']);
        $designer = Role::firstOrCreate(['name' => 'Designer']);
        $client = Role::firstOrCreate(['name' => 'Client']);
        $retailAdmin = Role::firstOrCreate(['name' => 'Retail Admin']);
        $retailStaff = Role::firstOrCreate(['name' => 'Retail Staff']);

        // ─── Sync Permissions to Roles ────────────────────
        // Root mendapat semua permission
        $root->syncPermissions($permissions);

        // Manajer: akses core, pricetag, user management & approval
        $manajer->syncPermissions([
            'access-core',
            'access-pricetag',
            'pricetag.manage',
            'approve-users',
            'manage-users',
        ]);

        // Supervisor: akses core & pricetag
        $supervisor->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Designer: akses core & pricetag
        $designer->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Client: hanya akses core dasar
        $client->syncPermissions([
            'access-core',
        ]);

        // Retail Admin: akses core & pricetag
        $retailAdmin->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Retail Staff: akses core & pricetag
        $retailStaff->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);
    }
}
