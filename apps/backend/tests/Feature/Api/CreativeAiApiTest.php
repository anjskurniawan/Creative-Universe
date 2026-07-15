<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\ApplicationRegistrySeeder;
use App\Models\Core\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CreativeAiApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(ApplicationRegistrySeeder::class);
    }

    /**
     * Test guest cannot access the chat endpoint.
     */
    public function test_guest_cannot_access_ai_chat(): void
    {
        $response = $this->postJson('/api/v1/cai/chat', [
            'message' => 'Halo',
            'agent_type' => 'storyboard',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user without CAI application assignment cannot access it.
     */
    public function test_authenticated_user_without_cai_assignment_is_forbidden(): void
    {
        // Typically all seeded roles have access-core, but let's test a user with no roles
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Halo',
            'agent_type' => 'storyboard',
        ]);

        $response->assertStatus(403);
    }

    public function test_authenticated_user_without_cai_permission_is_forbidden(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user, false);

        $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Halo',
            'agent_type' => 'storyboard',
        ])->assertForbidden();
    }

    /**
     * Test validation failure with incomplete payload.
     */
    public function test_validation_failure_for_incomplete_payload(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user);

        $response = $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => '',
            'agent_type' => 'invalid_agent',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['message', 'agent_type']);
    }

    /**
     * Test successful AI chat response with mocked Gemini API response.
     */
    public function test_successful_ai_chat_response(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user);

        // Mock the Google Gemini API response
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Ini adalah respon mock dari Gemini untuk naskah video.'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Tolong buatkan storyboard headset JETE',
            'agent_type' => 'storyboard',
            'history' => [
                ['role' => 'user', 'content' => 'Halo'],
                ['role' => 'assistant', 'content' => 'Halo! Ada yang bisa saya bantu?'],
            ],
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Respon AI berhasil dibuat.',
            'data' => [
                'content' => 'Ini adalah respon mock dari Gemini untuk naskah video.',
            ],
        ]);
    }

    /**
     * Test handling of Gemini API failure.
     */
    public function test_handles_gemini_api_failure_gracefully(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user);

        // Mock a failure response from Gemini API
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'error' => [
                    'message' => 'API Key invalid.',
                ],
            ], 400),
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Halo',
            'agent_type' => 'storyboard',
        ]);

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
            'message' => 'Google Gemini API Error: API Key invalid.',
        ]);
    }

    private function grantCai(User $user, bool $grantPermission = true): void
    {
        $application = Application::where('key', 'cai')->firstOrFail();
        $user->applications()->attach($application, ['granted_by' => $user->id]);
        if ($grantPermission) {
            $user->givePermissionTo('access-cai');
        }
    }
}
