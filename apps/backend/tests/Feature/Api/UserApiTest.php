<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_unauthorized_user_cannot_access_user_list(): void
    {
        $user = User::factory()->create([]);
        // Default active user has no role/permission to manage users

        $response = $this->actingAs($user)->getJson('/api/v1/users');

        $response->assertStatus(403);
    }

    public function test_unauthorized_user_cannot_mutate_or_inspect_managed_accounts(): void
    {
        $actor = User::factory()->create([]);
        $target = User::factory()->create([]);
        $this->actingAs($actor)->getJson('/api/v1/users/options')->assertForbidden();
        $this->actingAs($actor)->getJson("/api/v1/users/{$target->id}")->assertForbidden();
        $this->actingAs($actor)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => [],
            'permissions' => [],
        ])->assertForbidden();
        $this->actingAs($actor)->deleteJson("/api/v1/users/{$target->id}/sessions/missing")
            ->assertForbidden();
    }

    public function test_authorized_user_can_access_user_list_with_pagination(): void
    {
        $admin = User::factory()->create([]);
        $admin->assignRole('Root');

        // Create 2 extra active users
        User::factory()->create(['name' => 'Budi Santoso']);
        User::factory()->create(['name' => 'Jane Doe']);

        $response = $this->actingAs($admin)->getJson('/api/v1/users');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'data',
                'meta' => [
                    'current_page',
                    'last_page',
                    'total',
                ],
            ],
            'message',
        ]);

        $this->assertCount(3, $response->json('data.data')); // Admin + 2 users
    }

    public function test_user_list_can_be_searched_and_filtered_by_role(): void
    {
        $admin = User::factory()->create([]);
        $admin->assignRole('Root');

        $user1 = User::factory()->create(['name' => 'Budi Santoso']);
        $user1->assignRole('PIC Retail');

        $user2 = User::factory()->create(['name' => 'Jane Doe']);
        $user2->assignRole('Designer');

        // Search test
        $response = $this->actingAs($admin)->getJson('/api/v1/users?search=Budi');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.data'));
        $this->assertEquals('Budi Santoso', $response->json('data.data.0.name'));

        // Role filter test
        $response = $this->actingAs($admin)->getJson('/api/v1/users?role=Designer');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.data'));
        $this->assertEquals('Jane Doe', $response->json('data.data.0.name'));
    }

    public function test_manager_cannot_edit_root_users(): void
    {
        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        $root = User::factory()->create([]);
        $root->assignRole('Root');

        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$root->id}", [
            'name' => 'Root Edited',
            'email' => $root->email,
            'roles' => ['Root'],
            'permissions' => [],
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('success', false);
        $response->assertJsonPath('message', 'Manajer tidak dapat mengedit otorisasi pengguna Root.');
    }

    public function test_manager_cannot_assign_root_role(): void
    {
        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create([]);
        $target->assignRole('PIC Retail');

        // Try to update user with Root role
        $updateResponse = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => ['Root'],
            'permissions' => [],
        ]);
        $updateResponse->assertStatus(403);
    }

    public function test_manager_can_only_assign_whitelisted_permissions(): void
    {
        $root = User::factory()->create([]);
        $root->assignRole('Root');

        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create([]);
        $target->assignRole('PIC Retail');

        // Set Root settings: only allow 'access-pricetag' for Manager, not 'pricetag.manage' (which Manager also has)
        $root->setSetting('manageable_manager_permissions', ['access-pricetag']);

        // 1. Manager tries to assign 'access-pricetag' (is in whitelist and Manager has it) -> SUCCESS
        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => ['PIC Retail'],
            'permissions' => ['access-pricetag'],
        ]);
        $response->assertStatus(200);
        $this->assertTrue($target->refresh()->hasPermissionTo('access-pricetag'));

        // 2. Manager tries to assign 'pricetag.manage' (not in whitelist, though Manager has it) -> FAIL 403
        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => ['PIC Retail'],
            'permissions' => ['pricetag.manage'],
        ]);
        $response->assertStatus(403);
        $response->assertJsonPath('message', "Anda tidak memiliki wewenang untuk memberikan permission 'pricetag.manage'.");

        // 3. Manager tries to assign 'run-artisan' (not in whitelist, Manager does not have it anyway) -> FAIL 403
        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => ['PIC Retail'],
            'permissions' => ['run-artisan'],
        ]);
        $response->assertStatus(403);
    }

    public function test_manager_update_preserves_permissions_outside_their_authority(): void
    {
        $root = User::factory()->create([]);
        $root->assignRole('Root');
        $root->setSetting('manageable_manager_permissions', ['access-pricetag']);

        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create([]);
        $target->assignRole('PIC Retail');
        $target->givePermissionTo('run-artisan');

        $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => ['PIC Retail'],
            'permissions' => ['access-pricetag'],
        ])->assertOk();

        $target->refresh();
        $this->assertTrue($target->hasDirectPermission('run-artisan'));
        $this->assertTrue($target->hasDirectPermission('access-pricetag'));
    }

    public function test_whitelist_permissions_endpoints_accessible_only_by_root(): void
    {
        $root = User::factory()->create([]);
        $root->assignRole('Root');

        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        // Non-root try GET whitelist
        $this->actingAs($manager)->getJson('/api/v1/users/whitelist-manager-permissions')
            ->assertStatus(403);

        // Root GET whitelist
        $this->actingAs($root)->getJson('/api/v1/users/whitelist-manager-permissions')
            ->assertStatus(200);

        // Non-root POST whitelist
        $this->actingAs($manager)->postJson('/api/v1/users/whitelist-manager-permissions', [
            'permissions' => ['access-pricetag'],
        ])->assertStatus(403);

        // Root POST whitelist
        $this->actingAs($root)->postJson('/api/v1/users/whitelist-manager-permissions', [
            'permissions' => ['access-pricetag'],
        ])->assertStatus(200);

        $this->assertEquals(['access-pricetag'], $root->refresh()->getSetting('manageable_manager_permissions'));
    }

    public function test_user_options_respect_manager_hierarchy_and_whitelist(): void
    {
        $root = User::factory()->create([]);
        $root->assignRole('Root');
        $root->setSetting('manageable_manager_permissions', ['access-pricetag', 'run-artisan']);

        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        $rootResponse = $this->actingAs($root)->getJson('/api/v1/users/options');
        $rootResponse->assertOk();
        $this->assertContains('Root', $rootResponse->json('data.roles'));
        $this->assertContains('manage-roles', $rootResponse->json('data.permissions'));

        $managerResponse = $this->actingAs($manager)->getJson('/api/v1/users/options');
        $managerResponse->assertOk()
            ->assertJsonPath('data.is_root', false)
            ->assertJsonPath('data.manager_whitelist', []);
        $this->assertNotContains('Root', $managerResponse->json('data.roles'));
        $this->assertSame(['access-pricetag'], $managerResponse->json('data.permissions'));
        $this->assertSame([], $managerResponse->json('data.all_permissions'));
    }

    public function test_approver_without_manage_users_can_only_receive_role_options(): void
    {
        $approver = User::factory()->create([]);
        $approver->givePermissionTo('approve-users');

        $response = $this->actingAs($approver)->getJson('/api/v1/users/options');

        $response->assertOk();
        $this->assertNotEmpty($response->json('data.roles'));
        $this->assertSame([], $response->json('data.permissions'));
        $this->assertSame([], $response->json('data.all_permissions'));
    }

    public function test_only_root_can_view_managed_user_audit_data_and_revoke_session(): void
    {
        $root = User::factory()->create([]);
        $root->assignRole('Root');

        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create([]);
        $target->assignRole('Designer');

        DB::table('sessions')->insert([
            'id' => 'target_session',
            'user_id' => $target->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test Browser',
            'payload' => 'payload_data',
            'last_activity' => time(),
        ]);

        activity('auth')->causedBy($target)->log('[CORE] Test activity');

        $managerResponse = $this->actingAs($manager)->getJson("/api/v1/users/{$target->id}");
        $managerResponse->assertOk()
            ->assertJsonPath('data.can_view_audit', false)
            ->assertJsonCount(0, 'data.sessions')
            ->assertJsonCount(0, 'data.activities');

        $this->actingAs($manager)
            ->deleteJson("/api/v1/users/{$target->id}/sessions/target_session")
            ->assertForbidden();

        $this->actingAs($manager)
            ->getJson("/api/v1/users/{$target->id}/audit")
            ->assertForbidden();

        $this->actingAs($manager)
            ->getJson("/api/v1/users/{$target->id}/sessions")
            ->assertForbidden();

        $this->actingAs($manager)
            ->getJson("/api/v1/users/{$root->id}/audit")
            ->assertForbidden();

        $this->actingAs($manager)
            ->getJson("/api/v1/users/{$root->id}/sessions")
            ->assertForbidden();

        $rootResponse = $this->actingAs($root)->getJson("/api/v1/users/{$target->id}");
        $rootResponse->assertOk()
            ->assertJsonPath('data.can_view_audit', true)
            ->assertJsonPath('data.sessions.0.id', 'target_session')
            ->assertJsonPath('data.activities.0.description', '[CORE] Test activity');

        $this->actingAs($root)
            ->getJson("/api/v1/users/{$target->id}/audit")
            ->assertOk()
            ->assertJsonPath('data.0.description', '[CORE] Test activity');

        $this->actingAs($root)
            ->getJson("/api/v1/users/{$target->id}/sessions")
            ->assertOk()
            ->assertJsonPath('data.0.id', 'target_session');

        $this->actingAs($root)
            ->deleteJson("/api/v1/users/{$target->id}/sessions/target_session")
            ->assertOk();

        $this->assertDatabaseMissing('sessions', ['id' => 'target_session']);
    }

    public function test_manager_cannot_view_root_management_details(): void
    {
        $root = User::factory()->create([]);
        $root->assignRole('Root');

        $manager = User::factory()->create([]);
        $manager->assignRole('Manajer');

        $this->actingAs($manager)
            ->getJson("/api/v1/users/{$root->id}")
            ->assertForbidden()
            ->assertJsonPath('message', 'Manajer tidak dapat melihat detail pengguna Root.');
    }
}
