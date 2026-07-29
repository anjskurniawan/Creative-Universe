<?php

namespace Database\Seeders;

use App\Models\Core\AssetLink;
use App\Models\Core\Conversation;
use App\Models\Core\Message;
use App\Models\Core\User;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskBrief;
use App\SubApps\Odds\Models\TaskQueue;
use App\SubApps\Odds\Models\TaskResult;
use App\SubApps\Odds\Models\TaskReview;
use App\SubApps\Odds\Models\TaskTimeLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * QA fixture for the ODDS TaskCard.
 *
 * Creates three normal and three overdue/deadline tasks for each workflow
 * stage. Tasks are intentionally prefixed so the fixture can be re-run
 * without touching real ODDS work.
 */
class OddsTaskCardQaSeeder extends Seeder
{
    private const PREFIX = 'ODDS-CARD-QA-';

    /** @var array<string, string> */
    private const STAGES = [
        'brief' => 'submitted',
        'queue' => 'queued',
        'work' => 'in_progress',
        'spv-review' => 'spv_review',
        'client-review' => 'client_review',
        'done' => 'done',
    ];

    public function run(): void
    {
        $this->call(LocalTestAccountsSeeder::class);

        $client = User::query()->where('email', 'client@test.com')->firstOrFail();
        $designer = User::query()->where('email', 'designer@test.com')->firstOrFail();
        $spv = User::query()->where('email', 'spv@test.com')->firstOrFail();
        $category = Category::query()->where('is_active', true)->orderBy('id')->first();

        if (! $category) {
            $this->command->error('Kategori ODDS aktif tidak ditemukan. Jalankan OddsCategorySeeder terlebih dahulu.');

            return;
        }

        DB::transaction(function () use ($client, $designer, $spv, $category): void {
            $this->clearExistingFixture();

            foreach (self::STAGES as $stageKey => $status) {
                foreach (['normal', 'deadline'] as $condition) {
                    for ($sequence = 1; $sequence <= 3; $sequence++) {
                        $this->createTaskFixture(
                            status: $status,
                            stageKey: $stageKey,
                            condition: $condition,
                            sequence: $sequence,
                            client: $client,
                            designer: $designer,
                            spv: $spv,
                            category: $category,
                        );
                    }
                }
            }
        });

        $this->command->info('Seeded 36 ODDS TaskCard QA tasks: 6 siklus × 2 kondisi × 3 task.');
    }

    private function clearExistingFixture(): void
    {
        $taskIds = Task::withTrashed()
            ->where('task_number', 'like', self::PREFIX.'%')
            ->pluck('id');

        if ($taskIds->isEmpty()) {
            return;
        }

        $resultIds = TaskResult::withTrashed()->whereIn('task_id', $taskIds)->pluck('id');
        if ($resultIds->isNotEmpty()) {
            AssetLink::query()
                ->where('linkable_type', TaskResult::class)
                ->whereIn('linkable_id', $resultIds)
                ->forceDelete();
        }

        $conversationIds = Conversation::query()
            ->where('context_type', Conversation::CONTEXT_ODDS_TASK)
            ->whereIn('context_id', $taskIds)
            ->pluck('id');
        if ($conversationIds->isNotEmpty()) {
            Message::query()->whereIn('conversation_id', $conversationIds)->delete();
            DB::table('conversation_user')->whereIn('conversation_id', $conversationIds)->delete();
            Conversation::query()->whereIn('id', $conversationIds)->delete();
        }

        Task::withTrashed()->whereIn('id', $taskIds)->get()->each->forceDelete();
    }

