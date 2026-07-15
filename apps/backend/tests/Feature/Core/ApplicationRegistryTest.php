<?php

namespace Tests\Feature\Core;

use App\Models\Core\Application;
use App\Models\Core\PermissionMetadata;
use App\Models\Core\User;
use Database\Seeders\ApplicationRegistrySeeder;
use Database\Seeders\OddsPermissionSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ApplicationRegistryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(OddsPermissionSeeder::class);
        $this->seed(ApplicationRegistrySeeder::class);
    }

    public function test_it_registers_the_approved_core_and_sub_apps(): void
    {
        $this->assertDatabaseCount('applications', 7);
        $this->assertDatabaseHas('applications', [
            'key' => 'kv-retail',
            'name' => 'KV Retail Task',
            'frontend_path' => '/kv-retail',
            'api_prefix' => '/api/v1/kv-retail',
            'status' => 'active',
        ]);
        $this->assertDatabaseHas('applications', [
            'key' => 'cai',
            'name' => 'Creative Artificial Intelligence',
            'display_name' => 'Creative AI',
            'status' => 'experimental',
        ]);
        $this->assertDatabaseHas('applications', [
            'key' => 'creative-report',
            'frontend_path' => '/creative-report',
            'api_prefix' => '/api/v1/creative-reports',
        ]);
    }

    public function test_role_hierarchy_is_stored_without_changing_role_names(): void
    {
        $this->assertSame(100, Role::findByName('Root')->authority_level);
        $this->assertSame(80, Role::findByName('Manajer')->authority_level);
        $this->assertSame(60, Role::findByName('SPV')->authority_level);
    }

    public function test_permission_aliases_do_not_replace_backend_permission_keys(): void
    {
        $permission = Permission::findByName('manage-odds-config');
        $metadata = PermissionMetadata::whereBelongsTo($permission, 'permission')->firstOrFail();

        $this->assertSame('manage-odds-config', $permission->name);
        $this->assertSame('Manage Odds Config', $metadata->display_name);
        $this->assertSame('odds', $metadata->application->key);
    }

    public function test_odds_skip_permissions_have_clear_user_facing_aliases(): void
    {
        $requestPermission = Permission::findByName('request-odds-queue-skip');
        $reviewPermission = Permission::findByName('review-odds-queue-skip');

        $this->assertSame(
            'Mengajukan Skip Antrean ODDS',
            PermissionMetadata::whereBelongsTo($requestPermission, 'permission')->firstOrFail()->display_name,
        );
        $this->assertSame(
            'Meninjau Skip Antrean ODDS',
            PermissionMetadata::whereBelongsTo($reviewPermission, 'permission')->firstOrFail()->display_name,
        );
    }

    public function test_app_access_and_feature_permissions_are_independent(): void
    {
        $user = User::factory()->create();
        $application = Application::where('key', 'odds')->firstOrFail();

        $user->applications()->attach($application, ['granted_by' => $user->id]);

        $this->assertTrue($user->applications()->whereKey($application->id)->exists());
        $this->assertFalse($user->can('manage-odds-config'));
    }

    public function test_auth_profile_exposes_only_assigned_apps_plus_core_for_non_root(): void
    {
        $user = User::factory()->create();
        $user->assignRole(Role::findByName('Designer'));
        $odds = Application::where('key', 'odds')->firstOrFail();
        $user->applications()->attach($odds, ['granted_by' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/auth/me')->assertOk();

        $this->assertSame(['core', 'odds'], array_column($response->json('data.applications'), 'key'));
    }

    public function test_root_profile_receives_global_application_access(): void
    {
        $root = User::factory()->create();
        $root->assignRole(Role::findByName('Root'));

        $response = $this->actingAs($root)->getJson('/api/v1/auth/me')->assertOk();

        $this->assertCount(7, $response->json('data.applications'));
    }

    public function test_kv_retail_route_requires_registry_assignment(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole(Role::findByName('Manajer'));

        $this->actingAs($manager)->getJson('/api/v1/kv-retail/tasks')->assertForbidden();

        $application = Application::where('key', 'kv-retail')->firstOrFail();
        $manager->applications()->attach($application, ['granted_by' => $manager->id]);

        $this->actingAs($manager)->getJson('/api/v1/kv-retail/tasks')->assertOk();
    }

    public function test_permission_catalog_keeps_backend_key_and_exposes_ui_alias(): void
    {
        $root = User::factory()->create();
        $root->assignRole(Role::findByName('Root'));

        $this->actingAs($root)
            ->getJson('/api/v1/permission-catalog')
            ->assertOk()
            ->assertJsonFragment([
                'key' => 'manage-users',
                'display_name' => 'Kelola Pengguna',
                'application_key' => 'core',
            ]);
    }
}
