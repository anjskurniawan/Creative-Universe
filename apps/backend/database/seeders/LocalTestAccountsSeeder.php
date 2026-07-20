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
                'is_onboarded' => true,
                'division_id' => 4, // Creative
                'position_id' => 3, // Designer
            ]
        );
        if (!$designer->hasRole('Designer')) {
            $designer->assignRole('Designer');
        }

        // Auto approve designer member for local testing
        \App\SubApps\CreativeReport\Models\CreativeMember::updateOrCreate(
            ['user_id' => $designer->id],
            [
                'name' => $designer->name,
                'position_id' => $designer->position_id,
                'position_name' => 'Designer',
                'status' => \App\SubApps\CreativeReport\Models\CreativeMember::STATUS_ACTIVE,
                'joined_at' => now(),
            ]
        );

        // Dynamically create a Retail position for Client
        $clientPosition = \App\Models\Core\Position::firstOrCreate(
            ['division_id' => 21, 'name' => 'Staff Retail']
        );

        // Create Client User
        $client = User::firstOrCreate(
            ['username' => 'client'],
            [
                'name' => 'Client Test',
                'email' => 'client@test.com',
                'password' => $password,
                'is_onboarded' => true,
                'division_id' => 21, // Retail
                'position_id' => $clientPosition->id,
            ]
        );
        if (!$client->hasRole('Client')) {
            $client->assignRole('Client');
        }
    }
}
