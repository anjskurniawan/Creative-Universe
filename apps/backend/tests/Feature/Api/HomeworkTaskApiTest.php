<?php

namespace Tests\Feature\Api;

use App\Events\HomeworkTaskAssigned;
use App\Models\Core\User;
use App\Models\HomeworkTask;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class HomeworkTaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_homework_task_broadcasts_assignment_to_selected_users(): void
    {
        Event::fake([HomeworkTaskAssigned::class]);

        $creator = User::factory()->create();
        $creator->assignRole(Role::findOrCreate('Manajer'));
        $firstAssignee = User::factory()->create();
        $secondAssignee = User::factory()->create();

        $response = $this->actingAs($creator)->postJson('/api/v1/homework-tasks', [
            'task_given_date' => '2026-07-11',
            'task_name' => 'Realtime task assignment',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-12',
            'assigned_to' => [$firstAssignee->id, $secondAssignee->id],
        ]);

        $response->assertCreated();

        Event::assertDispatched(HomeworkTaskAssigned::class, function (HomeworkTaskAssigned $event) use ($firstAssignee, $secondAssignee) {
            return $event->task->task_name === 'Realtime task assignment'
                && $event->userIds === [$firstAssignee->id, $secondAssignee->id];
        });
    }

    public function test_late_stage_requires_a_reason_before_the_next_status(): void
    {
        $creator = User::factory()->create();
        $creator->assignRole(Role::findOrCreate('Manajer'));
        $task = HomeworkTask::create([
            'task_given_date' => '2026-07-01',
            'task_name' => 'Late ACC Draft task',
            'pic_vendor' => 'Mireco',
            'deadline_date' => '2026-07-10',
            'status' => 'ACC Draft',
            'task_timestamps' => ['ACC Draft' => '03/07/2026 10:00'],
            'created_by' => $creator->id,
        ]);

        $this->actingAs($creator)
            ->patchJson("/api/v1/homework-tasks/{$task->id}/status", [
                'status' => 'Progress Design',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('delay_reason');

        $this->actingAs($creator)
            ->patchJson("/api/v1/homework-tasks/{$task->id}/status", [
                'status' => 'Progress Design',
                'task_timestamps' => [
                    'ACC Draft' => '03/07/2026 10:00',
                    'Progress' => '03/07/2026 12:00',
                ],
                'delay_reason' => 'Menunggu revisi materi dari vendor.',
            ])
            ->assertOk()
            ->assertJsonPath('delay_reasons.ACC Draft.reason', 'Menunggu revisi materi dari vendor.')
            ->assertJsonPath('timing_evaluation.bottleneck', true);
    }
}
