<?php

namespace Tests\Feature\Api;

use App\Events\PendingUserRegistered;
use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
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
     * Test user registration creates a pending account.
     */
    public function test_user_registration_creates_pending_account(): void
    {
        Event::fake([PendingUserRegistered::class]);

        $payload = [
            'name' => 'Budi Santoso',
            'username' => 'budi_s',
            'email' => 'budi@example.com',
            'whatsapp_number' => '6281234567890',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'registration_note' => 'Pendaftaran staf retail.',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201);
        $response->assertJson([
            'success' => true,
            'message' => 'Registrasi berhasil. Akun Anda sedang menunggu persetujuan admin.',
        ]);

        $this->assertDatabaseHas('users', [
            'username' => 'budi_s',
            'email' => 'budi@example.com',
            'is_active' => false,
        ]);

        Event::assertDispatched(PendingUserRegistered::class, fn (PendingUserRegistered $event) => $event->user->email === 'budi@example.com'
        );
    }

    /**
     * Test login returns user status.
     */
    public function test_login_returns_user_status_and_works_for_active_user(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'login' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'is_active' => true,
            ],
        ]);

        $this->assertTrue(Auth::check());
    }

    /**
     * Test login allows pending user to authenticate.
     */
    public function test_login_allows_pending_user(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
            'is_active' => false, // pending
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'login' => $user->username,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'is_active' => false,
            ],
        ]);
    }

    /**
     * Test invalid login credentials return 422 standard validation envelope.
     */
    public function test_invalid_login_returns_422(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'login' => 'nonexistent',
            'password' => 'wrong',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Data yang diberikan tidak valid.',
            'errors' => [
                'login' => ['Email/username atau password salah.'],
            ],
        ]);
    }

    /**
     * Test auth/me retrieves active authenticated user details.
     */
    public function test_auth_me_retrieves_authenticated_user_details(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole('Retail Staff');

        $response = $this->actingAs($user)->getJson('/api/v1/auth/me');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => true,
                'roles' => ['Retail Staff'],
            ],
        ]);
    }

    /**
     * Test auth/me retrieves pending user details as well.
     */
    public function test_auth_me_retrieves_pending_user_details(): void
    {
        $user = User::factory()->create(['is_active' => false]);

        $response = $this->actingAs($user)->getJson('/api/v1/auth/me');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'is_active' => false,
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

    /**
     * Test logout destroys session.
     */
    public function test_logout_destroys_session(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);

        $this->assertGuest('web');
    }
}
