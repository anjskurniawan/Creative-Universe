<?php

namespace Tests\Feature\Api;

use App\Models\Core\User;
use App\Models\Core\Application;
use App\SubApps\KvRetail\Events\KvRetailTaskAssigned;
use App\SubApps\KvRetail\Models\KvRetailTask;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class KvRetailTaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_assignee_options_include_kv_retail_users_except_root(): void
    {
        $creator = User::factory()->create(['name' => 'Task Manager']);
        $creator->assignRole(Role::findOrCreate('Manajer'));
        $this->grantKvRetail($creator);

        $root = User::factory()->create(['name' => 'Platform Root']);
        $root->assignRole(Role::findOrCreate('Root'));
        $this->grantExistingKvRetailApplication($root, $creator);

        $spv = User::factory()->create(['name' => 'Assigned SPV']);
        $spv->assignRole(Role::findOrCreate('SPV'));
        $this->grantExistingKvRetailApplication($spv, $creator);

        $retailUser = User::factory()->create(['name' => 'Assigned Retail']);
        $this->grantExistingKvRetailApplication($retailUser, $creator);

        $withoutAccess = User::factory()->create(['name' => 'No Application Access']);

        $this->actingAs($creator)
            ->getJson('/api/v1/kv-retail/assignees')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonFragment(['id' => $creator->id, 'name' => 'Task Manager'])
            ->assertJsonFragment(['id' => $spv->id, 'name' => 'Assigned SPV'])
            ->assertJsonFragment(['id' => $retailUser->id, 'name' => 'Assigned Retail'])
            ->assertJsonMissing(['id' => $root->id, 'name' => 'Platform Root'])
            ->assertJsonMissing(['id' => $withoutAccess->id, 'name' => 'No Application Access']);
    }

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

    public function test_task_is_late_after_its_deadline_when_email_is_sent_late_or_still_missing(): void
    {
        Carbon::setTestNow('2026-07-11 12:00:00');

        $creator = User::factory()->create();
        $creator->assignRole(Role::findOrCreate('Manajer'));
        $this->grantKvRetail($creator);

        $onTimeTask = KvRetailTask::create([
            'task_given_date' => '2026-07-01',
            'task_name' => 'On time task',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-10',
            'status' => 'Done',
            'task_timestamps' => ['Email' => '10/07/2026 23:59'],
            'created_by' => $creator->id,
        ]);
        $lateTask = KvRetailTask::create([
            'task_given_date' => '2026-07-01',
            'task_name' => 'Late task',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-10',
            'status' => 'Done',
            'task_timestamps' => ['Email' => '11/07/2026 00:01'],
            'created_by' => $creator->id,
        ]);
        $overdueUnsentTask = KvRetailTask::create([
            'task_given_date' => '2026-07-01',
            'task_name' => 'Overdue task without email',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-10',
            'status' => 'Kirim Email',
            'created_by' => $creator->id,
        ]);

        $response = $this->actingAs($creator)
            ->getJson('/api/v1/kv-retail/tasks')
            ->assertOk();

        $tasks = collect($response->json('data'))->keyBy('id');
        $this->assertFalse($tasks[$onTimeTask->id]['timing_evaluation']['late']);
        $this->assertTrue($tasks[$lateTask->id]['timing_evaluation']['late']);
        $this->assertTrue($tasks[$overdueUnsentTask->id]['timing_evaluation']['late']);
        $this->assertFalse($tasks[$lateTask->id]['timing_evaluation']['bottleneck']);

        Carbon::setTestNow();
    }

    public function test_task_creator_can_update_the_task_title(): void
    {
        $creator = User::factory()->create();
        $creator->assignRole(Role::findOrCreate('Manajer'));
        $this->grantKvRetail($creator);
        $task = KvRetailTask::create([
            'task_given_date' => '2026-07-01',
            'task_name' => 'Judul lama',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-10',
            'status' => '0',
            'created_by' => $creator->id,
        ]);

        $this->actingAs($creator)
            ->patchJson("/api/v1/kv-retail/tasks/{$task->id}/title", ['task_name' => 'Judul baru'])
            ->assertOk()
            ->assertJsonPath('data.task_name', 'Judul baru');

        $this->assertDatabaseHas('kv_retail_tasks', ['id' => $task->id, 'task_name' => 'Judul baru']);
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

    private function grantExistingKvRetailApplication(User $user, User $grantedBy): void
    {
        $application = Application::query()->where('key', 'kv-retail')->firstOrFail();

        $user->applications()->attach($application, ['granted_by' => $grantedBy->id]);
    }
}
