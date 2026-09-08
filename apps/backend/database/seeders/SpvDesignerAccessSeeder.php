<?php

namespace Database\Seeders;

use App\Models\Core\User;
use App\SubApps\Odds\Models\DesignerProfile;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class SpvDesignerAccessSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'SPV', 'guard_name' => 'web']);
        foreach (['view-assigned-odds-tasks', 'request-odds-queue-skip', 'start-odds-tasks', 'submit-odds-results', 'request-odds-revisions'] as $name) {
            $role->givePermissionTo(Permission::findOrCreate($name, 'web'));
        }

        User::role('SPV')->each(function (User $user): void {
            DesignerProfile::withTrashed()->firstOrCreate(
                ['user_id' => $user->id],
                ['status' => 'available', 'specializations' => [], 'is_active' => true],
            );
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
