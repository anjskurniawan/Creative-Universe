<?php

namespace Tests\Feature\Api;

use App\Models\Core\Division;
use App\Models\Core\Position;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\CreativeMember;
use Database\Seeders\OnboardingDataSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OnboardingApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(OnboardingDataSeeder::class);
    }

    public function test_creative_manager_position_is_hidden_after_it_is_filled(): void
    {
        $creative = Division::where('name', 'Creative')->firstOrFail();
        $managerPosition = Position::where('division_id', $creative->id)
            ->where('name', 'Manajer')
            ->firstOrFail();

        User::factory()->create([
            'division_id' => $creative->id,
            'position_id' => $managerPosition->id,
            'is_onboarded' => true,
        ])->assignRole('Manajer');

        $currentUser = User::factory()->create([
            'is_onboarded' => false,
        ]);

        $response = $this->actingAs($currentUser)->getJson('/api/v1/onboarding/data');

        $response->assertOk();

        $creativePayload = collect($response->json('data'))
            ->firstWhere('name', 'Creative');
        $positionNames = collect($creativePayload['positions'])->pluck('name')->all();

        $this->assertNotContains('Manajer', $positionNames);
        $this->assertContains('SPV', $positionNames);
        $this->assertContains('Designer', $positionNames);
        $this->assertContains('Videographer', $positionNames);
    }

    public function test_non_creative_user_submits_manual_position(): void
    {
        $accounting = Division::where('name', 'Accounting')->firstOrFail();
        $user = User::factory()->create([
            'is_onboarded' => false,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/onboarding/submit', [
            'name' => 'Akunting User',
            'division_id' => $accounting->id,
            'position_name' => 'Staff Akunting',
            'whatsapp_number' => '081234567890',
        ]);

        $response->assertOk();

        $position = Position::where('division_id', $accounting->id)
            ->where('name', 'Staff Akunting')
            ->firstOrFail();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Akunting User',
            'division_id' => $accounting->id,
            'position_id' => $position->id,
            'is_onboarded' => true,
        ]);
        $this->assertTrue($user->fresh()->hasRole('Client'));
    }

    public function test_creative_manager_position_can_only_be_filled_once(): void
    {
        $creative = Division::where('name', 'Creative')->firstOrFail();
        $managerPosition = Position::where('division_id', $creative->id)
            ->where('name', 'Manajer')
            ->firstOrFail();

        User::factory()->create([
            'division_id' => $creative->id,
            'position_id' => $managerPosition->id,
            'is_onboarded' => true,
        ])->assignRole('Manajer');

        $user = User::factory()->create([
            'is_onboarded' => false,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/onboarding/submit', [
            'name' => 'Manager Kedua',
            'division_id' => $creative->id,
            'position_id' => $managerPosition->id,
            'whatsapp_number' => '081234567891',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['position_id']);

        $this->assertFalse((bool) $user->fresh()->is_onboarded);
    }

    public function test_creative_onboarding_creates_a_pending_member_for_manager_review(): void
    {
        $creative = Division::where('name', 'Creative')->firstOrFail();
        $designerPosition = Position::where('division_id', $creative->id)
            ->where('name', 'Designer')
            ->firstOrFail();
        $user = User::factory()->create(['is_onboarded' => false]);

        $this->actingAs($user)->postJson('/api/v1/onboarding/submit', [
            'name' => 'Designer Baru',
            'division_id' => $creative->id,
            'position_id' => $designerPosition->id,
            'whatsapp_number' => '081234567899',
        ])->assertOk();

        $this->assertDatabaseHas('creative_report_members', [
            'user_id' => $user->id,
            'name' => 'Designer Baru',
            'position_name' => 'Designer',
            'status' => CreativeMember::STATUS_PENDING,
        ]);
    }
}
