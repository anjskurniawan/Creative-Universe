<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class OddsPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Definisikan semua permission ODDS
        $permissions = [
            'access-odds',
            'create-odds-tickets',
            'view-all-odds-tickets',
            'view-own-odds-tickets',
            'view-assigned-odds-tickets',
            'assign-odds-tickets',
            'approve-odds-tickets',
            'submit-odds-output',
            'request-odds-revision',
            'use-odds-ai',
            'view-odds-reports',
            'delete-odds-tickets',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Ambil Roles
        $root = Role::where('name', 'Root')->first();
        $manajer = Role::where('name', 'Manajer')->first();
        $ceo = Role::where('name', 'CEO')->first();
        $supervisor = Role::where('name', 'Supervisor')->first();
        $designer = Role::where('name', 'Designer')->first();
        $videographer = Role::where('name', 'Videographer')->first();
        $client = Role::where('name', 'Client')->first();
        $leaderRetail = Role::where('name', 'Leader Retail')->first();
        $picRetail = Role::where('name', 'PIC Retail')->first();

        // 3. Mapping Permissions

        // Root dapat semua permission ODDS
        if ($root) {
            $root->givePermissionTo($permissions);
        }

        // Requester Roles (Semua kecuali Designer & Videographer)
        $requesterRoles = [$manajer, $ceo, $supervisor, $client, $leaderRetail, $picRetail];
        foreach ($requesterRoles as $role) {
            if ($role) {
                $role->givePermissionTo([
                    'access-odds',
                    'create-odds-tickets',
                    'view-own-odds-tickets',
                    'request-odds-revision',
                ]);
            }
        }

        // Tambahan untuk Manajer dan Supervisor (Bisa assign dan approve)
        if ($manajer) {
            $manajer->givePermissionTo(['view-all-odds-tickets', 'assign-odds-tickets', 'approve-odds-tickets', 'view-odds-reports', 'use-odds-ai']);
        }
        if ($supervisor) {
            $supervisor->givePermissionTo(['view-all-odds-tickets', 'assign-odds-tickets', 'approve-odds-tickets', 'use-odds-ai']);
        }
        if ($ceo) {
            $ceo->givePermissionTo(['view-all-odds-tickets', 'view-odds-reports']);
        }

        // Designer Role
        if ($designer) {
            $designer->givePermissionTo([
                'access-odds',
                'view-assigned-odds-tickets',
                'submit-odds-output',
                'use-odds-ai', // Bisa gunakan AI brief check
            ]);
        }
        if ($videographer) {
            $videographer->givePermissionTo([
                'access-odds',
                'view-assigned-odds-tickets',
                'submit-odds-output',
            ]);
        }
    }
}
