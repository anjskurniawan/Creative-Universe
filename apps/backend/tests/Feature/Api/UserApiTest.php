<?php

namespace Tests\Feature\Api;

use App\Events\Core\UserStatusUpdated;
use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
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
        $user = User::factory()->create(['is_active' => true]);
        // Default active user has no role/permission to manage users

        $response = $this->actingAs($user)->getJson('/api/v1/users');

        $response->assertStatus(403);
    }

    public function test_unauthorized_user_cannot_mutate_or_inspect_managed_accounts(): void
    {
        $actor = User::factory()->create(['is_active' => true]);
        $target = User::factory()->create(['is_active' => true]);
        $pending = User::factory()->create(['is_active' => false]);

        $this->actingAs($actor)->getJson('/api/v1/users/options')->assertForbidden();
        $this->actingAs($actor)->getJson("/api/v1/users/{$target->id}")->assertForbidden();
        $this->actingAs($actor)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'is_active' => true,
            'roles' => [],
            'permissions' => [],
        ])->assertForbidden();
        $this->actingAs($actor)->postJson("/api/v1/users/{$pending->id}/approve", [
            'role' => 'Designer',
        ])->assertForbidden();
        $this->actingAs($actor)->postJson("/api/v1/users/{$pending->id}/reject")
            ->assertForbidden();
        $this->actingAs($actor)->deleteJson("/api/v1/users/{$target->id}/sessions/missing")
            ->assertForbidden();
    }

    public function test_authorized_user_can_access_user_list_with_pagination(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        // Create 2 extra active users
        User::factory()->create(['name' => 'Budi Santoso', 'is_active' => true]);
        User::factory()->create(['name' => 'Jane Doe', 'is_active' => true]);

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
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $user1 = User::factory()->create(['name' => 'Budi Santoso', 'is_active' => true]);
        $user1->assignRole('Retail Staff');

        $user2 = User::factory()->create(['name' => 'Jane Doe', 'is_active' => true]);
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

    public function test_unauthorized_user_cannot_access_pending_users(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->getJson('/api/v1/users/pending');

        $response->assertStatus(403);
    }

    public function test_authorized_user_can_access_pending_users(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Manajer');

        // Create a pending user
        User::factory()->create(['is_active' => false]);

        $response = $this->actingAs($admin)->getJson('/api/v1/users/pending');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'data',
                'meta' => [
                    'current_page',
                    'last_page',
                ],
            ],
        ]);
        $this->assertCount(1, $response->json('data.data'));
    }

    public function test_approve_pending_user_works_and_dispatches_event(): void
    {
        Event::fake();

        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $pendingUser = User::factory()->create(['is_active' => false]);

        $response = $this->actingAs($admin)->postJson("/api/v1/users/{$pendingUser->id}/approve", [
            'role' => 'Retail Staff',
        ]);

        $response->assertStatus(200);
        $this->assertTrue($pendingUser->refresh()->is_active);
        $this->assertTrue($pendingUser->hasRole('Retail Staff'));
        $this->assertEquals($admin->id, $pendingUser->approved_by);

        Event::assertDispatched(UserStatusUpdated::class);
    }

    public function test_reject_pending_user_soft_deletes_and_dispatches_event(): void
    {
        Event::fake();

        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $pendingUser = User::factory()->create(['is_active' => false]);

        $response = $this->actingAs($admin)->postJson("/api/v1/users/{$pendingUser->id}/reject");

        $response->assertStatus(200);
        $this->assertSoftDeleted('users', [
            'id' => $pendingUser->id,
            'deleted_by' => $admin->id,
        ]);

        Event::assertDispatched(UserStatusUpdated::class);
    }

    public function test_deactivating_user_clears_active_sessions(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $targetUser = User::factory()->create(['is_active' => true]);

        // Insert fake session
        DB::table('sessions')->insert([
            'id' => 'fake_session_id_123',
            'user_id' => $targetUser->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0',
            'payload' => 'payload_data',
            'last_activity' => time(),
        ]);

        $this->assertDatabaseHas('sessions', ['user_id' => $targetUser->id]);

        $response = $this->actingAs($admin)->patchJson("/api/v1/users/{$targetUser->id}", [
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'is_active' => false,
            'roles' => [],
            'permissions' => [],
        ]);

        $response->assertStatus(200);
        $this->assertFalse($targetUser->refresh()->is_active);
        $this->assertDatabaseMissing('sessions', ['user_id' => $targetUser->id]);
    }

    public function test_manager_cannot_edit_root_users(): void
    {
        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$root->id}", [
            'name' => 'Root Edited',
            'email' => $root->email,
            'is_active' => true,
            'roles' => ['Root'],
            'permissions' => [],
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('success', false);
        $response->assertJsonPath('message', 'Manajer tidak dapat mengedit otorisasi pengguna Root.');
    }

    public function test_manager_cannot_assign_root_role(): void
    {
        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create(['is_active' => true]);
        $target->assignRole('Retail Staff');

        // Try to approve with Root role
        $pending = User::factory()->create(['is_active' => false]);
        $approveResponse = $this->actingAs($manager)->postJson("/api/v1/users/{$pending->id}/approve", [
            'role' => 'Root',
        ]);
        $approveResponse->assertStatus(403);

        // Try to update user with Root role
        $updateResponse = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'is_active' => true,
            'roles' => ['Root'],
            'permissions' => [],
        ]);
        $updateResponse->assertStatus(403);
    }

    public function test_manager_can_only_assign_whitelisted_permissions(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create(['is_active' => true]);
        $target->assignRole('Retail Staff');

        // Set Root settings: only allow 'access-pricetag' for Manager, not 'pricetag.manage' (which Manager also has)
        $root->setSetting('manageable_manager_permissions', ['access-pricetag']);

        // 1. Manager tries to assign 'access-pricetag' (is in whitelist and Manager has it) -> SUCCESS
        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'is_active' => true,
            'roles' => ['Retail Staff'],
            'permissions' => ['access-pricetag'],
        ]);
        $response->assertStatus(200);
        $this->assertTrue($target->refresh()->hasPermissionTo('access-pricetag'));

        // 2. Manager tries to assign 'pricetag.manage' (not in whitelist, though Manager has it) -> FAIL 403
        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'is_active' => true,
            'roles' => ['Retail Staff'],
            'permissions' => ['pricetag.manage'],
        ]);
        $response->assertStatus(403);
        $response->assertJsonPath('message', "Anda tidak memiliki wewenang untuk memberikan permission 'pricetag.manage'.");

        // 3. Manager tries to assign 'run-artisan' (not in whitelist, Manager does not have it anyway) -> FAIL 403
        $response = $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'is_active' => true,
            'roles' => ['Retail Staff'],
            'permissions' => ['run-artisan'],
        ]);
        $response->assertStatus(403);
    }

    public function test_manager_update_preserves_permissions_outside_their_authority(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');
        $root->setSetting('manageable_manager_permissions', ['access-pricetag']);

        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create(['is_active' => true]);
        $target->assignRole('Retail Staff');
        $target->givePermissionTo('run-artisan');

        $this->actingAs($manager)->patchJson("/api/v1/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'is_active' => true,
            'roles' => ['Retail Staff'],
            'permissions' => ['access-pricetag'],
        ])->assertOk();

        $target->refresh();
        $this->assertTrue($target->hasDirectPermission('run-artisan'));
        $this->assertTrue($target->hasDirectPermission('access-pricetag'));
    }

    public function test_whitelist_permissions_endpoints_accessible_only_by_root(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $manager = User::factory()->create(['is_active' => true]);
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

    public function test_approve_and_reject_only_accept_pending_accounts(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $activeUser = User::factory()->create([
            'is_active' => true,
            'approved_by' => $root->id,
            'approved_at' => now(),
        ]);

        $this->actingAs($root)
            ->postJson("/api/v1/users/{$activeUser->id}/approve", ['role' => 'Designer'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Akun ini tidak lagi menunggu persetujuan.');

        $this->actingAs($root)
            ->postJson("/api/v1/users/{$activeUser->id}/reject")
            ->assertStatus(422)
            ->assertJsonPath('message', 'Akun ini tidak lagi menunggu persetujuan.');

        $this->assertDatabaseHas('users', [
            'id' => $activeUser->id,
            'deleted_at' => null,
        ]);
    }

    public function test_user_options_respect_manager_hierarchy_and_whitelist(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');
        $root->setSetting('manageable_manager_permissions', ['access-pricetag', 'run-artisan']);

        $manager = User::factory()->create(['is_active' => true]);
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
        $approver = User::factory()->create(['is_active' => true]);
        $approver->givePermissionTo('approve-users');

        $response = $this->actingAs($approver)->getJson('/api/v1/users/options');

        $response->assertOk();
        $this->assertNotEmpty($response->json('data.roles'));
        $this->assertSame([], $response->json('data.permissions'));
        $this->assertSame([], $response->json('data.all_permissions'));
    }

    public function test_only_root_can_view_managed_user_audit_data_and_revoke_session(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        $target = User::factory()->create(['is_active' => true]);
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
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        $manager = User::factory()->create(['is_active' => true]);
        $manager->assignRole('Manajer');

        $this->actingAs($manager)
            ->getJson("/api/v1/users/{$root->id}")
            ->assertForbidden()
            ->assertJsonPath('message', 'Manajer tidak dapat melihat detail pengguna Root.');
    }
}
