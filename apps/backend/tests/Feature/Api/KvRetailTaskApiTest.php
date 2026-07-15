<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use App\Models\Core\Application;
use App\SubApps\KvRetail\Events\KvRetailTaskAssigned;
use App\SubApps\KvRetail\Models\KvRetailTask;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class KvRetailTaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_kv_retail_task_broadcasts_assignment_to_selected_users(): void
    {
        Event::fake([KvRetailTaskAssigned::class]);

        $creator = User::factory()->create();
        $creator->assignRole(Role::findOrCreate('Manajer'));
        $this->grantKvRetail($creator);
        $firstAssignee = User::factory()->create();
        $secondAssignee = User::factory()->create();

        $response = $this->actingAs($creator)->postJson('/api/v1/kv-retail/tasks', [
            'task_given_date' => '2026-07-11',
            'task_name' => 'Realtime task assignment',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-12',
            'assigned_to' => [$firstAssignee->id, $secondAssignee->id],
        ]);

        $response->assertCreated();

        Event::assertDispatched(KvRetailTaskAssigned::class, function (KvRetailTaskAssigned $event) use ($firstAssignee, $secondAssignee) {
            return $event->task->task_name === 'Realtime task assignment'
                && $event->userIds === [$firstAssignee->id, $secondAssignee->id];
        });
    }

    public function test_late_stage_requires_a_reason_before_the_next_status(): void
    {
        $creator = User::factory()->create();
        $creator->assignRole(Role::findOrCreate('Manajer'));
        $this->grantKvRetail($creator);
        $task = KvRetailTask::create([
            'task_given_date' => '2026-07-01',
            'task_name' => 'Late ACC Draft task',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-10',
            'status' => 'ACC Draft',
            'task_timestamps' => ['ACC Draft' => '03/07/2026 10:00'],
            'created_by' => $creator->id,
        ]);

        $this->actingAs($creator)
            ->patchJson("/api/v1/kv-retail/tasks/{$task->id}/status", [
                'status' => 'Progress Design',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('delay_reason');

        $this->actingAs($creator)
            ->patchJson("/api/v1/kv-retail/tasks/{$task->id}/status", [
                'status' => 'Progress Design',
                'task_timestamps' => [
                    'ACC Draft' => '03/07/2026 10:00',
                    'Progress' => '03/07/2026 12:00',
                ],
                'delay_reason' => 'Menunggu revisi materi dari vendor.',
            ])
            ->assertOk()
            ->assertJsonPath('data.delay_reasons.ACC Draft.reason', 'Menunggu revisi materi dari vendor.')
            ->assertJsonPath('data.timing_evaluation.bottleneck', true);
    }

    private function grantKvRetail(User $user): void
    {
        foreach (['kv-retail.tasks.view', 'kv-retail.tasks.create', 'kv-retail.tasks.update-status'] as $permission) {
            Permission::findOrCreate($permission);
            $user->givePermissionTo($permission);
        }
        $application = Application::create([
            'key' => 'kv-retail',
            'name' => 'KV Retail Task',
            'display_name' => 'KV Retail Task',
            'type' => 'sub_app',
            'status' => 'active',
            'frontend_path' => '/kv-retail',
            'api_prefix' => '/api/v1/kv-retail',
            'table_prefix' => 'kv_retail_',
        ]);
        $user->applications()->attach($application, ['granted_by' => $user->id]);
    }
}
