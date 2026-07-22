<?php

namespace Database\Seeders;

use App\Models\Core\Position;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\CreativeMember;
use App\SubApps\Odds\Models\DesignerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LocalTestAccountsSeeder extends Seeder
{
    /**
     * Seed local test accounts for offline login and ODDS testing.
     * All accounts use password: 'admin'
     */
    public function run(): void
    {
        // Ensure permissions & roles are seeded
        $this->call(RolePermissionSeeder::class);
        $this->call(OddsPermissionSeeder::class);

        $password = Hash::make('admin');

        // 1. Create Designer User (username: designer, password: admin)
        $designer = User::updateOrCreate(
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
        CreativeMember::updateOrCreate(
            ['user_id' => $designer->id],
            [
                'name' => $designer->name,
                'position_id' => $designer->position_id,
                'position_name' => 'Designer',
                'status' => CreativeMember::STATUS_ACTIVE,
                'joined_at' => now(),
            ]
        );

        // Ensure Designer Profile in ODDS
        DesignerProfile::updateOrCreate(
            ['user_id' => $designer->id],
            [
                'status' => 'available',
                'specializations' => [],
                'is_active' => true,
            ]
        );

        // 2. Create Client User (username: client, password: admin)
        $clientPosition = Position::firstOrCreate(
            ['division_id' => 21, 'name' => 'Staff Retail']
        );

        $client = User::updateOrCreate(
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

        // 3. Create SPV User (username: spv, password: admin)
        $spv = User::updateOrCreate(
            ['username' => 'spv'],
            [
                'name' => 'SPV Creative',
                'email' => 'spv@test.com',
                'password' => $password,
                'is_onboarded' => true,
                'division_id' => 4,
            ]
        );
        if (!$spv->hasRole('SPV')) {
            $spv->assignRole('SPV');
        }

        // 4. Create Manajer User (username: manajer, password: admin)
        $manajer = User::updateOrCreate(
            ['username' => 'manajer'],
            [
                'name' => 'Manajer Creative',
                'email' => 'manajer@test.com',
                'password' => $password,
                'is_onboarded' => true,
                'division_id' => 4,
            ]
        );
        if (!$manajer->hasRole('Manajer')) {
            $manajer->assignRole('Manajer');
        }
    }
}
