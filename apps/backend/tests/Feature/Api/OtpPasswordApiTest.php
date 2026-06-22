<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OtpPasswordApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        // Set services config so Fonnte token is not considered empty
        config(['services.fonnte.token' => 'mock-token']);
    }

    /**
     * Test requesting OTP generates and sends WhatsApp message using mock Http.
     */
    public function test_request_otp_sends_whatsapp_message(): void
    {
        Http::fake([
            'api.fonnte.com/*' => Http::response(['status' => true], 200),
        ]);

        $user = User::factory()->create([
            'email' => 'tulus@example.com',
            'username' => 'tulus_r',
            'whatsapp_number' => '6281234567890',
            ]);

        $response = $this->postJson('/api/v1/auth/password/otp', [
            'login' => 'tulus@example.com',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Kode OTP berhasil dikirim ke WhatsApp Anda.',
            'data' => [
                'masked_phone' => '6281****7890',
            ]
        ]);

        // Assert OTP is saved in database
        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => 'tulus@example.com',
        ]);

        // Assert session has reset email stored
        $this->assertEquals('tulus@example.com', session('password_reset_email'));

        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.fonnte.com/send' &&
                   $request['target'] === '6281234567890' &&
                   str_contains($request['message'], 'Kode OTP');
        });
    }

    /**
     * Test verifying correct OTP code.
     */
    public function test_verify_otp_success(): void
    {
        $email = 'tulus@example.com';
        $otp = '123456';

        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($otp),
            'created_at' => now(),
        ]);

        // Put email in session simulating step 1
        $this->withSession(['password_reset_email' => $email]);

        $response = $this->postJson('/api/v1/auth/password/otp/verify', [
            'otp' => $otp,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Kode OTP berhasil diverifikasi.',
        ]);

        $this->assertTrue(session('password_reset_verified'));
    }

    /**
     * Test verifying invalid OTP code.
     */
    public function test_verify_otp_fails_with_invalid_code(): void
    {
        $email = 'tulus@example.com';

        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make('111111'),
            'created_at' => now(),
        ]);

        $this->withSession(['password_reset_email' => $email]);

        $response = $this->postJson('/api/v1/auth/password/otp/verify', [
            'otp' => '222222', // incorrect OTP
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Data yang diberikan tidak valid.',
            'errors' => [
                'otp' => ['Kode OTP salah. Periksa kembali.']
            ]
        ]);
    }

    /**
     * Test password reset succeeds after valid OTP verification.
     */
    public function test_reset_password_success(): void
    {
        $user = User::factory()->create([
            'email' => 'tulus@example.com',
            'password' => bcrypt('oldpassword'),
        ]);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('123456'),
            'created_at' => now(),
        ]);

        // Put email and verified status in session
        $this->withSession([
            'password_reset_email' => $user->email,
            'password_reset_verified' => true,
        ]);

        $response = $this->postJson('/api/v1/auth/password/reset', [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Password berhasil direset. Silakan masuk dengan password baru.',
        ]);

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));

        // Assert cleanup
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => $user->email]);
        $this->assertNull(session('password_reset_email'));
        $this->assertNull(session('password_reset_verified'));
    }

    /**
     * Test resetting password without verifying OTP returns 400.
     */
    public function test_reset_password_fails_without_verification(): void
    {
        $response = $this->postJson('/api/v1/auth/password/reset', [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            'success' => false,
            'message' => 'Sesi tidak valid atau kedaluwarsa. Silakan ulangi dari awal.',
        ]);
    }
}
