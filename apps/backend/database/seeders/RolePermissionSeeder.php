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
        // Rename existing roles if they exist to prevent orphan roles
        $oldRetailAdmin = Role::where('name', 'Retail Admin')->first();
        if ($oldRetailAdmin) {
            $oldRetailAdmin->update(['name' => 'Leader Retail']);
        }
        $oldRetailStaff = Role::where('name', 'Retail Staff')->first();
        if ($oldRetailStaff) {
            $oldRetailStaff->update(['name' => 'PIC Retail']);
        }

        $root = Role::firstOrCreate(['name' => 'Root']);
        $manajer = Role::firstOrCreate(['name' => 'Manajer']);
        $ceo = Role::firstOrCreate(['name' => 'CEO']);
        $supervisor = Role::firstOrCreate(['name' => 'Supervisor']);
        $spv = Role::firstOrCreate(['name' => 'SPV']);
        $designer = Role::firstOrCreate(['name' => 'Designer']);
        $videographer = Role::firstOrCreate(['name' => 'Videographer']);
        $client = Role::firstOrCreate(['name' => 'Client']);
        $leaderRetail = Role::firstOrCreate(['name' => 'Leader Retail']);
        $picRetail = Role::firstOrCreate(['name' => 'PIC Retail']);

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

        // CEO: akses core & pricetag (read-only, no write/edit permissions)
        $ceo->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Supervisor: akses core & pricetag
        $supervisor->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // SPV: alias operasional untuk Supervisor
        $spv->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Designer: akses core & pricetag
        $designer->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Videographer: akses core & pricetag (sama seperti designer)
        $videographer->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // Client: hanya akses core dasar
        $client->syncPermissions([
            'access-core',
        ]);

        // Leader Retail: akses core & pricetag
        $leaderRetail->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);

        // PIC Retail: akses core & pricetag
        $picRetail->syncPermissions([
            'access-core',
            'access-pricetag',
        ]);
    }
}
