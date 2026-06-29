<?php

namespace Database\Seeders;

use App\Models\Core\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

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
                'local_login' => true,
            ],
            [
                'name' => 'Manajer',
                'email' => 'manajer@creativeuniverse.test',
                'username' => 'manajer',
                'password' => 'admin',
                'role' => 'Manajer',
                'local_login' => true,
            ],
            [
                'name' => 'CEO',
                'email' => 'ceo@creativeuniverse.test',
                'username' => 'ceo',
                'password' => 'password',
                'role' => 'CEO',
            ],
            [
                'name' => 'SPV',
                'email' => 'spv@creativeuniverse.test',
                'username' => 'spv',
                'password' => 'admin',
                'role' => 'SPV',
                'local_login' => true,
            ],
            [
                'name' => 'Designer',
                'email' => 'designer@creativeuniverse.test',
                'username' => 'designer',
                'password' => 'admin',
                'role' => 'Designer',
                'local_login' => true,
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
                'password' => 'admin',
                'role' => 'Client',
                'local_login' => true,
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

        $hasIsActiveColumn = Schema::hasColumn('users', 'is_active');
        $hasApprovedAtColumn = Schema::hasColumn('users', 'approved_at');

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

            $profileUpdates = [];
            if ($hasIsActiveColumn && ! $user->is_active) {
                $profileUpdates['is_active'] = true;
            }
            if ($hasApprovedAtColumn && ! $user->approved_at) {
                $profileUpdates['approved_at'] = now();
            }
            if ($item['local_login'] ?? false) {
                $profileUpdates['password'] = bcrypt($item['password']);
            }
            if ($profileUpdates !== []) {
                $user->forceFill($profileUpdates)->save();
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

        // 4. Seed data onboarding profile
        $this->call(OnboardingDataSeeder::class);

        // 5. Seed permission dan default config ODDS
        $this->call(OddsPermissionSeeder::class);
        $this->call(OddsDefaultSeeder::class);
    }
}
