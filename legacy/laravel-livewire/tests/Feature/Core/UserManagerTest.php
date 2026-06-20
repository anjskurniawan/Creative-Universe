<?php

namespace Tests\Feature\Core;

use App\Livewire\Core\UserManager;
use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Livewire\Livewire;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserManagerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_unauthorized_user_cannot_access_user_manager_component(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        Livewire::actingAs($user)
            ->test(UserManager::class)
            ->assertStatus(403);
    }

    public function test_root_can_view_users_and_edit_otorisasi(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Designer');

        Livewire::actingAs($root)
            ->test(UserManager::class)
            ->call('openEditOtorisasi', $user->id)
            ->assertSet('editingUserId', $user->id)
            ->set('selectedRoles', ['Designer', 'Supervisor'])
            ->call('saveOtorisasi')
            ->assertHasNoErrors();

        $user->refresh();
        $this->assertTrue($user->hasRole('Designer'));
        $this->assertTrue($user->hasRole('Supervisor'));
    }

    public function test_root_can_whitelist_manager_permissions(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        Livewire::actingAs($root)
            ->test(UserManager::class)
            ->call('openWhitelistModal')
            ->set('whitelistedPermissions', ['access-core', 'manage-users'])
            ->call('saveWhitelist')
            ->assertHasNoErrors();

        $root->refresh();
        $this->assertEquals(['access-core', 'manage-users'], $root->getSetting('manageable_manager_permissions'));
    }

    public function test_manager_cannot_edit_root_users(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        Livewire::actingAs($manager)
            ->test(UserManager::class)
            ->call('openEditOtorisasi', $root->id)
            ->assertSet('showEditOtorisasiModal', false);
    }

    public function test_manager_can_manage_roles_within_permissions_and_whitelist(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');
        // Set whitelist
        $root->setSetting('manageable_manager_permissions', ['access-core', 'access-pricetag']);

        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer'); // Manajer has access-core and access-pricetag by default

        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Client');

        // Manager assigns role Supervisor and permission access-pricetag
        Livewire::actingAs($manager)
            ->test(UserManager::class)
            ->call('openEditOtorisasi', $user->id)
            ->set('selectedRoles', ['Supervisor'])
            ->set('selectedPermissions', ['access-pricetag'])
            ->call('saveOtorisasi')
            ->assertHasNoErrors();

        $user->refresh();
        $this->assertTrue($user->hasRole('Supervisor'));
        $this->assertTrue($user->hasDirectPermission('access-pricetag'));
    }

    public function test_root_can_manage_account_deactivation_password_reset_and_view_sessions(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $user = User::factory()->create(['is_active' => true, 'password' => bcrypt('old_password')]);
        $user->assignRole('Designer');

        // Seed a dummy session
        DB::table('sessions')->insert([
            'id' => 'session_test',
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla Windows Chrome',
            'payload' => 'payload',
            'last_activity' => time()
        ]);

        Livewire::actingAs($root)
            ->test(UserManager::class)
            ->call('openKelolaAkun', $user->id)
            ->assertSet('managingUserIsActive', true)
            ->assertCount('userSessions', 1) // Session is loaded for Root
            ->set('managingUserIsActive', false) // Deactivate user
            ->set('newPassword', 'new_password')
            ->set('newPassword_confirmation', 'new_password')
            ->call('saveKelolaAkun')
            ->assertHasNoErrors();

        $user->refresh();
        $this->assertFalse($user->is_active);
        $this->assertTrue(auth()->attempt(['email' => $user->email, 'password' => 'new_password']));

        // Verify session was revoked upon deactivation
        $this->assertDatabaseMissing('sessions', ['id' => 'session_test']);
    }

    public function test_manager_can_deactivate_and_change_password_but_cannot_view_sessions(): void
    {
        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Designer');

        // Seed a dummy session
        DB::table('sessions')->insert([
            'id' => 'session_test2',
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla Windows Chrome',
            'payload' => 'payload',
            'last_activity' => time()
        ]);

        Livewire::actingAs($manager)
            ->test(UserManager::class)
            ->call('openKelolaAkun', $user->id)
            ->assertSet('managingUserIsActive', true)
            ->assertCount('userSessions', 0) // Sessions are hidden/empty for Manager
            ->set('managingUserIsActive', false) // Suspend user
            ->set('newPassword', 'new_password_2')
            ->set('newPassword_confirmation', 'new_password_2')
            ->call('saveKelolaAkun')
            ->assertHasNoErrors();

        $user->refresh();
        $this->assertFalse($user->is_active);
        $this->assertTrue(auth()->attempt(['email' => $user->email, 'password' => 'new_password_2']));
    }
}
