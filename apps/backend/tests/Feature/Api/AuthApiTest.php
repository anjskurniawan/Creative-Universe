<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    /**
     * Test login returns user status.
     */
    public function test_login_returns_user_status_and_works_for_active_user(): void
    {
        $user = User::factory()->create([
            'username' => 'root',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'username' => 'root',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);

        $this->assertTrue(Auth::check());
    }

    public function test_default_designer_and_client_can_login_locally(): void
    {
        $designer = User::factory()->create([
            'name' => 'Designer',
            'username' => 'designer',
            'email' => 'designer@creativeuniverse.test',
            'password' => bcrypt('admin'),
        ]);
        $designer->assignRole('Designer');

        $client = User::factory()->create([
            'name' => 'Client',
            'username' => 'client',
            'email' => 'client@creativeuniverse.test',
            'password' => bcrypt('admin'),
        ]);
        $client->assignRole('Client');

        $this->postJson('/api/v1/auth/login', [
            'username' => 'designer',
            'password' => 'admin',
        ])
            ->assertOk()
            ->assertJsonPath('data.username', 'designer')
            ->assertJsonPath('data.roles.0', 'Designer');

        Auth::guard('web')->logout();

        $this->postJson('/api/v1/auth/login', [
            'username' => 'client',
            'password' => 'admin',
        ])
            ->assertOk()
            ->assertJsonPath('data.username', 'client')
            ->assertJsonPath('data.roles.0', 'Client');
    }

    public function test_default_manager_and_spv_can_login_locally(): void
    {
        $manager = User::factory()->create([
            'name' => 'Manajer',
            'username' => 'manajer',
            'email' => 'manajer@creativeuniverse.test',
            'password' => bcrypt('admin'),
        ]);
        $manager->assignRole('Manajer');

        $spv = User::factory()->create([
            'name' => 'SPV',
            'username' => 'spv',
            'email' => 'spv@creativeuniverse.test',
            'password' => bcrypt('admin'),
        ]);
        $spv->assignRole('SPV');

        $this->postJson('/api/v1/auth/login', [
            'username' => 'manajer',
            'password' => 'admin',
        ])
            ->assertOk()
            ->assertJsonPath('data.username', 'manajer')
            ->assertJsonPath('data.roles.0', 'Manajer');

        Auth::guard('web')->logout();

        $this->postJson('/api/v1/auth/login', [
            'username' => 'spv',
            'password' => 'admin',
        ])
            ->assertOk()
            ->assertJsonPath('data.username', 'spv')
            ->assertJsonPath('data.roles.0', 'SPV');
    }

    /**
     * Test invalid login credentials return 422 standard validation envelope.
     */
    public function test_invalid_login_returns_422(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'username' => 'root',
            'password' => 'wrong',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Data yang diberikan tidak valid.',
            'errors' => [
                'username' => ['Username atau password salah.'],
            ],
        ]);
    }

    /**
     * Test auth/me retrieves active authenticated user details.
     */
    public function test_auth_me_retrieves_authenticated_user_details(): void
    {
        $user = User::factory()->create([]);
        $user->assignRole('PIC Retail');

        $response = $this->actingAs($user)->getJson('/api/v1/auth/me');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => ['PIC Retail'],
            ],
        ]);
    }

    /**
     * Test accessing me endpoint without login returns 401.
     */
    public function test_unauthenticated_me_returns_401(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'message' => 'Silakan login terlebih dahulu.',
        ]);
    }

    public function test_unauthenticated_api_request_without_json_accept_returns_401(): void
    {
        $response = $this->get('/api/v1/odds/tasks');

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'message' => 'Silakan login terlebih dahulu.',
        ]);
    }

    /**
     * Test logout destroys session.
     */
    public function test_logout_destroys_session(): void
    {
        $user = User::factory()->create([]);

        $response = $this->actingAs($user)->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);

        $this->assertGuest('web');
    }
}
