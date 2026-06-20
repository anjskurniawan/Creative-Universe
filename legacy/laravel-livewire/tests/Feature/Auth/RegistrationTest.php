<?php

namespace Tests\Feature\Auth;

use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'test-user',
            'email' => 'test@example.com',
            'whatsapp_number' => '6281234567890',
            'password' => 'password',
            'password_confirmation' => 'password',
            'registration_note' => 'Akun test untuk approval.',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('pending', absolute: false));

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'username' => 'test-user',
            'is_active' => false,
        ]);
    }
}