    private function createTaskFixture(
        string $status,
        string $stageKey,
        string $condition,
        int $sequence,
        User $client,
        User $designer,
        User $spv,
        Category $category,
    ): void {
        $isDeadline = $condition === 'deadline';
        $createdAt = now()->subDays(2)->addMinutes($sequence * 11);
        $deadline = $isDeadline
            ? now()->subHours(6)->subMinutes($sequence * 7)
            : now()->addDays(2)->addMinutes($sequence * 10);
        $taskNumber = sprintf('%s%s-%s-%02d', self::PREFIX, strtoupper($condition), strtoupper($stageKey), $sequence);
        $title = sprintf('QA %s %s #%d', $isDeadline ? 'Deadline' : 'Normal', str($stageKey)->replace('-', ' ')->title(), $sequence);
        $finishedAt = in_array($status, ['spv_review', 'client_review', 'done'], true)
            ? $createdAt->copy()->addMinutes(45)
            : null;

        $task = Task::query()->create([
            'task_number' => $taskNumber,
            'request_type' => 'design',
            'category_id' => $category->id,
            'category_snapshot' => [
                'id' => $category->id,
                'name' => $category->name,
                'score_weight' => $category->score_weight,
                'normal_revision_limit' => $category->normal_revision_limit,
                'sla_minutes' => $category->sla_minutes,
                'important_matrix' => $category->important_matrix,
            ],
            'requester_id' => $client->id,
            'preferred_designer_id' => $designer->id,
            'assigned_designer_id' => $designer->id,
            'design_purpose' => $title,
            'brief_text' => "Fixture QA untuk kartu ODDS pada siklus {$stageKey}, kondisi {$condition}.",
            'deadline' => $deadline,
            'important_matrix' => $category->important_matrix ?? 'Q4',
            'status' => $status,
            'task_type' => 'new_task',
            'priority_score' => $isDeadline ? 99 : 10,
            'started_at' => $status === 'in_progress' ? $createdAt->copy()->addMinutes(10) : null,
            'finished_at' => $finishedAt,
            'approved_at' => $status === 'done' ? $finishedAt?->copy()->addMinutes(15) : null,
            'done_at' => $status === 'done' ? $finishedAt?->copy()->addMinutes(15) : null,
            'created_by' => $client->id,
            'updated_by' => $status === 'done' ? $client->id : $spv->id,
        ]);

        $task->forceFill(['created_at' => $createdAt, 'updated_at' => $finishedAt ?? $createdAt])->saveQuietly();

        TaskBrief::query()->create([
            'task_id' => $task->id,
            'content' => $task->brief_text,
            'updated_by' => $client->id,
        ]);

        if ($status !== 'submitted') {
            $queue = TaskQueue::query()->create([
                'task_id' => $task->id,
                'designer_id' => $designer->id,
                'queue_status' => match ($status) {
                    'queued' => 'queued',
                    'in_progress' => 'in_progress',
                    default => 'completed',
                },
                'task_type' => 'new_task',
                'priority_score' => $isDeadline ? 99 : 10,
                'scheduled_at' => $createdAt,
                'estimated_start_at' => $createdAt->copy()->addMinutes(10),
                'estimated_finish_at' => $deadline,
                'started_at' => $status === 'in_progress' ? $createdAt->copy()->addMinutes(10) : null,
                'completed_at' => $finishedAt,
            ]);
            $task->update(['current_queue_id' => $queue->id]);
        }

        if ($status === 'in_progress') {
            $this->createTimeLog($task, $designer, 'work', $createdAt->copy()->addMinutes(10));
        }

        if (in_array($status, ['spv_review', 'client_review', 'done'], true)) {
            $result = TaskResult::query()->create([
                'task_id' => $task->id,
                'version_number' => 1,
                'submitted_by' => $designer->id,
                'result_notes' => 'Output fixture untuk QA ODDS TaskCard.',
                'status' => match ($status) {
                    'spv_review' => 'pending_spv',
                    'client_review' => 'approved_by_spv',
                    default => 'approved_by_client',
                },
                'submitted_at' => $finishedAt,
            ]);

            AssetLink::query()->create([
                'linkable_type' => TaskResult::class,
                'linkable_id' => $result->id,
                'provider' => 'other',
                'label' => "Output QA {$taskNumber}.zip",
                'url' => "\\\\designer-test\\ODDS QA\\{$taskNumber}\\output-v1.zip",
                'created_by' => $designer->id,
            ]);

            if ($status === 'spv_review') {
                $this->createTimeLog($task, $designer, 'spv_review', $finishedAt);
            }

            if (in_array($status, ['client_review', 'done'], true)) {
                TaskReview::query()->create([
                    'task_id' => $task->id,
                    'result_id' => $result->id,
                    'reviewer_id' => $spv->id,
                    'review_type' => 'spv',
                    'decision' => 'approve',
                    'notes' => 'Output fixture disetujui oleh SPV Test.',
                ]);
            }

            if ($status === 'client_review') {
                $this->createTimeLog($task, $designer, 'client_review', $finishedAt);
            }

            if ($status === 'done') {
                TaskReview::query()->create([
                    'task_id' => $task->id,
                    'result_id' => $result->id,
                    'reviewer_id' => $client->id,
                    'review_type' => 'client',
                    'decision' => 'approve',
                    'notes' => 'Output fixture disetujui oleh Client Test.',
                    'rating' => 5,
                ]);
            }
        }

        $conversation = Conversation::query()->create([
            'context_type' => Conversation::CONTEXT_ODDS_TASK,
            'context_id' => $task->id,
            'status' => Conversation::STATUS_OPEN,
        ]);
        $conversation->users()->sync([$client->id, $designer->id, $spv->id]);
        Message::query()->create([
            'conversation_id' => $conversation->id,
            'sender_id' => $client->id,
            'body' => "Pesan QA untuk {$title}.",
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);
    }

    private function createTimeLog(Task $task, User $designer, string $logType, Carbon $startedAt): void
    {
        TaskTimeLog::query()->create([
            'task_id' => $task->id,
            'designer_id' => $designer->id,
            'log_type' => $logType,
            'started_at' => $startedAt,
            'duration_seconds' => 0,
        ]);
    }
}
