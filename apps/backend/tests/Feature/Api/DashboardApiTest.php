<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_standard_user_receives_only_standard_metrics(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Designer');

        $this->actingAs($user)
            ->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.is_root', false)
            ->assertJsonPath('data.pending_users', null)
            ->assertJsonPath('data.root_metrics', null)
            ->assertJsonPath('data.roles.0', 'Designer');
    }

    public function test_root_receives_operational_metrics_and_latest_activity(): void
    {
        $root = User::factory()->create(['is_active' => true]);
        $root->assignRole('Root');

        User::factory()->create([
            'is_active' => false,
            'approved_by' => $root->id,
        ]);

        DB::table('sessions')->insert([
            'id' => 'dashboard-session',
            'user_id' => $root->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test Browser',
            'payload' => 'test',
            'last_activity' => time(),
        ]);

        activity('auth')->causedBy($root)->log('Aktivitas dashboard test');

        $this->actingAs($root)
            ->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.is_root', true)
            ->assertJsonPath('data.root_metrics.total_sessions', 1)
            ->assertJsonPath('data.root_metrics.suspended_users', 1)
            ->assertJsonFragment(['description' => 'Aktivitas dashboard test'])
            ->assertJsonStructure([
                'data' => [
                    'root_metrics' => [
                        'pending_jobs',
                        'failed_jobs',
                        'database_driver',
                        'database_size',
                        'laravel_version',
                        'php_version',
                    ],
                ],
            ]);
    }
}
