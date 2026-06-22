<?php

namespace Database\Seeders;

use App\Models\Core\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Idempotent seeder - aman dijalankan berulang kali.
     */
    public function run(): void
    {
        // 1. Seed roles & permissions terlebih dahulu
        $this->call(RolePermissionSeeder::class);

        // 2. Definisi daftar user default untuk 9 role inti
        $defaultUsers = [
            [
                'name' => 'Root',
                'email' => 'root@creativeuniverse.test',
                'username' => 'root',
                'password' => 'admin',
                'role' => 'Root',
            ],
            [
                'name' => 'Manajer',
                'email' => 'manajer@creativeuniverse.test',
                'username' => 'manajer',
                'password' => 'password',
                'role' => 'Manajer',
            ],
            [
                'name' => 'CEO',
                'email' => 'ceo@creativeuniverse.test',
                'username' => 'ceo',
                'password' => 'password',
                'role' => 'CEO',
            ],
            [
                'name' => 'Supervisor',
                'email' => 'supervisor@creativeuniverse.test',
                'username' => 'supervisor',
                'password' => 'password',
                'role' => 'Supervisor',
            ],
            [
                'name' => 'Designer',
                'email' => 'designer@creativeuniverse.test',
                'username' => 'designer',
                'password' => 'password',
                'role' => 'Designer',
            ],
            [
                'name' => 'Videographer',
                'email' => 'videographer@creativeuniverse.test',
                'username' => 'videographer',
                'password' => 'password',
                'role' => 'Videographer',
            ],
            [
                'name' => 'Client',
                'email' => 'client@creativeuniverse.test',
                'username' => 'client',
                'password' => 'password',
                'role' => 'Client',
            ],
            [
                'name' => 'Leader Retail',
                'email' => 'leaderretail@creativeuniverse.test',
                'username' => 'leaderretail',
                'password' => 'password',
                'role' => 'Leader Retail',
            ],
            [
                'name' => 'PIC Retail',
                'email' => 'picretail@creativeuniverse.test',
                'username' => 'picretail',
                'password' => 'password',
                'role' => 'PIC Retail',
            ],
        ];

        foreach ($defaultUsers as $item) {
            $user = User::where('email', $item['email'])
                ->orWhere('username', $item['username'])
                ->first();

            if (! $user) {
                $user = User::create([
                    'name' => $item['name'],
                    'email' => $item['email'],
                    'username' => $item['username'],
                    'password' => bcrypt($item['password']),
                ]);
            }

            if (! $user->hasRole($item['role'])) {
                // Remove other roles to ensure clean mapping if role changes
                $user->syncRoles([$item['role']]);
            }

            // Seed initial manageable manager permissions for Root
            if ($item['role'] === 'Root') {
                $user->setSetting('manageable_manager_permissions', [
                    'access-core',
                    'manage-users',
                    'approve-users',
                    'access-pricetag',
                    'pricetag.manage',
                ]);
            }
        }

        // 3. Seed data test Pricetag Generator
        $this->call(PricetagTestDataSeeder::class);
    }
}
