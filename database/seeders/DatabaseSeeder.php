<?php

namespace Database\Seeders;

use App\Models\Core\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Hanya dijalankan sekali saat inisialisasi pertama di environment Local.
     */
    public function run(): void
    {
        // 1. Seed roles & permissions terlebih dahulu
        $this->call(RolePermissionSeeder::class);

        // 2. Buat akun Superadmin pertama (sudah aktif, sudah punya role) jika belum ada
        $admin = User::where('email', 'admin@creativeuniverse.test')
            ->orWhere('username', 'superadmin')
            ->first();

        if (! $admin) {
            $admin = User::create([
                'name' => 'Superadmin',
                'email' => 'admin@creativeuniverse.test',
                'username' => 'superadmin',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]);
        }

        if (! $admin->hasRole('Superadmin')) {
            $admin->assignRole('Superadmin');
        }

        // 3. Seed data test Pricetag Generator
        $this->call(PricetagTestDataSeeder::class);
    }
}
