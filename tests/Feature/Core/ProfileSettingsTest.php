<?php

namespace Tests\Feature\Core;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_profile_page(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->get('/profile');

        $response->assertOk();
    }

    public function test_user_can_update_profile_info_with_whatsapp_and_ui_settings(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'New Name',
            'email' => 'newemail@example.com',
            'whatsapp_number' => '628123456789',
            'settings' => [
                'theme' => 'dark',
                'navbar_variant' => 'glass',
            ],
        ]);

        $response->assertRedirect('/profile');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'email' => 'newemail@example.com',
            'whatsapp_number' => '628123456789',
        ]);

        $user->refresh();
        $this->assertEquals('dark', $user->getSetting('theme'));
        $this->assertEquals('glass', $user->getSetting('navbar_variant'));
    }

    public function test_whatsapp_validation_requires_correct_format(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        // Invalid format: Starts with 08, too short
        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'Name',
            'email' => 'email@example.com',
            'whatsapp_number' => '0812345',
        ]);

        $response->assertSessionHasErrors(['whatsapp_number']);

        // Valid format: Starts with 62, 10-15 digits
        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'Name',
            'email' => 'email@example.com',
            'whatsapp_number' => '6281234567890',
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_user_can_upload_avatar(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['is_active' => true]);
        $avatarFile = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'Name',
            'email' => 'email@example.com',
            'avatar' => $avatarFile,
        ]);

        $response->assertRedirect('/profile');
        $user->refresh();

        $this->assertNotNull($user->avatar_path);
        Storage::disk('public')->assertExists($user->avatar_path);
    }

    public function test_user_can_revoke_other_sessions(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        // Seed sessions table
        DB::table('sessions')->insert([
            [
                'id' => 'session_1',
                'user_id' => $user->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/Chrome',
                'payload' => 'payload1',
                'last_activity' => time(),
            ],
            [
                'id' => 'session_2',
                'user_id' => $user->id,
                'ip_address' => '127.0.0.2',
                'user_agent' => 'Mozilla/Safari',
                'payload' => 'payload2',
                'last_activity' => time(),
            ]
        ]);

        // Revoke session_2
        $response = $this->actingAs($user)->delete(route('profile.session.revoke', 'session_2'));

        $response->assertRedirect('/profile');
        $this->assertDatabaseMissing('sessions', ['id' => 'session_2']);
        $this->assertDatabaseHas('sessions', ['id' => 'session_1']);
    }

    public function test_role_specific_settings_are_accessible_by_authorized_roles(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $superadmin = User::factory()->create(['is_active' => true]);
        $superadmin->assignRole('Superadmin');

        $desainer = User::factory()->create(['is_active' => true]);
        $desainer->assignRole('Desainer');

        // Test updating Superadmin-specific system settings
        $response = $this->actingAs($superadmin)->post('/profile/role-settings', [
            'settings' => [
                'maintenance_mode' => '1',
                'pusher_app_key' => 'test_key',
            ],
        ]);
        $response->assertRedirect('/profile');
        $superadmin->refresh();
        $this->assertEquals('1', $superadmin->getSetting('maintenance_mode'));
        $this->assertEquals('test_key', $superadmin->getSetting('pusher_app_key'));

        // Desainer cannot update Superadmin-specific settings like 'maintenance_mode'
        $response = $this->actingAs($desainer)->post('/profile/role-settings', [
            'settings' => [
                'maintenance_mode' => '1', // Superadmin-only
                'default_pricetag_layout' => 'modern', // Desainer allowed
            ],
        ]);
        $response->assertRedirect('/profile');
        $desainer->refresh();
        $this->assertNull($desainer->getSetting('maintenance_mode')); // Should filter this out
        $this->assertEquals('modern', $desainer->getSetting('default_pricetag_layout')); // Allowed
    }
}
