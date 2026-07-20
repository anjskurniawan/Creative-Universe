<?php

namespace Database\Seeders;

use App\Models\Core\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LocalTestAccountsSeeder extends Seeder
{
    /**
     * Seed local test accounts for odds testing.
     */
    public function run(): void
    {
        $password = Hash::make('admin');

        // Create Designer User
        $designer = User::firstOrCreate(
            ['username' => 'designer'],
            [
                'name' => 'Designer Test',
                'email' => 'designer@test.com',
                'password' => $password,
                'is_active' => true,
                'approved_at' => now(),
            ]
        );
        if (!$designer->hasRole('Designer')) {
            $designer->assignRole('Designer');
        }

        // Create Client User
        $client = User::firstOrCreate(
            ['username' => 'client'],
            [
                'name' => 'Client Test',
                'email' => 'client@test.com',
                'password' => $password,
                'is_active' => true,
                'approved_at' => now(),
            ]
        );
        if (!$client->hasRole('Client')) {
            $client->assignRole('Client');
        }
    }
}
