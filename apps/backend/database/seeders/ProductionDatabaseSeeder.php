<?php

namespace Database\Seeders;

use App\Models\Core\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class ProductionDatabaseSeeder extends Seeder
{
    /**
     * Seed only the system foundation required by a hosted environment.
     */
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);
        $this->seedRootUser();
        $this->call(OnboardingDataSeeder::class);
        $this->call(OddsPermissionSeeder::class);
        $this->call(OddsDefaultSeeder::class);
        $this->call(ApplicationRegistrySeeder::class);
        $this->call(ApplicationAccessSeeder::class);
    }

    private function seedRootUser(): void
    {
        $username = (string) config('auth.root_user.username', 'root');
        $email = (string) config('auth.root_user.email', 'root@creativeuniverse.test');

        $root = User::query()
            ->where('email', $email)
            ->orWhere('username', $username)
            ->first();

        if (! $root) {
            $password = config('auth.root_user.password');

            if (blank($password) && app()->environment('production')) {
                throw new RuntimeException('ROOT_PASSWORD wajib diatur sebelum membuat akun Root di production.');
            }

            $root = User::create([
                'name' => (string) config('auth.root_user.name', 'Root'),
                'email' => $email,
                'username' => $username,
                'password' => Hash::make((string) ($password ?: 'admin')),
            ]);
        }

        $profileUpdates = [];
        if (Schema::hasColumn('users', 'is_active') && ! $root->is_active) {
            $profileUpdates['is_active'] = true;
        }
        if (Schema::hasColumn('users', 'approved_at') && ! $root->approved_at) {
            $profileUpdates['approved_at'] = now();
        }
        if ($profileUpdates !== []) {
            $root->forceFill($profileUpdates)->save();
        }

        $root->syncRoles(['Root']);
        $root->setSetting('manageable_manager_permissions', [
            'access-core',
            'manage-users',
            'approve-users',
            'access-pricetag',
            'pricetag.manage',
        ]);
    }
}
