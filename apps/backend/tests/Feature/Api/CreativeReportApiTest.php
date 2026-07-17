<?php

namespace Tests\Feature\Api;

use App\Models\Core\Application;
use App\Models\Core\Division;
use App\Models\Core\Position;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\CreativeReport\Models\CreativeMember;
use App\SubApps\CreativeReport\Models\ReportGroup;
use Database\Seeders\ApplicationRegistrySeeder;
use Database\Seeders\CreativeReportDemoSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CreativeReportApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(ApplicationRegistrySeeder::class);
    }

    public function test_it_calculates_hrd_score_and_final_score(): void
    {
        $actor = User::factory()->create();
        $actor->assignRole(Role::findOrCreate('Manajer'));
        $actor->applications()->attach(Application::where('key', 'creative-report')->firstOrFail(), ['granted_by' => $actor->id]);
        $staff = User::factory()->create();
        $group = ReportGroup::create(['name' => 'Creative Video Production', 'sort_order' => 1]);
        $assessment = Assessment::create(['creative_report_group_id' => $group->id, 'user_id' => $staff->id, 'period' => now()->startOfMonth(), 'creative_scores' => [6, 6, 6, 6, 6, 10, 10, 10, 10, 10], 'late_count' => 2, 'absence_count' => 2]);

        $this->actingAs($actor)->getJson('/api/v1/creative-reports?month='.now()->format('Y-m'))
            ->assertOk()->assertJsonPath('data.groups.0.assessments.0.hrd_review.score', 13)
            ->assertJsonPath('data.groups.0.assessments.0.totals.final', 93);

        $this->actingAs($actor)->getJson("/api/v1/creative-reports/{$assessment->id}")
            ->assertOk()->assertJsonPath('data.id', $assessment->id)
            ->assertJsonPath('data.user.name', $staff->name);

        $this->actingAs($actor)->getJson("/api/v1/creative-reports/users/{$staff->id}?month=".now()->format('Y-m'))
            ->assertOk()->assertJsonPath('data.id', $assessment->id)
            ->assertJsonPath('data.available_months.0', now()->format('Y-m'));

        $this->actingAs($actor)->postJson("/api/v1/creative-reports/{$assessment->id}/complete")
            ->assertOk()->assertJsonPath('data.status', 'completed');
    }

    public function test_application_access_and_feature_permissions_are_enforced_separately(): void
    {
        $staff = User::factory()->create();
        $group = ReportGroup::create(['name' => 'Creative Design Production', 'sort_order' => 1]);
        $assessment = Assessment::create([
            'creative_report_group_id' => $group->id,
            'user_id' => $staff->id,
            'period' => now()->startOfMonth(),
            'creative_scores' => array_fill(0, 10, 0),
        ]);
        $application = Application::where('key', 'creative-report')->firstOrFail();

        $withoutApplication = User::factory()->create();
        $withoutApplication->givePermissionTo('creative-report.assessments.view');
        $this->actingAs($withoutApplication)
            ->getJson('/api/v1/creative-reports?month='.now()->format('Y-m'))
            ->assertForbidden();

        $viewer = User::factory()->create();
        $viewer->givePermissionTo('creative-report.assessments.view');
        $viewer->applications()->attach($application, ['granted_by' => $viewer->id]);
        $this->actingAs($viewer)
            ->getJson('/api/v1/creative-reports?month='.now()->format('Y-m'))
            ->assertOk();
        $this->actingAs($viewer)
            ->patchJson("/api/v1/creative-reports/{$assessment->id}", $this->validUpdatePayload())
            ->assertForbidden();

        $editor = User::factory()->create();
        $editor->givePermissionTo('creative-report.assessments.update');
        $editor->applications()->attach($application, ['granted_by' => $editor->id]);
        $this->actingAs($editor)
            ->patchJson("/api/v1/creative-reports/{$assessment->id}", $this->validUpdatePayload())
            ->assertOk();
    }

    public function test_demo_seeder_creates_named_accounts_in_their_report_groups(): void
    {
        $this->seed(CreativeReportDemoSeeder::class);

        $this->assertDatabaseCount('creative_report_assessments', 57);
        $this->assertDatabaseHas('users', ['name' => 'Raka Pradana', 'username' => 'creative-supervisor-creative-production-1']);
        $this->assertDatabaseHas('users', ['name' => 'Bagas Pratama', 'username' => 'creative-creative-video-production-1']);
        $this->assertDatabaseHas('users', ['name' => 'Tio Prasetyo', 'username' => 'creative-creative-design-production-13']);
        $this->assertGreaterThan(1, Assessment::all()->map(fn (Assessment $item) => implode(',', $item->creative_scores))->unique()->count());
    }

    public function test_manager_can_approve_creative_staff_and_they_are_added_to_the_current_report(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manajer');
        $manager->applications()->attach(Application::where('key', 'creative-report')->firstOrFail(), ['granted_by' => $manager->id]);
        $division = Division::create(['name' => 'Creative']);
        $position = Position::create(['division_id' => $division->id, 'name' => 'Designer']);
        $staff = User::factory()->create(['division_id' => $division->id, 'position_id' => $position->id]);
        $member = CreativeMember::create(['user_id' => $staff->id, 'name' => $staff->name, 'position_id' => $position->id, 'position_name' => 'Designer']);

        $this->actingAs($manager)->getJson('/api/v1/creative-reports/members/pending')
            ->assertOk()->assertJsonPath('data.0.id', $member->id);
        $this->actingAs($manager)->postJson("/api/v1/creative-reports/members/{$member->id}/approve")
            ->assertOk()->assertJsonPath('data.status', 'active');

        $this->assertTrue(Assessment::query()
            ->where('creative_report_member_id', $member->id)
            ->where('user_id', $staff->id)
            ->whereDate('period', now()->startOfMonth())
            ->exists());
    }

    public function test_manager_can_add_historical_personnel_without_an_account(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manajer');
        $manager->applications()->attach(Application::where('key', 'creative-report')->firstOrFail(), ['granted_by' => $manager->id]);

        $this->actingAs($manager)->postJson('/api/v1/creative-reports/members/historical', [
            'name' => 'Eks Designer',
            'position_name' => 'Designer',
            'start_month' => now()->subMonth()->format('Y-m'),
            'end_month' => now()->format('Y-m'),
        ])->assertOk()->assertJsonPath('data.status', 'resigned');

        $member = CreativeMember::where('name', 'Eks Designer')->firstOrFail();
        $this->assertNull($member->user_id);
        $this->assertDatabaseCount('creative_report_assessments', 2);
    }

    public function test_manager_rejection_removes_the_pending_account(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manajer');
        $manager->applications()->attach(Application::where('key', 'creative-report')->firstOrFail(), ['granted_by' => $manager->id]);
        $pendingUser = User::factory()->create();
        $member = CreativeMember::create(['user_id' => $pendingUser->id, 'name' => $pendingUser->name, 'position_name' => 'Designer']);

        $this->actingAs($manager)->postJson("/api/v1/creative-reports/members/{$member->id}/reject")
            ->assertOk();

        $this->assertDatabaseMissing('creative_report_members', ['id' => $member->id]);
        $this->assertNull(User::withTrashed()->find($pendingUser->id));
    }

    private function validUpdatePayload(): array
    {
        return [
            'creative_scores' => [6, 6, 6, 6, 6, 10, 10, 10, 10, 10],
            'leave_count' => 0,
            'absence_count' => 0,
            'late_count' => 0,
        ];
    }
}
