<?php

namespace Tests\Feature\Core;

use App\Actions\Core\DeleteRoleAction;
use App\Livewire\Core\RoleManager;
use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use RuntimeException;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DynamicRoleManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_superadmin_can_open_role_manager_page(): void
    {
        $admin = $this->makeSuperadmin();

        $this->actingAs($admin)
            ->get('/roles')
            ->assertOk()
            ->assertSee('Kelola Role');
    }

    public function test_superadmin_can_create_new_role_with_permissions(): void
    {
        $admin = $this->makeSuperadmin();

        Livewire::actingAs($admin)
            ->test(RoleManager::class)
            ->set('form.name', 'Koordinator')
            ->set('form.permissions', ['access-core'])
            ->call('createRole')
            ->assertHasNoErrors();

        $role = Role::findByName('Koordinator');

        $this->assertDatabaseHas('roles', ['name' => 'Koordinator']);
        $this->assertTrue($role->hasPermissionTo('access-core'));
    }

    public function test_protected_role_cannot_be_deleted(): void
    {
        $admin = $this->makeSuperadmin();
        $role = Role::findByName('Superadmin');

        $this->expectException(RuntimeException::class);

        app(DeleteRoleAction::class)->handle($role, $admin);
    }

    public function test_role_with_active_users_cannot_be_deleted(): void
    {
        $admin = $this->makeSuperadmin();
        $role = Role::create(['name' => 'TestRole', 'guard_name' => 'web']);

        User::factory()
            ->create(['is_active' => true])
            ->assignRole($role);

        $this->expectException(RuntimeException::class);

        app(DeleteRoleAction::class)->handle($role, $admin);
    }

    private function makeSuperadmin(): User
    {
        $this->seed(RolePermissionSeeder::class);

        $admin = User::factory()->create(['is_active' => true]);
        $admin->assignRole('Superadmin');

        return $admin;
    }
}
