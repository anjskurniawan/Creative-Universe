<?php

namespace Database\Seeders;

use App\Models\Core\User;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OddsDummyTasksSeeder extends Seeder
{
    public function run(): void
    {
        // Clear all previous dummy tasks, conversations, messages, and task reviews
        $dummyTaskIds = Task::where('task_number', 'like', 'ODDS-DUMMY-%')->pluck('id')->toArray();
        if (!empty($dummyTaskIds)) {
            \App\SubApps\Odds\Models\TaskReview::whereIn('task_id', $dummyTaskIds)->delete();
            $conversations = \App\Models\Core\Conversation::where('context_type', \App\Models\Core\Conversation::CONTEXT_ODDS_TASK)
                ->whereIn('context_id', $dummyTaskIds)
                ->get();
            foreach ($conversations as $convo) {
                $convo->messages()->delete();
                $convo->users()->detach();
                $convo->delete();
            }
            Task::whereIn('id', $dummyTaskIds)->forceDelete();
        }

        // Find users
        $client = User::where('email', 'client@test.com')->first();
        $designer = User::where('email', 'designer@test.com')->first();

        if (!$client || !$designer) {
            $this->command->error('Client Test or Designer Test user not found. Please run LocalTestAccountsSeeder first.');
            return;
        }

        // Ensure Designer Test has a profile with ALL specializations
        $allCategoryIds = \App\SubApps\Odds\Models\Category::pluck('id')->map(fn($id) => (string) $id)->toArray();
        $designerProfile = \App\SubApps\Odds\Models\DesignerProfile::firstOrCreate(
            ['user_id' => $designer->id],
            ['status' => 'available', 'is_active' => true]
        );
        $designerProfile->update(['specializations' => $allCategoryIds]);

        // Fetch 5 real categories from the database for dummy tasks
        $realCategories = \App\SubApps\Odds\Models\Category::where('is_active', true)->inRandomOrder()->take(5)->get();
        if ($realCategories->count() < 5) {
             $this->command->error('Not enough active categories found. Run OddsCategorySeeder first.');
             return;
        }

        $categories = [
            'story' => $realCategories[0],
            'feed' => $realCategories[1],
            'banner' => $realCategories[2],
            'hero' => $realCategories[3],
            'kv' => $realCategories[4],
        ];

        $taskCounter = 1;

        // Helper function to create tasks
        $createTask = function ($purpose, $status, $deadline, $categoryKey, $updatedAt = null, $importantMatrix = null) use ($client, $designer, $categories, &$taskCounter) {
            $category = $categories[$categoryKey];
            $taskNumber = 'ODDS-DUMMY-' . str_pad($taskCounter++, 4, '0', STR_PAD_LEFT);
            $matrixValue = $importantMatrix ?? $category->important_matrix ?? 'Q4';
            
            $task = Task::create([
                'task_number' => $taskNumber,
                'request_type' => 'design',
                'category_id' => $category->id,
                'category_snapshot' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'score_weight' => $category->score_weight,
                    'normal_revision_limit' => $category->normal_revision_limit,
                    'sla_minutes' => $category->sla_minutes,
                    'important_matrix' => $matrixValue,
                ],
                'requester_id' => $client->id,
                'assigned_designer_id' => $designer->id,
                'design_purpose' => $purpose,
                'brief_text' => 'Brief content for ' . $purpose,
                'deadline' => $deadline,
                'status' => $status,
                'done_at' => $status === 'done' ? ($updatedAt ?? now()) : null,
                'important_matrix' => $matrixValue,
                'task_type' => 'new_task',
                'priority_score' => 1.0,
            ]);

            if ($updatedAt) {
                DB::table('odds_tasks')->where('id', $task->id)->update([
                    'updated_at' => $updatedAt,
                    'created_at' => $updatedAt,
                ]);
            }

            if ($status === 'done') {
                \App\SubApps\Odds\Models\TaskReview::create([
                    'task_id' => $task->id,
                    'reviewer_id' => $client->id,
                    'review_type' => 'client',
                    'decision' => 'approve',
                    'notes' => 'Kerja bagus!',
                    'rating' => rand(4, 5),
                ]);
            }

            // Create Conversation and Dummy Messages
            $conversation = \App\Models\Core\Conversation::create([
                'context_type' => \App\Models\Core\Conversation::CONTEXT_ODDS_TASK,
                'context_id' => $task->id,
                'status' => \App\Models\Core\Conversation::STATUS_OPEN,
            ]);
            $conversation->users()->sync([$client->id, $designer->id]);

            \App\Models\Core\Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $client->id,
                'body' => "Halo designer, berikut brief lengkap untuk task '{$purpose}'. Mohon segera diproses ya.",
            ]);

            \App\Models\Core\Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $designer->id,
                'body' => "Halo client, sudah saya terima. Saya akan proses secepatnya mengikuti antrean.",
            ]);

            return $task;
        };

        // 1. DONE TASKS (for each day of the past 6 days to populate the performance chart)
        // 5 days ago: 1 task (score = 150)
        $createTask('Campaign Launch Banner A', 'done', now()->subDays(5)->addHours(4), 'feed', now()->subDays(5));

        // 4 days ago: 2 tasks (score = 250 + 100 = 350)
        $createTask('Website Hero Header Brand X', 'done', now()->subDays(4)->addHours(5), 'hero', now()->subDays(4));
        $createTask('Instagram Story Promo Brand Y', 'done', now()->subDays(4)->addHours(2), 'story', now()->subDays(4));

        // 3 days ago: 1 task (score = 300)
        $createTask('Key Visual Campaign Brand Z', 'done', now()->subDays(3)->addHours(6), 'kv', now()->subDays(3));

        // 2 days ago: 3 tasks (score = 200 + 150 + 100 = 450)
        $createTask('Marketplace Promo Page', 'done', now()->subDays(2)->addHours(3), 'banner', now()->subDays(2));
        $createTask('Feed Instagram Special Event', 'done', now()->subDays(2)->addHours(4), 'feed', now()->subDays(2));
        $createTask('Story Instagram Flash Sale', 'done', now()->subDays(2)->addHours(1), 'story', now()->subDays(2));

        // 1 day ago (yesterday): 2 tasks (score = 250 + 200 = 450)
        $createTask('Hero Slider Desktop Brand A', 'done', now()->subDays(1)->addHours(4), 'hero', now()->subDays(1));
        $createTask('Shopee Banner Flash Sale', 'done', now()->subDays(1)->addHours(3), 'banner', now()->subDays(1));

        // Today: 1 task (score = 200)
        $createTask('Banner Tokopedia Gajian Brand B', 'done', now()->addHours(2), 'banner', now());


        // 2. QUEUED TASKS (10 tasks, so queue jobs has > 8 tasks)
        for ($i = 1; $i <= 10; $i++) {
            $createTask("Queued Task Design #{$i}", 'queued', now()->addDays(3 + $i), 'feed');
        }


        // 3. NEED REVIEW BRIEF TASKS (7 tasks, status = 'spv_review')
        for ($i = 1; $i <= 7; $i++) {
            $createTask("Review Brief Task #{$i}", 'spv_review', now()->addDays(2), 'banner');
        }


        // 4. REVISION QUEUE TASKS (3 tasks, status = 'revision')
        $createTask('Revisi Feed Instagram September Promo', 'revision', now()->addDays(1), 'feed');
        $createTask('Revisi Banner Tokopedia Flash Sale', 'revision', now()->addDays(2), 'banner');
        $createTask('Revisi Layout Catalog Cover Retail', 'revision', now()->addDays(1), 'hero');


        // 5. OVERDUE TASKS (1 in_progress task, other 2 as queued with past deadlines)
        $createTask('Design Banner Promo Gajian (Overdue)', 'queued', now()->subDays(2), 'banner');
        $createTask('KV Campaign Special Launch (Overdue)', 'in_progress', now()->subDays(3), 'kv', null, 'urgent');
        $createTask('Revisi Story Instagram Brand A (Overdue)', 'queued', now()->subDays(1), 'story');


        // 6. REGULAR ACTIVE TASKS (5 tasks, status = 'queued' to keep exactly 1 task in_progress per designer)
        for ($i = 1; $i <= 5; $i++) {
            $createTask("Active Task In Progress #{$i}", 'queued', now()->addDays(2), 'feed');
        }

        $this->command->info('Seeded extensive dummy ODDS tasks successfully to fully populate dashboard cards.');
    }
}
