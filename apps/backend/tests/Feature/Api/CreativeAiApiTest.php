<?php

namespace Tests\Feature\Api;

use App\Models\Core\Application;
use App\Models\Core\User;
use Database\Seeders\ApplicationRegistrySeeder;
use Database\Seeders\RolePermissionSeeder;
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
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['message']);
    }

    public function test_successful_ai_chat_response(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user);

        config()->set('services.groq.key', 'test-groq-key');
        Http::fake([
            'api.groq.com/*' => Http::response([
                'choices' => [
                    [
                        'message' => ['content' => 'Ini adalah respon mock Bynara untuk naskah video.'],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Tolong buatkan storyboard headset JETE',
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
                'content' => 'Ini adalah respon mock Bynara untuk naskah video.',
            ],
        ]);

        Http::assertSent(fn ($request) => $request->url() === 'https://api.groq.com/openai/v1/chat/completions'
            && count($request['messages']) === 3
            && $request['messages'][0]['role'] === 'user'
            && $request['messages'][1]['role'] === 'assistant'
            && $request['messages'][2]['role'] === 'user');
    }

    public function test_handles_groq_api_failure_gracefully(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user);

        config()->set('services.groq.key', 'test-groq-key');
        Http::fake([
            'api.groq.com/*' => Http::response(['error' => ['message' => 'API Key invalid.']], 401),
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Halo',
        ]);

        $response->assertStatus(502);
        $response->assertJson([
            'success' => false,
            'message' => 'Creative AI gagal memproses permintaan. Silakan coba lagi.',
        ]);
    }

    public function test_explains_when_groq_model_is_blocked_for_project(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user);

        config()->set('services.groq.key', 'test-groq-key');
        Http::fake([
            'api.groq.com/*' => Http::response([
                'error' => ['code' => 'model_permission_blocked_project'],
            ], 403),
        ]);

        $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Halo',
        ])->assertStatus(502)->assertJson([
            'success' => false,
            'message' => 'Model Groq belum diizinkan untuk project ini. Aktifkan model di Project Limits Groq lalu coba lagi.',
        ]);
    }

    public function test_explains_when_groq_compound_dependency_is_blocked_for_organization(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Designer');
        $this->grantCai($user);

        config()->set('services.groq.key', 'test-groq-key');
        Http::fake([
            'api.groq.com/*' => Http::response([
                'error' => ['message' => 'The model `openai/gpt-oss-120b` is blocked at the organization level.'],
            ], 403),
        ]);

        $this->actingAs($user)->postJson('/api/v1/cai/chat', [
            'message' => 'Halo',
        ])->assertStatus(502)->assertJson([
            'success' => false,
            'message' => 'Groq Compound belum dapat digunakan karena model internalnya diblokir pada organisasi Groq. Aktifkan model tersebut di Organization Limits Groq lalu coba lagi.',
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
