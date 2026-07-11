<?php

namespace Tests\Feature\Api;

use App\Events\HomeworkTaskAssigned;
use App\Models\Core\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class HomeworkTaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_homework_task_broadcasts_assignment_to_selected_users(): void
    {
        Event::fake([HomeworkTaskAssigned::class]);

        $creator = User::factory()->create();
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
}
