<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProfileSessionApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    /**
     * Test active user can view their active sessions list.
     */
    public function test_active_user_can_view_sessions(): void
    {
        $user = User::factory()->create([]);

        // Seed a dummy session
        DB::table('sessions')->insert([
            'id' => 'dummy_session_id',
            'user_id' => $user->id,
            'ip_address' => '192.168.1.1',
            'user_agent' => 'Mozilla/Chrome',
            'payload' => 'payload',
            'last_activity' => time()
        ]);

        $response = $this->actingAs($user)->getJson('/api/v1/profile/sessions');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => ['id', 'ip_address', 'user_agent', 'last_activity', 'is_current']
            ]
        ]);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('dummy_session_id', $response->json('data.0.id'));
    }



    /**
     * Test user can revoke their active session device.
     */
    public function test_user_can_revoke_session(): void
    {
        $user = User::factory()->create([]);

        DB::table('sessions')->insert([
            'id' => 'session_to_revoke',
            'user_id' => $user->id,
            'ip_address' => '192.168.1.2',
            'user_agent' => 'Mozilla/Safari',
            'payload' => 'payload',
            'last_activity' => time()
        ]);

        $response = $this->actingAs($user)->deleteJson('/api/v1/profile/sessions/session_to_revoke');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Sesi perangkat berhasil dicabut.',
        ]);

        $this->assertDatabaseMissing('sessions', ['id' => 'session_to_revoke']);
    }

    /**
     * Test user cannot revoke other user's session device.
     */
    public function test_user_cannot_revoke_other_users_session(): void
    {
        $userA = User::factory()->create([]);
        $userB = User::factory()->create([]);

        DB::table('sessions')->insert([
            'id' => 'session_user_b',
            'user_id' => $userB->id,
            'ip_address' => '192.168.1.3',
            'user_agent' => 'Mozilla/Firefox',
            'payload' => 'payload',
            'last_activity' => time()
        ]);

        $response = $this->actingAs($userA)->deleteJson('/api/v1/profile/sessions/session_user_b');

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => 'Sesi tidak ditemukan atau Anda tidak memiliki akses.',
        ]);

        $this->assertDatabaseHas('sessions', ['id' => 'session_user_b']);
    }
}
