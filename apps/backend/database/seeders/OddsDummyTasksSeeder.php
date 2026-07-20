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
        // Clear all previous dummy tasks
        Task::where('task_number', 'like', 'ODDS-DUMMY-%')->forceDelete();

        // Find users
        $client = User::where('email', 'client@test.com')->first();
        $designer = User::where('email', 'designer@test.com')->first();

        if (!$client || !$designer) {
            $this->command->error('Client Test or Designer Test user not found. Please run LocalTestAccountsSeeder first.');
            return;
        }

        // Find or create categories with various score weights
        $categories = [
            'story' => Category::firstOrCreate(['name' => 'Instagram Story'], ['score_weight' => 1.0, 'normal_revision_limit' => 2, 'sla_minutes' => 1, 'is_active' => true]),
            'feed' => Category::firstOrCreate(['name' => 'Social Media Feed'], ['score_weight' => 1.5, 'normal_revision_limit' => 2, 'sla_minutes' => 2, 'is_active' => true]),
            'banner' => Category::firstOrCreate(['name' => 'Marketplace Banner'], ['score_weight' => 2.0, 'normal_revision_limit' => 2, 'sla_minutes' => 3, 'is_active' => true]),
            'hero' => Category::firstOrCreate(['name' => 'Website Hero Banner'], ['score_weight' => 2.5, 'normal_revision_limit' => 2, 'sla_minutes' => 4, 'is_active' => true]),
            'kv' => Category::firstOrCreate(['name' => 'Product Launch Key Visual'], ['score_weight' => 3.0, 'normal_revision_limit' => 3, 'sla_minutes' => 5, 'is_active' => true]),
        ];

        $taskCounter = 1;

        // Helper function to create tasks
        $createTask = function ($purpose, $status, $deadline, $categoryKey, $updatedAt = null, $importantMatrix = 'normal') use ($client, $designer, $categories, &$taskCounter) {
            $category = $categories[$categoryKey];
            $taskNumber = 'ODDS-DUMMY-' . str_pad($taskCounter++, 4, '0', STR_PAD_LEFT);
            
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
                ],
                'requester_id' => $client->id,
                'assigned_designer_id' => $designer->id,
                'design_purpose' => $purpose,
                'brief_text' => 'Brief content for ' . $purpose,
                'deadline' => $deadline,
                'status' => $status,
                'done_at' => $status === 'done' ? ($updatedAt ?? now()) : null,
                'important_matrix' => $importantMatrix,
                'task_type' => 'new_task',
                'priority_score' => 1.0,
            ]);

            if ($updatedAt) {
                DB::table('odds_tasks')->where('id', $task->id)->update([
                    'updated_at' => $updatedAt,
                    'created_at' => $updatedAt,
                ]);
            }

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


        // 5. OVERDUE TASKS (3 tasks, status = 'in_progress', deadline in the past)
        $createTask('Design Banner Promo Gajian (Overdue)', 'in_progress', now()->subDays(2), 'banner');
        $createTask('KV Campaign Special Launch (Overdue)', 'in_progress', now()->subDays(3), 'kv', null, 'urgent');
        $createTask('Revisi Story Instagram Brand A (Overdue)', 'in_progress', now()->subDays(1), 'story');


        // 6. REGULAR ACTIVE TASKS (5 tasks, status = 'in_progress', deadline in the future)
        for ($i = 1; $i <= 5; $i++) {
            $createTask("Active Task In Progress #{$i}", 'in_progress', now()->addDays(2), 'feed');
        }

        $this->command->info('Seeded extensive dummy ODDS tasks successfully to fully populate dashboard cards.');
    }
}
