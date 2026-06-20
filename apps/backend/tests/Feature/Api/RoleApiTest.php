<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_unauthorized_user_cannot_access_roles(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->getJson('/api/v1/roles');

        $response->assertStatus(403);
    }

    public function test_unauthorized_user_cannot_mutate_roles(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        $role = Role::findByName('Designer', 'web');

        $this->actingAs($user)->postJson('/api/v1/roles', [
            'name' => 'Unauthorized Role',
            'permissions' => [],
        ])->assertForbidden();

        $this->actingAs($user)->patchJson("/api/v1/roles/{$role->id}", [
            'permissions' => [],
        ])->assertForbidden();

        $this->actingAs($user)->deleteJson("/api/v1/roles/{$role->id}")
            ->assertForbidden();
    }

    public function test_authorized_user_can_list_roles(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $response = $this->actingAs($admin)->getJson('/api/v1/roles');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'protected',
                    'users_count',
                    'active_users_count',
                    'permissions',
                ],
            ],
            'message',
        ]);

        $this->assertGreaterThanOrEqual(7, count($response->json('data')));
    }

    public function test_create_role_validations(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        // Required name
        $response = $this->actingAs($admin)->postJson('/api/v1/roles', [
            'name' => '',
            'permissions' => [],
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        // Already exists
        $response = $this->actingAs($admin)->postJson('/api/v1/roles', [
            'name' => 'Root',
            'permissions' => [],
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_create_role_successfully(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $response = $this->actingAs($admin)->postJson('/api/v1/roles', [
            'name' => 'Staff Gudang',
            'permissions' => ['access-core', 'access-pricetag'],
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.name', 'Staff Gudang');

        $role = Role::findByName('Staff Gudang', 'web');
        $this->assertNotNull($role);
        $this->assertTrue($role->hasPermissionTo('access-core'));
        $this->assertTrue($role->hasPermissionTo('access-pricetag'));
    }

    public function test_update_role_permissions(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $role = Role::create(['name' => 'IT Support']);
        $role->givePermissionTo('access-core');

        $response = $this->actingAs($admin)->patchJson("/api/v1/roles/{$role->id}", [
            'permissions' => ['access-core', 'run-artisan'],
        ]);

        $response->assertStatus(200);
        $this->assertTrue($role->refresh()->hasPermissionTo('run-artisan'));
        $this->assertTrue($role->hasPermissionTo('access-core'));
    }

    public function test_delete_protected_role_is_prevented(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $role = Role::findByName('Supervisor', 'web');

        $response = $this->actingAs($admin)->deleteJson("/api/v1/roles/{$role->id}");

        $response->assertStatus(422);
        $response->assertJsonPath('success', false);
        $response->assertJsonPath('message', "Role 'Supervisor' adalah role inti yang dilindungi dan tidak dapat dihapus.");
    }

    public function test_delete_role_with_active_users_is_prevented(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        // Create a custom non-protected role
        $role = Role::create(['name' => 'Custom Role']);

        // Assign user to role
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Custom Role');

        $response = $this->actingAs($admin)->deleteJson("/api/v1/roles/{$role->id}");

        $response->assertStatus(422);
        $response->assertJsonPath('success', false);
        $this->assertStringContainsString('masih memiliki 1 user aktif', $response->json('message'));
    }

    public function test_delete_role_successfully(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $role = Role::create(['name' => 'Temporary Role']);

        $response = $this->actingAs($admin)->deleteJson("/api/v1/roles/{$role->id}");

        $response->assertStatus(200);
        $this->assertNull(Role::find($role->id));
    }

    public function test_get_permissions_list(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Root');

        $response = $this->actingAs($admin)->getJson('/api/v1/permissions');

        $response->assertStatus(200);
        $this->assertContains('access-core', $response->json('data'));
        $this->assertContains('manage-users', $response->json('data'));
        $this->assertContains('manage-roles', $response->json('data'));
    }
}
