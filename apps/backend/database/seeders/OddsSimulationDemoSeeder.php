<?php

namespace Database\Seeders;

use App\Models\Core\AssetLink;
use App\Models\Core\Conversation;
use App\Models\Core\Message;
use App\Models\Core\User;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerDailyReport;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\DesignerRanking;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskBrief;
use App\SubApps\Odds\Models\TaskQueue;
use App\SubApps\Odds\Models\TaskResult;
use App\SubApps\Odds\Models\TaskReview;
use App\SubApps\Odds\Models\TaskRevision;
use App\SubApps\Odds\Models\TaskTimeLog;
use App\SubApps\Odds\Services\OddsReportingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class OddsSimulationDemoSeeder extends Seeder
{
    /**
     * Seeds 50 realistic simulation tasks for ODDS between July 1 - July 22, 2026.
     */
    public function run(): void
    {
        // 1. Truncate / Clear all previous ODDS task data cleanly
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        TaskReview::truncate();
        TaskRevision::truncate();
        TaskResult::truncate();
        TaskTimeLog::truncate();
        TaskQueue::truncate();
        TaskBrief::truncate();
        DesignerDailyReport::truncate();
        DesignerRanking::truncate();

        // Delete ODDS conversations and messages
        $oddsConvoIds = Conversation::where('context_type', Conversation::CONTEXT_ODDS_TASK)->pluck('id')->toArray();
        if (!empty($oddsConvoIds)) {
            Message::whereIn('conversation_id', $oddsConvoIds)->delete();
            DB::table('conversation_user')->whereIn('conversation_id', $oddsConvoIds)->delete();
            Conversation::whereIn('id', $oddsConvoIds)->delete();
        }

        Task::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Ensure Client Test user exists
        $client = User::where('username', 'client')->orWhere('email', 'client@test.com')->first();
        if (!$client) {
            $client = User::create([
                'username' => 'client',
                'name' => 'Client Test',
                'email' => 'client@test.com',
                'password' => Hash::make('admin'),
                'is_onboarded' => true,
                'division_id' => 21,
            ]);
            $client->assignRole('Client');
        }

        // Ensure SPV & Manajer exist for reviews
        $spv = User::where('username', 'spv')->first() ?? User::whereHas('roles', fn($q) => $q->whereIn('name', ['SPV', 'Supervisor']))->first() ?? $client;

        // Ensure Categories exist
        $categories = Category::where('is_active', true)->get();
        if ($categories->isEmpty()) {
            $this->call(OddsCategorySeeder::class);
            $categories = Category::where('is_active', true)->get();
        }
        $categoryIds = $categories->pluck('id')->map(fn($id) => (string) $id)->toArray();

        // Ensure Designers & Randomize Category Connections
        $designerUsers = User::whereHas('roles', fn($q) => $q->whereIn('name', ['Designer', 'Videographer']))->get();
        if ($designerUsers->isEmpty()) {
            $this->call(LocalTestAccountsSeeder::class);
            $designerUsers = User::whereHas('roles', fn($q) => $q->whereIn('name', ['Designer', 'Videographer']))->get();
        }

        $designers = [];
        foreach ($designerUsers as $dUser) {
            $profile = DesignerProfile::withTrashed()->firstOrCreate(
                ['user_id' => $dUser->id],
                ['status' => 'available', 'is_active' => true]
            );
            if ($profile->trashed()) {
                $profile->restore();
            }

            // Connect designer to 8-20 random categories
            shuffle($categoryIds);
            $randomCatIds = array_slice($categoryIds, 0, rand(8, min(20, count($categoryIds))));
            $profile->update([
                'specializations' => array_values($randomCatIds),
                'status' => 'available',
                'is_active' => true,
            ]);
            $designers[] = $dUser;
        }

        if (empty($designers)) {
            $this->command->error('No designers found to assign tasks.');
            return;
        }

        // 3. Generate 50 realistic tasks distributed between July 1 and July 22, 2026
        $statuses = [
            'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', // 30 done tasks
            'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done',
            'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done',
            'spv_review', 'spv_review', 'spv_review', 'spv_review', 'spv_review', // 5 spv_review
            'client_review', 'client_review', 'client_review', 'client_review', 'client_review', // 5 client_review
            'in_progress', 'in_progress', 'in_progress', 'in_progress', // 4 in_progress
            'leader_revision_requested', 'leader_revision_requested', 'leader_revision_requested', // 3 leader_revision
            'queued', 'queued', 'queued' // 3 queued
        ];

        shuffle($statuses);

        $samplePurposes = [
            'Feeds Instagram Campaign Launching Produk Baru',
            'Key Visual Banner Web Desktop & Mobile',
            'Desain Packaging Box Produk Premium',
            'Instagram Story Flash Sale & Voucher Promo',
            'Katalog Event Pameran & Brochure',
            'Model & Rendering 3D Showcase Produk',
            'Branding Store Retail Banner Display',
            'Banner Tokopedia & Shopee Official Store',
            'Poster Event & Social Media Announcement',
            'Thumbnail Video Youtube & Content Assets',
            'Desain Slide Presentation Deck Corporate',
            'Infografis Edukasi Fitur Produk Terbaru',
            'Branding ID Card & Merchandise Event',
            'Design Flyer Promotional Special Deal',
            'Header Email Newsletter Launch Campaign',
        ];

        $taskCounter = 1;
        $doneTasksToReport = [];

        for ($i = 0; $i < 50; $i++) {
            $status = $statuses[$i];
            
            // Distribute date randomly from July 1 to July 22, 2026
            $dayOffset = rand(1, 22);
            $hourOffset = rand(8, 17);
            $minuteOffset = rand(0, 59);
            $createdDate = Carbon::create(2026, 7, $dayOffset, $hourOffset, $minuteOffset, 0);

            // If task is not done and status is active, push towards July 20-22
            if ($status !== 'done' && $dayOffset < 18) {
                $createdDate = Carbon::create(2026, 7, rand(18, 22), $hourOffset, $minuteOffset, 0);
            }

            $category = $categories->random();
            $designer = $designers[array_rand($designers)];
            $purpose = $samplePurposes[array_rand($samplePurposes)] . ' #' . $taskCounter;
            $importantMatrix = $category->important_matrix ?? ['Q1', 'Q2', 'Q3', 'Q4'][rand(0, 3)];
            $taskNumber = 'ODDS-SIM-' . str_pad($taskCounter++, 4, '0', STR_PAD_LEFT);
            $deadline = (clone $createdDate)->addMinutes($category->sla_minutes ?? 120);

            $doneAt = $status === 'done' ? (clone $createdDate)->addMinutes(rand(15, max(30, $category->sla_minutes))) : null;

            $task = Task::create([
                'task_number' => $taskNumber,
                'request_type' => rand(0, 4) === 0 ? 'video' : 'design',
                'category_id' => $category->id,
                'category_snapshot' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'score_weight' => $category->score_weight,
                    'normal_revision_limit' => $category->normal_revision_limit,
                    'sla_minutes' => $category->sla_minutes,
                    'important_matrix' => $importantMatrix,
                ],
                'requester_id' => $client->id,
                'assigned_designer_id' => $designer->id,
                'design_purpose' => $purpose,
                'brief_text' => "Brief detail untuk {$purpose}.\nHarap gunakan warna brand standar dan sertakan file resolusi tinggi.",
                'deadline' => $deadline,
                'status' => $status,
                'done_at' => $doneAt,
                'important_matrix' => $importantMatrix,
                'task_type' => 'new_task',
                'priority_score' => (float) rand(1, 5),
            ]);

            // Set creation date
            DB::table('odds_tasks')->where('id', $task->id)->update([
                'created_at' => $createdDate,
                'updated_at' => $doneAt ?? $createdDate,
            ]);

            // Add Brief record
            TaskBrief::create([
                'task_id' => $task->id,
                'content' => $task->brief_text,
                'updated_by' => $client->id,
            ]);

            // Add Queue record
            TaskQueue::create([
                'task_id' => $task->id,
                'designer_id' => $designer->id,
                'queue_status' => $status === 'done' ? 'completed' : ($status === 'in_progress' ? 'in_progress' : 'ready_to_start'),
                'scheduled_at' => $createdDate,
                'estimated_start_at' => $createdDate,
                'estimated_finish_at' => $deadline,
                'completed_at' => $doneAt,
            ]);

            // Add Time Log
            $workDuration = rand(900, 3600); // 15-60 mins
            TaskTimeLog::create([
                'task_id' => $task->id,
                'designer_id' => $designer->id,
                'log_type' => 'work',
                'started_at' => $createdDate,
                'stopped_at' => (clone $createdDate)->addSeconds($workDuration),
                'duration_seconds' => $workDuration,
            ]);

            // Add Result & Review if submitted or done
            if (in_array($status, ['spv_review', 'client_review', 'done', 'leader_revision_requested'], true)) {
                $outputCount = rand(1, 3);
                $result = TaskResult::create([
                    'task_id' => $task->id,
                    'submitted_by' => $designer->id,
                    'version_number' => 1,
                    'result_notes' => "Hasil desain v1 selesai.\nTotal Output: {$outputCount}",
                    'submitted_at' => $doneAt ?? $createdDate,
                    'status' => $status === 'done' ? 'approved_by_client' : ($status === 'client_review' ? 'approved_by_spv' : 'submitted'),
                ]);

                // Create local asset links for file output
                AssetLink::create([
                    'linkable_type' => TaskResult::class,
                    'linkable_id' => $result->id,
                    'provider' => 'other',
                    'label' => "File Preview Local ({$task->task_number}.jpg)",
                    'url' => "http://creativeuniverse.test/storage/odds/outputs/preview-{$task->id}.jpg",
                    'created_by' => $designer->id,
                ]);

                AssetLink::create([
                    'linkable_type' => TaskResult::class,
                    'linkable_id' => $result->id,
                    'provider' => 'other',
                    'label' => "File Master Local ({$task->task_number}.zip)",
                    'url' => "http://creativeuniverse.test/storage/odds/outputs/master-{$task->id}.zip",
                    'created_by' => $designer->id,
                ]);

                if ($status === 'done') {
                    TaskReview::create([
                        'task_id' => $task->id,
                        'result_id' => $result->id,
                        'reviewer_id' => $client->id,
                        'review_type' => 'client',
                        'decision' => 'approved',
                        'notes' => 'Desain sesuai dengan brief, mantap!',
                        'rating' => rand(4, 5),
                    ]);
                    $doneTasksToReport[] = $task;
                } elseif ($status === 'leader_revision_requested') {
                    TaskReview::create([
                        'task_id' => $task->id,
                        'result_id' => $result->id,
                        'reviewer_id' => $spv->id,
                        'review_type' => 'spv',
                        'decision' => 'revision_requested',
                        'notes' => 'Mohon sesuaikan kontras warna dan tata letak logo.',
                    ]);
                    TaskRevision::create([
                        'task_id' => $task->id,
                        'result_id' => $result->id,
                        'requested_by' => $spv->id,
                        'revision_type' => 'leader',
                        'notes' => 'Mohon sesuaikan kontras warna dan tata letak logo.',
                    ]);
                }
            }

            // Create Conversation & Initial Messages
            $conversation = Conversation::create([
                'context_type' => Conversation::CONTEXT_ODDS_TASK,
                'context_id' => $task->id,
                'status' => Conversation::STATUS_OPEN,
            ]);
            $conversation->users()->sync([$client->id, $designer->id]);

            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $client->id,
                'body' => "Halo @{$designer->username}, mohon diproses untuk tugas {$purpose} ya. Terima kasih!",
                'created_at' => $createdDate,
            ]);

            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $designer->id,
                'body' => "Baik, Siap! Brief sudah saya terima dan langsung dikerjakan.",
                'created_at' => (clone $createdDate)->addMinutes(5),
            ]);
        }

        // 4. Fill Daily Reports & Recalculate Rankings
        $reportingService = app(OddsReportingService::class);
        foreach ($doneTasksToReport as $doneTask) {
            $reportingService->fillDailyReport($doneTask);
        }
        $reportingService->recalculateRankings();

        $this->command->info("Successfully seeded 50 simulation tasks for Client Test between July 1 - July 22, 2026.");
    }
}
