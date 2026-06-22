<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class MaintenanceApiTest extends TestCase
{
    use RefreshDatabase;

    private User $root;

    private User $designer;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup Spatie roles and permissions
        Permission::firstOrCreate(['name' => 'access-core']);
        Permission::firstOrCreate(['name' => 'access-pricetag']);
        Permission::firstOrCreate(['name' => 'run-artisan']);

        $rootRole = Role::firstOrCreate(['name' => 'Root']);
        $rootRole->syncPermissions(['access-core', 'access-pricetag', 'run-artisan']);

        $designerRole = Role::firstOrCreate(['name' => 'Designer']);
        $designerRole->syncPermissions(['access-core', 'access-pricetag']);

        // Create users
        $this->root = User::create([
            'name' => 'Root Maintenance',
            'username' => 'root_maint_test',
            'email' => 'maint_root@test.com',
            'password' => bcrypt('password'),
        ]);
        $this->root->assignRole('Root');

        $this->designer = User::create([
            'name' => 'Designer Maintenance',
            'username' => 'des_maint_test',
            'email' => 'maint_des@test.com',
            'password' => bcrypt('password'),
        ]);
        $this->designer->assignRole('Designer');

        // Setup app configuration for Web Artisan token
        Config::set('app.artisan_secret', 'test-artisan-secret-token-123');
        Config::set('app.artisan_allowed_ips', '');
    }

    // ----------------------------------------------------
    // Maintenance API (Sanctum) Tests
    // ----------------------------------------------------

    public function test_guest_cannot_access_maintenance_api(): void
    {
        $this->getJson('/api/v1/maintenance/status')->assertStatus(401);
        $this->postJson('/api/v1/maintenance/commands', ['command' => 'clear-cache'])->assertStatus(401);
    }

    public function test_designer_cannot_access_maintenance_api(): void
    {
        $this->actingAs($this->designer);

        $this->getJson('/api/v1/maintenance/status')->assertStatus(403);
        $this->postJson('/api/v1/maintenance/commands', ['command' => 'clear-cache'])->assertStatus(403);
    }

    public function test_root_can_view_maintenance_status(): void
    {
        $this->actingAs($this->root);

        $response = $this->getJson('/api/v1/maintenance/status');
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'app_env',
                    'cache_driver',
                    'queue_connection',
                    'failed_jobs_count',
                    'disk_free_space',
                    'log_file_size',
                ],
            ]);
    }

    public function test_root_can_run_allowed_maintenance_commands(): void
    {
        $this->actingAs($this->root);

        $response = $this->postJson('/api/v1/maintenance/commands', [
            'command' => 'clear-cache',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['command', 'output']]);

        // Assert activity log was created with Root as causer
        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'maintenance-ui',
            'causer_id' => $this->root->id,
            'causer_type' => User::class,
        ]);
    }

    public function test_root_cannot_run_forbidden_maintenance_commands(): void
    {
        $this->actingAs($this->root);

        $response = $this->postJson('/api/v1/maintenance/commands', [
            'command' => 'invalid-command', // truly not in allowlist key
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Perintah tidak diizinkan untuk dieksekusi dari panel web.');
    }

    // ----------------------------------------------------
    // Web Artisan Remote Routes Tests
    // ----------------------------------------------------

    public function test_web_artisan_routes_deny_get_requests(): void
    {
        // Old GET route should be 405 Method Not Allowed or 404 (registered as POST only)
        $response = $this->get('/_cmd/migrate', [
            'X-Artisan-Token' => 'test-artisan-secret-token-123',
        ]);
        $response->assertStatus(405);
    }

    public function test_web_artisan_routes_reject_invalid_token(): void
    {
        $response = $this->post('/_cmd/migrate', [], [
            'X-Artisan-Token' => 'wrong-token-abc',
        ]);
        $response->assertStatus(403);
    }

    public function test_web_artisan_routes_execute_with_valid_token(): void
    {
        $response = $this->post('/_cmd/clear-cache', [], [
            'X-Artisan-Token' => 'test-artisan-secret-token-123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['output']);

        // Assert audit trail logged without user causer (since it is a token-based API)
        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'web-artisan',
            'causer_id' => null,
        ]);
    }

    public function test_web_artisan_routes_deny_migrate_fresh_in_production(): void
    {
        // Mock app environment to production
        app()->detectEnvironment(fn () => 'production');
        $this->assertEquals('production', app()->environment());

        $response = $this->post('/_cmd/migrate-fresh', [], [
            'X-Artisan-Token' => 'test-artisan-secret-token-123',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Tindakan ini dilarang pada environment production.');

        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'web-artisan',
            'description' => 'Percobaan eksekusi remote command terlarang di production: migrate:fresh',
        ]);
    }

    public function test_root_can_run_extended_maintenance_commands(): void
    {
        $this->actingAs($this->root);

        $response = $this->postJson('/api/v1/maintenance/commands', [
            'command' => 'migrate',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['command', 'output']]);
    }

    public function test_root_cannot_run_destructive_maintenance_commands_in_production(): void
    {
        $this->actingAs($this->root);

        // Mock app environment to production
        app()->detectEnvironment(fn () => 'production');

        $response = $this->postJson('/api/v1/maintenance/commands', [
            'command' => 'migrate-fresh',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Tindakan ini dilarang pada environment production.');
    }

    public function test_root_can_run_clean_and_optimize_commands(): void
    {
        $this->actingAs($this->root);

        // Test clean activity-log
        $response = $this->postJson('/api/v1/maintenance/commands', [
            'command' => 'clean-activity-log',
        ]);
        $response->assertStatus(200)->assertJsonPath('success', true);

        // Mock Artisan call for optimize to prevent configuration caching issues in test environment
        Artisan::shouldReceive('call')
            ->with('optimize')
            ->once()
            ->andReturn(0);
        Artisan::shouldReceive('output')
            ->andReturn('Configuration cached successfully!');

        // Test optimize
        $response = $this->postJson('/api/v1/maintenance/commands', [
            'command' => 'optimize',
        ]);
        $response->assertStatus(200)->assertJsonPath('success', true);
    }

    public function test_web_artisan_routes_execute_clean_and_optimize_with_valid_token(): void
    {
        $response = $this->post('/_cmd/clean-activity-log', [], [
            'X-Artisan-Token' => 'test-artisan-secret-token-123',
        ]);
        $response->assertStatus(200)->assertJsonStructure(['output']);

        // Mock Artisan call for optimize
        Artisan::shouldReceive('call')
            ->with('optimize')
            ->once()
            ->andReturn(0);
        Artisan::shouldReceive('output')
            ->andReturn('Configuration cached successfully!');

        $response = $this->post('/_cmd/optimize', [], [
            'X-Artisan-Token' => 'test-artisan-secret-token-123',
        ]);
        $response->assertStatus(200)->assertJsonStructure(['output']);
    }
}
