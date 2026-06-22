<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_active_user_can_view_and_update_profile(): void
    {
        $user = User::factory()->create([
            'settings' => [
                'theme' => 'light',
                'pusher_app_secret' => 'never-expose-this',
            ],
        ]);

        $this->actingAs($user)
            ->getJson('/api/v1/profile')
            ->assertOk()
            ->assertJsonPath('data.settings.theme', 'light')
            ->assertJsonMissingPath('data.settings.pusher_app_secret');

        $response = $this->actingAs($user)->patchJson('/api/v1/profile', [
            'name' => 'Nama Baru',
            'username' => 'nama-baru',
            'email' => 'nama.baru@example.com',
            'whatsapp_number' => '6281234567890',
            'settings' => [
                'theme' => 'dark',
                'navbar_variant' => 'glass',
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Nama Baru')
            ->assertJsonPath('data.settings.theme', 'dark');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'username' => 'nama-baru',
            'email' => 'nama.baru@example.com',
            'updated_by' => $user->id,
        ]);
    }

    public function test_profile_update_validates_whatsapp_and_unique_identity(): void
    {
        $user = User::factory()->create([]);
        $other = User::factory()->create([]);

        $this->actingAs($user)->patchJson('/api/v1/profile', [
            'name' => 'Nama Pengguna',
            'username' => $other->username,
            'email' => $other->email,
            'whatsapp_number' => '+62812',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['username', 'email', 'whatsapp_number']);
    }

    public function test_active_user_can_update_password_with_current_password(): void
    {
        $user = User::factory()->create([
            'password' => 'password-lama',
        ]);

        $this->actingAs($user)->putJson('/api/v1/profile/password', [
            'current_password' => 'password-lama',
            'password' => 'password-baru',
            'password_confirmation' => 'password-baru',
        ])->assertOk();

        $this->assertTrue(Hash::check('password-baru', $user->refresh()->password));

        $this->actingAs($user)->putJson('/api/v1/profile/password', [
            'current_password' => 'salah',
            'password' => 'password-lain',
            'password_confirmation' => 'password-lain',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_active_user_can_replace_avatar_and_old_file_is_removed(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('avatars/old-avatar.jpg', 'old');

        $user = User::factory()->create([
            'avatar_path' => 'avatars/old-avatar.jpg',
        ]);

        $response = $this->actingAs($user)->post('/api/v1/profile/avatar', [
            'avatar' => UploadedFile::fake()->image('avatar.webp', 200, 200),
        ], ['Accept' => 'application/json']);

        $response->assertOk();

        $newPath = $user->refresh()->avatar_path;
        $this->assertNotNull($newPath);
        $this->assertNotSame('avatars/old-avatar.jpg', $newPath);
        Storage::disk('public')->assertExists($newPath);
        Storage::disk('public')->assertMissing('avatars/old-avatar.jpg');
    }



    public function test_active_user_can_view_activities(): void
    {
        $user = User::factory()->create([]);

        activity('auth')
            ->causedBy($user)
            ->performedOn($user)
            ->log('[CORE] Testing activities');

        $this->actingAs($user)
            ->getJson('/api/v1/profile/activities')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.description', '[CORE] Testing activities');
    }
}
