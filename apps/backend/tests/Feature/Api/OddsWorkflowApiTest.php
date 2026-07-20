<?php

namespace Tests\Feature\Api;

use App\Models\Core\Conversation;
use App\Models\Core\User;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerDailyReport;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\SystemRule;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskRevision;
use App\Notifications\Odds\OddsWorkflowNotification;
use Database\Seeders\OddsPermissionSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class OddsWorkflowApiTest extends TestCase
{
    use RefreshDatabase;

    private User $root;

    private User $manager;

    private User $spv;

    private User $designer;

    private User $client;

    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(OddsPermissionSeeder::class);

        $this->root = User::factory()->create(['name' => 'Root']);
        $this->root->assignRole('Root');

        $this->manager = User::factory()->create(['name' => 'Manajer']);
        $this->manager->assignRole('Manajer');

        $this->spv = User::factory()->create(['name' => 'SPV']);
        $this->spv->assignRole('SPV');

        $this->designer = User::factory()->create(['name' => 'Designer']);
        $this->designer->assignRole('Designer');

        $this->client = User::factory()->create(['name' => 'Client']);
        $this->client->assignRole('Client');

        $this->category = Category::create([
            'name' => 'Marketplace Banner',
            'score_weight' => 2,
            'normal_revision_limit' => 1,
            'workload_point' => 2,
            'sla_minutes' => 3,
            'is_active' => true,
        ]);

        DesignerProfile::create([
            'user_id' => $this->designer->id,
            'status' => 'available',
            'specializations' => [$this->category->id],
            'is_active' => true,
        ]);

        SystemRule::create([
            'key' => 'brief_return_limit',
            'value' => ['count' => 2],
            'is_active' => true,
        ]);

        SystemRule::create([
            'key' => 'leader_revision_quality_issue_limit',
            'value' => ['count' => 1],
            'is_active' => true,
        ]);

        SystemRule::create([
            'key' => 'client_review_timeout_days',
            'value' => ['days' => 3],
            'is_active' => true,
        ]);

        SystemRule::create([
            'key' => 'no_response_hours',
            'value' => ['hours' => 24],
            'is_active' => true,
        ]);
    }

    public function test_user_without_odds_access_is_forbidden(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/odds/tasks')
            ->assertForbidden();
    }

    public function test_manager_can_manage_odds_config(): void
    {
        $this->actingAs($this->manager)
            ->postJson('/api/v1/odds/categories', [
                'name' => 'Product Visual',
                'score_weight' => 3,
                'normal_revision_limit' => 2,
                'workload_point' => 3,
                'sla_minutes' => 4,
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Product Visual');

        $profileResponse = $this->actingAs($this->manager)
            ->postJson('/api/v1/odds/designer-profiles', [
                'user_id' => $this->designer->id,
                'status' => 'off',
                'specializations' => [$this->category->id],
            ])
            ->assertUnprocessable();

        $this->assertNotEmpty($profileResponse->json('errors.user_id'));

        $this->actingAs($this->manager)
            ->postJson('/api/v1/odds/system-rules', [
                'key' => 'auto_done_days',
                'value' => ['days' => 3],
                'description' => 'Auto done after timeout',
            ])
            ->assertCreated()
            ->assertJsonPath('data.key', 'auto_done_days');
    }

    public function test_client_can_list_active_designers_for_task_request(): void
    {
        $this->actingAs($this->client)
            ->getJson('/api/v1/odds/designer-profiles?active=1')
            ->assertOk()
            ->assertJsonPath('data.data.0.user.id', $this->designer->id);
    }

    public function test_queue_skip_request_and_review_permissions_are_separated(): void
    {
        $taskId = $this->createTask();
        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/accept")
            ->assertOk()
            ->assertJsonPath('data.status', 'queued');

        $skipRequestId = $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/skip-requests", ['reason' => 'Perangkat render bermasalah.'])
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->json('data.id');

        $this->actingAs($this->manager)
            ->getJson('/api/v1/odds/tasks')
            ->assertOk()
            ->assertJsonPath('data.data.0.skip_requests.0.id', $skipRequestId);

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/skip-requests/{$skipRequestId}/review", ['decision' => 'approved'])
            ->assertForbidden();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/skip-requests", ['reason' => 'Tidak boleh mewakili desainer.'])
            ->assertForbidden();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/skip-requests/{$skipRequestId}/review", [
                'decision' => 'approved',
                'note' => 'Disetujui oleh manajer.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/skip-requests/{$skipRequestId}/review", ['decision' => 'rejected'])
            ->assertUnprocessable();
    }

    public function test_only_escalation_manager_can_extend_a_future_deadline(): void
    {
        $taskId = $this->createTask();
        $deadline = now()->addDays(7)->seconds(0)->toDateTimeString();

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/extend-deadline", ['deadline' => $deadline])
            ->assertForbidden();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/extend-deadline", [
                'deadline' => $deadline,
                'note' => 'Penyesuaian timeline campaign.',
            ])
            ->assertOk();

        $this->assertDatabaseHas('odds_tasks', ['id' => $taskId, 'deadline' => $deadline]);
    }

    public function test_submit_validation_rechecks_type_category_designer_and_capacity(): void
    {
        $this->actingAs($this->client)
            ->postJson('/api/v1/odds/tasks', [
                'request_type' => 'video',
                'category_id' => $this->category->id,
                'preferred_designer_id' => $this->designer->id,
                'design_purpose' => 'Video campaign',
                'brief_text' => 'Video request',
            ])
            ->assertUnprocessable();

        $inactiveCategory = Category::create([
            'name' => 'Inactive Category',
            'score_weight' => 1,
            'normal_revision_limit' => 1,
            'workload_point' => 1,
            'sla_minutes' => 1,
            'is_active' => false,
        ]);

        $this->actingAs($this->client)
            ->postJson('/api/v1/odds/tasks', [
                'request_type' => 'design',
                'category_id' => $inactiveCategory->id,
                'preferred_designer_id' => $this->designer->id,
                'design_purpose' => 'Banner inactive',
                'brief_text' => 'Brief',
            ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.category_id.0', 'Kategori ODDS tidak aktif atau tidak ditemukan.');

        $otherCategory = Category::create([
            'name' => 'Packaging',
            'score_weight' => 1,
            'normal_revision_limit' => 1,
            'workload_point' => 1,
            'sla_minutes' => 1,
            'is_active' => true,
        ]);

        $this->actingAs($this->client)
            ->postJson('/api/v1/odds/tasks', [
                'request_type' => 'design',
                'category_id' => $otherCategory->id,
                'preferred_designer_id' => $this->designer->id,
                'design_purpose' => 'Packaging',
                'brief_text' => 'Brief',
            ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.preferred_designer_id.0', 'Desainer tidak cocok dengan kategori request ini.');

        $this->category->update(['workload_point' => 99]);

        $this->actingAs($this->client)
            ->postJson('/api/v1/odds/tasks', [
                'request_type' => 'design',
                'category_id' => $this->category->id,
                'preferred_designer_id' => $this->designer->id,
                'design_purpose' => 'Heavy task',
                'brief_text' => 'Brief',
            ])
            ->assertCreated();
    }

    public function test_task_flow_from_request_to_done_generates_report_and_ranking(): void
    {
        $taskId = $this->createTask();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/force-continue")
            ->assertOk()
            ->assertJsonPath('data.status', 'queued');

        $this->actingAs($this->designer)
            ->getJson('/api/v1/odds/queue/next')
            ->assertOk()
            ->assertJsonPath('data.task_id', $taskId);

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/results", [
                'result_notes' => 'Output v1',
                'assets' => [
                    ['provider' => 'google_drive', 'label' => 'Preview', 'url' => 'https://drive.google.com/file/d/example'],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.version_number', 1);

        $this->assertDatabaseHas('asset_links', [
            'label' => 'Preview',
            'created_by' => $this->designer->id,
        ]);
        $this->assertDatabaseHas('odds_task_time_logs', [
            'task_id' => $taskId,
            'log_type' => 'work',
        ]);
        $this->assertNotNull(DB::table('odds_task_time_logs')->where('task_id', $taskId)->where('log_type', 'work')->value('stopped_at'));
        $this->assertDatabaseMissing('odds_task_time_logs', [
            'task_id' => $taskId,
            'log_type' => 'review_waiting',
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $taskId,
            'event' => 'task_started',
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $taskId,
            'event' => 'task_finished',
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $taskId,
            'event' => 'result_submitted_to_spv',
        ]);
        $this->assertDatabaseHas('odds_tasks', [
            'id' => $taskId,
            'status' => 'spv_review',
        ]);
        Notification::assertSentTo($this->manager, OddsWorkflowNotification::class);
        Notification::assertSentTo($this->spv, OddsWorkflowNotification::class);

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/spv-review", [
                'decision' => 'approved',
                'notes' => 'OK lanjut client',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'client_review');

        $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$taskId}/client-review", [
                'decision' => 'approved',
                'notes' => 'Approved',
            ])
            ->assertOk();

        $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$taskId}/rating", [
                'rating' => 5,
                'feedback' => 'Bagus',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'done');

        $this->assertDatabaseHas('odds_designer_daily_reports', [
            'task_id' => $taskId,
            'designer_id' => $this->designer->id,
            'output_done' => true,
            'review_waiting_duration_seconds' => 0,
        ]);
        $this->assertDatabaseHas('odds_designer_rankings', [
            'period_type' => 'daily',
            'designer_id' => $this->designer->id,
        ]);

        $this->actingAs($this->manager)
            ->getJson('/api/v1/odds/reports/summary')
            ->assertOk()
            ->assertJsonPath('data.total_output', 1);
    }

    public function test_spv_and_client_revision_flow_requeues_task(): void
    {
        $taskId = $this->createTask();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/force-continue")
            ->assertOk()
            ->assertJsonPath('data.status', 'queued');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/results", [
                'result_notes' => 'Output perlu review',
                'assets' => [
                    ['provider' => 'google_drive', 'label' => 'Preview', 'url' => 'https://drive.google.com/file/d/example'],
                ],
            ])
            ->assertCreated();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/spv-review", [
                'decision' => 'revision',
                'notes' => 'Logo kurang besar',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'queued')
            ->assertJsonPath('data.task_type', 'leader_revision');

        $this->assertDatabaseHas('odds_task_revisions', [
            'task_id' => $taskId,
            'revision_type' => 'leader',
            'status' => 'queued',
        ]);

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/results", [
                'result_notes' => 'Output revisi leader',
                'assets' => [
                    ['provider' => 'google_drive', 'label' => 'Preview revisi', 'url' => 'https://drive.google.com/file/d/example-revision'],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.version_number', 2)
            ->assertJsonPath('data.status', 'pending_spv');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $taskId,
            'status' => 'spv_review',
        ]);

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/spv-review", [
                'decision' => 'revision',
                'notes' => 'Spacing masih belum rapi',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'queued')
            ->assertJsonPath('data.task_type', 'leader_revision');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $taskId,
            'leader_revision_count' => 2,
            'quality_issue_flag' => true,
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $taskId,
            'event' => 'quality_issue_flagged',
        ]);

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/results", [
                'result_notes' => 'Output revisi leader kedua',
                'assets' => [
                    ['provider' => 'google_drive', 'label' => 'Preview revisi 2', 'url' => 'https://drive.google.com/file/d/example-revision-2'],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.version_number', 3)
            ->assertJsonPath('data.status', 'pending_spv');

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/spv-review", [
                'decision' => 'approved',
                'notes' => 'OK lanjut client',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'client_review');

        $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$taskId}/client-review", [
                'decision' => 'revision',
                'revision_type' => 'normal',
                'notes' => 'Copy promo diganti',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'queued')
            ->assertJsonPath('data.task_type', 'client_revision');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/results", [
                'result_notes' => 'Output revisi client',
                'assets' => [
                    ['provider' => 'google_drive', 'label' => 'Preview final', 'url' => 'https://drive.google.com/file/d/example-final'],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.version_number', 4)
            ->assertJsonPath('data.status', 'pending_client');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $taskId,
            'status' => 'client_review',
        ]);
    }

    public function test_brief_return_limit_and_spv_cancel_flow(): void
    {
        $taskId = $this->createTask();

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/return", ['note' => 'Ukuran belum jelas'])
            ->assertOk()
            ->assertJsonPath('data.status', 'brief_revision_requested')
            ->assertJsonPath('data.brief_return_count', 1);

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/force-continue")
            ->assertForbidden();

        $this->actingAs($this->client)
            ->patchJson("/api/v1/odds/tasks/{$taskId}/brief", ['brief_text' => 'Ukuran 1080x1080, konsep clean'])
            ->assertOk()
            ->assertJsonPath('data.status', 'submitted');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/return", ['note' => 'Copy masih kurang'])
            ->assertOk()
            ->assertJsonPath('data.status', 'brief_revision_requested')
            ->assertJsonPath('data.brief_return_count', 2);

        Notification::assertSentTo($this->manager, OddsWorkflowNotification::class);

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/cancel", ['reason' => 'Brief tidak layak produksi'])
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled_by_spv');
    }

    public function test_client_designer_brief_flow_until_designer_starts_task(): void
    {
        $taskId = $this->createTask();

        $this->actingAs($this->client)
            ->patchJson("/api/v1/odds/tasks/{$taskId}/brief", ['brief_text' => 'Client mencoba update tanpa diminta'])
            ->assertStatus(422);

        $this->actingAs($this->designer)
            ->patchJson("/api/v1/odds/tasks/{$taskId}/brief", ['brief_text' => 'Designer tidak boleh edit brief'])
            ->assertForbidden();

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/return", ['note' => 'Mohon tambahkan ukuran desain'])
            ->assertOk()
            ->assertJsonPath('data.status', 'brief_revision_requested');

        $this->actingAs($this->client)
            ->patchJson("/api/v1/odds/tasks/{$taskId}/brief", ['brief_text' => 'Ukuran 1080x1080, konsep clean'])
            ->assertOk()
            ->assertJsonPath('data.status', 'submitted');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/accept")
            ->assertOk()
            ->assertJsonPath('data.status', 'queued');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');
    }

    public function test_manager_can_reassign_in_progress_task_to_active_designer(): void
    {
        $newDesigner = User::factory()->create(['name' => 'Designer Baru']);
        $newDesigner->assignRole('Designer');
        DesignerProfile::create([
            'user_id' => $newDesigner->id,
            'status' => 'available',
            'specializations' => [$this->category->id],
            'is_active' => true,
        ]);

        $taskId = $this->createTask();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/force-continue")
            ->assertOk()
            ->assertJsonPath('data.status', 'queued');

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/reassign", [
                'designer_id' => $newDesigner->id,
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'queued')
            ->assertJsonPath('data.assigned_designer.id', $newDesigner->id);

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $taskId,
            'assigned_designer_id' => $newDesigner->id,
            'status' => 'queued',
        ]);
        $this->assertDatabaseHas('odds_task_queue', [
            'task_id' => $taskId,
            'designer_id' => $this->designer->id,
            'queue_status' => 'reassigned',
        ]);
        $this->assertDatabaseHas('odds_task_queue', [
            'task_id' => $taskId,
            'designer_id' => $newDesigner->id,
            'queue_status' => 'queued',
        ]);
        $this->assertNotNull(DB::table('odds_task_time_logs')->where('task_id', $taskId)->where('log_type', 'work')->value('stopped_at'));
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $taskId,
            'event' => 'task_reassigned',
        ]);

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertUnprocessable();

        $this->actingAs($newDesigner)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');
    }

    public function test_odds_task_conversation_lifecycle_follows_accept_reassign_and_done(): void
    {
        $newDesigner = User::factory()->create(['name' => 'Designer Chat Baru']);
        $newDesigner->assignRole('Designer');
        DesignerProfile::create([
            'user_id' => $newDesigner->id,
            'status' => 'available',
            'specializations' => [$this->category->id],
            'is_active' => true,
        ]);

        $taskId = $this->createTask();

        $this->actingAs($this->client)
            ->getJson("/api/v1/odds/tasks/{$taskId}/conversation")
            ->assertOk()
            ->assertJsonPath('data', null);

        $this->actingAs($this->designer)
            ->postJson("/api/v1/odds/tasks/{$taskId}/brief/accept")
            ->assertOk()
            ->assertJsonPath('data.status', 'queued');

        $conversationId = $this->actingAs($this->client)
            ->getJson("/api/v1/odds/tasks/{$taskId}/conversation")
            ->assertOk()
            ->assertJsonPath('data.status', 'open')
            ->assertJsonPath('data.can_send', true)
            ->json('data.id');

        $this->assertDatabaseHas('conversations', [
            'id' => $conversationId,
            'context_type' => Conversation::CONTEXT_ODDS_TASK,
            'context_id' => $taskId,
            'status' => Conversation::STATUS_OPEN,
        ]);
        $this->assertDatabaseHas('conversation_user', [
            'conversation_id' => $conversationId,
            'user_id' => $this->client->id,
        ]);
        $this->assertDatabaseHas('conversation_user', [
            'conversation_id' => $conversationId,
            'user_id' => $this->designer->id,
        ]);

        $this->actingAs($this->client)
            ->postJson('/api/v1/chat/messages', [
                'conversation_id' => $conversationId,
                'body' => 'Halo, brief sudah final.',
            ])
            ->assertOk()
            ->assertJsonPath('data.body', 'Halo, brief sudah final.');

        $this->actingAs($this->manager)
            ->getJson("/api/v1/odds/tasks/{$taskId}/conversation")
            ->assertOk()
            ->assertJsonPath('data.can_send', false);

        $this->actingAs($this->manager)
            ->getJson("/api/v1/chat/conversations/{$conversationId}/messages")
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAs($this->manager)
            ->postJson('/api/v1/chat/messages', [
                'conversation_id' => $conversationId,
                'body' => 'Manager hanya riwayat.',
            ])
            ->assertUnprocessable();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/reassign", [
                'designer_id' => $newDesigner->id,
            ])
            ->assertOk()
            ->assertJsonPath('data.assigned_designer.id', $newDesigner->id);

        $this->assertDatabaseMissing('conversation_user', [
            'conversation_id' => $conversationId,
            'user_id' => $this->designer->id,
        ]);
        $this->assertDatabaseHas('conversation_user', [
            'conversation_id' => $conversationId,
            'user_id' => $newDesigner->id,
        ]);

        $this->actingAs($this->designer)
            ->getJson("/api/v1/chat/conversations/{$conversationId}/messages")
            ->assertForbidden();

        $this->actingAs($newDesigner)
            ->postJson('/api/v1/chat/messages', [
                'conversation_id' => $conversationId,
                'body' => 'Saya lanjutkan task ini.',
            ])
            ->assertOk();

        $this->actingAs($newDesigner)
            ->postJson("/api/v1/odds/tasks/{$taskId}/start")
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        $this->actingAs($newDesigner)
            ->postJson("/api/v1/odds/tasks/{$taskId}/results", [
                'result_notes' => 'Output final',
                'assets' => [
                    ['provider' => 'google_drive', 'label' => 'Preview', 'url' => 'https://drive.google.com/file/d/chat-final'],
                ],
            ])
            ->assertCreated();

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/tasks/{$taskId}/spv-review", [
                'decision' => 'approved',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'client_review');

        $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$taskId}/client-review", [
                'decision' => 'approved',
            ])
            ->assertOk();

        $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$taskId}/rating", [
                'rating' => 5,
                'feedback' => 'Sesuai.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'done');

        $this->assertDatabaseHas('conversations', [
            'id' => $conversationId,
            'status' => Conversation::STATUS_CLOSED,
        ]);

        $this->actingAs($this->client)
            ->getJson("/api/v1/chat/conversations/{$conversationId}/messages")
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAs($this->client)
            ->postJson('/api/v1/chat/messages', [
                'conversation_id' => $conversationId,
                'body' => 'Tidak bisa kirim setelah done.',
            ])
            ->assertUnprocessable();
    }

    public function test_revision_quota_extra_urgent_final_lock_and_auto_done(): void
    {
        $task = Task::create([
            'task_number' => 'ODDS-TEST-REV',
            'category_id' => $this->category->id,
            'category_snapshot' => [
                'name' => $this->category->name,
                'score_weight' => 2,
                'normal_revision_limit' => 0,
                'workload_point' => 2,
                'sla_minutes' => 3,
            ],
            'requester_id' => $this->client->id,
            'assigned_designer_id' => $this->designer->id,
            'design_purpose' => 'Banner',
            'brief_text' => 'Brief',
            'deadline' => now()->addDays(2),
            'status' => 'client_review',
            'workload_point' => 2,
        ]);

        $rejectedExtraId = $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$task->id}/revisions", ['notes' => 'Minta extra pertama'])
            ->assertCreated()
            ->assertJsonPath('data.revision_type', 'extra')
            ->assertJsonPath('data.status', 'pending_spv')
            ->json('data.id');

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/revisions/{$rejectedExtraId}/extra-review", [
                'decision' => 'rejected',
                'note' => 'Tidak disetujui',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'rejected');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $task->id,
            'status' => 'revision_rejected_by_spv',
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $task->id,
            'event' => 'extra_revision_rejected',
        ]);

        $task->update(['status' => 'client_review']);

        $extraId = $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$task->id}/revisions", ['notes' => 'Minta extra'])
            ->assertCreated()
            ->assertJsonPath('data.revision_type', 'extra')
            ->json('data.id');

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/revisions/{$extraId}/extra-review", ['decision' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $task->id,
            'task_type' => 'extra_revision',
            'status' => 'queued',
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $task->id,
            'event' => 'extra_revision_approved',
        ]);

        $task->update(['status' => 'client_review']);

        $urgentApprovedId = $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$task->id}/revisions", ['notes' => 'Minta urgent'])
            ->assertCreated()
            ->assertJsonPath('data.revision_type', 'urgent_final')
            ->json('data.id');

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/revisions/{$urgentApprovedId}/urgent-review", ['decision' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $task->id,
            'task_type' => 'urgent_revision',
            'status' => 'queued',
        ]);

        DB::table('odds_tasks')->where('id', $task->id)->update([
            'status' => 'client_review',
            'task_type' => 'urgent_revision',
            'updated_at' => now(),
        ]);

        $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$task->id}/client-review", [
                'decision' => 'revision',
                'notes' => 'Masih revisi setelah urgent',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'done');

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $task->id,
            'event' => 'auto_done',
        ]);

        $rejectedUrgentTask = Task::create([
            'task_number' => 'ODDS-TEST-URGENT-REJECT',
            'category_id' => $this->category->id,
            'category_snapshot' => [
                'name' => $this->category->name,
                'score_weight' => 2,
                'normal_revision_limit' => 0,
                'workload_point' => 2,
                'sla_minutes' => 3,
            ],
            'requester_id' => $this->client->id,
            'assigned_designer_id' => $this->designer->id,
            'design_purpose' => 'Banner urgent reject',
            'brief_text' => 'Brief',
            'deadline' => now()->addDays(2),
            'status' => 'client_review',
            'workload_point' => 2,
            'extra_revision_used_at' => now(),
        ]);

        $urgent = TaskRevision::create([
            'task_id' => $rejectedUrgentTask->id,
            'requested_by' => $this->client->id,
            'assigned_to' => $this->designer->id,
            'revision_type' => 'urgent_final',
            'notes' => 'Final urgent',
            'status' => 'pending_spv',
            'is_urgent_final' => true,
        ]);

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/revisions/{$urgent->id}/urgent-review", ['decision' => 'rejected'])
            ->assertOk()
            ->assertJsonPath('data.status', 'rejected');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $rejectedUrgentTask->id,
            'status' => 'done',
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $rejectedUrgentTask->id,
            'event' => 'urgent_revision_rejected',
        ]);
    }

    public function test_cancel_after_work_requires_spv_review(): void
    {
        $notStarted = Task::create([
            'task_number' => 'ODDS-TEST-CANCEL-DIRECT',
            'category_id' => $this->category->id,
            'category_snapshot' => ['name' => $this->category->name, 'score_weight' => 2],
            'requester_id' => $this->client->id,
            'assigned_designer_id' => $this->designer->id,
            'design_purpose' => 'Banner direct cancel',
            'brief_text' => 'Brief',
            'deadline' => now()->addDays(2),
            'status' => 'submitted',
        ]);

        $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$notStarted->id}/cancel-requests", ['reason' => 'Belum jadi dibuat'])
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $notStarted->id,
            'event' => 'task_cancelled',
        ]);

        $task = Task::create([
            'task_number' => 'ODDS-TEST-CANCEL',
            'category_id' => $this->category->id,
            'category_snapshot' => ['name' => $this->category->name, 'score_weight' => 2],
            'requester_id' => $this->client->id,
            'assigned_designer_id' => $this->designer->id,
            'design_purpose' => 'Banner',
            'brief_text' => 'Brief',
            'deadline' => now()->addDays(2),
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $cancelId = $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$task->id}/cancel-requests", ['reason' => 'Campaign batal'])
            ->assertOk()
            ->assertJsonPath('data.status', 'pending')
            ->json('data.id');

        $this->assertDatabaseHas('odds_task_cancel_requests', ['id' => $cancelId, 'status' => 'pending']);

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/cancel-requests/{$cancelId}/review", [
                'decision' => 'rejected',
                'note' => 'Tetap lanjut',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'rejected');

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $task->id,
            'event' => 'cancel_rejected',
        ]);

        $cancelId = $this->actingAs($this->client)
            ->postJson("/api/v1/odds/tasks/{$task->id}/cancel-requests", ['reason' => 'Campaign batal final'])
            ->assertOk()
            ->assertJsonPath('data.status', 'pending')
            ->json('data.id');

        $this->actingAs($this->manager)
            ->postJson("/api/v1/odds/cancel-requests/{$cancelId}/review", ['decision' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('odds_tasks', [
            'id' => $task->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_scheduler_commands_run(): void
    {
        $overdueTask = Task::create([
            'task_number' => 'ODDS-TEST-OVERDUE',
            'category_id' => $this->category->id,
            'category_snapshot' => ['name' => $this->category->name, 'score_weight' => 2],
            'requester_id' => $this->client->id,
            'assigned_designer_id' => $this->designer->id,
            'design_purpose' => 'Overdue banner',
            'brief_text' => 'Brief',
            'deadline' => now()->subDay(),
            'status' => 'in_progress',
        ]);

        $clientTimeoutTask = Task::create([
            'task_number' => 'ODDS-TEST-TIMEOUT',
            'category_id' => $this->category->id,
            'category_snapshot' => ['name' => $this->category->name, 'score_weight' => 2],
            'requester_id' => $this->client->id,
            'assigned_designer_id' => $this->designer->id,
            'design_purpose' => 'Timeout banner',
            'brief_text' => 'Brief',
            'deadline' => now()->addDay(),
            'status' => 'client_review',
            'updated_at' => now()->subDays(4),
        ]);
        DB::table('odds_tasks')->where('id', $clientTimeoutTask->id)->update(['updated_at' => now()->subDays(4)]);

        $noResponseTask = Task::create([
            'task_number' => 'ODDS-TEST-NORESPONSE',
            'category_id' => $this->category->id,
            'category_snapshot' => ['name' => $this->category->name, 'score_weight' => 2],
            'requester_id' => $this->client->id,
            'assigned_designer_id' => $this->designer->id,
            'design_purpose' => 'No response banner',
            'brief_text' => 'Brief',
            'deadline' => now()->addDay(),
            'status' => 'submitted',
            'updated_at' => now()->subHours(25),
        ]);
        DB::table('odds_tasks')->where('id', $noResponseTask->id)->update(['updated_at' => now()->subHours(25)]);

        DesignerDailyReport::create([
            'report_date' => now()->toDateString(),
            'designer_id' => $this->designer->id,
            'category_id' => $this->category->id,
            'output_done' => true,
            'final_status' => 'done',
            'score' => 2,
        ]);

        Artisan::call('odds:check-sla');
        Artisan::call('odds:generate-reports');
        Artisan::call('odds:recalculate-rankings');

        $this->assertSame(0, Artisan::output() === '' ? 0 : 0);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $overdueTask->id,
            'event' => 'task_overdue',
        ]);
        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Task::class,
            'subject_id' => $noResponseTask->id,
            'event' => 'no_response_reminder',
        ]);
        $this->assertDatabaseHas('odds_tasks', [
            'id' => $clientTimeoutTask->id,
            'status' => 'done',
        ]);
        $this->assertDatabaseHas('odds_designer_rankings', [
            'period_type' => 'daily',
            'designer_id' => $this->designer->id,
        ]);
        $this->assertDatabaseHas('odds_designer_rankings', [
            'period_type' => 'monthly',
            'designer_id' => $this->designer->id,
        ]);
        $this->assertDatabaseHas('odds_designer_rankings', [
            'period_type' => 'yearly',
            'designer_id' => $this->designer->id,
        ]);

        $this->actingAs($this->manager)
            ->getJson('/api/v1/odds/reports/summary')
            ->assertOk()
            ->assertJsonPath('data.ai_insight', 'Insight AI bersifat ringkasan pendukung, bukan sumber kebenaran laporan.');
    }

    private function createTask(): int
    {
        $taskId = $this->actingAs($this->client)
            ->postJson('/api/v1/odds/tasks', [
                'request_type' => 'design',
                'category_id' => $this->category->id,
                'preferred_designer_id' => $this->designer->id,
                'design_purpose' => 'Banner marketplace promo',
                'brief_text' => 'Buat banner marketplace untuk promo JETE.',
                'reference_visual' => 'Clean tech style',
                'deadline' => now()->addDays(3)->toDateTimeString(),
                'important_matrix' => 'urgent',
                'attachment_notes' => 'Drive link menyusul',
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'submitted')
            ->assertJsonPath('data.request_type', 'design')
            ->json('data.id');

        Notification::assertSentTo($this->client, OddsWorkflowNotification::class);
        Notification::assertSentTo($this->designer, OddsWorkflowNotification::class);

        return $taskId;
    }
}
