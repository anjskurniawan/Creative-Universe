<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('odds_tasks')->where('status', 'spv_review')->update(['status' => 'leader_review']);
        DB::table('odds_tasks')->where('status', 'cancelled_by_spv')->update(['status' => 'cancelled_by_leader']);
        DB::table('odds_tasks')->where('status', 'revision_rejected_by_spv')->update(['status' => 'revision_rejected_by_leader']);

        DB::table('odds_task_results')->where('status', 'pending_spv')->update(['status' => 'pending_leader']);
        DB::table('odds_task_results')->where('status', 'approved_by_spv')->update(['status' => 'approved_by_leader']);

        DB::table('odds_task_reviews')->where('review_type', 'spv')->update(['review_type' => 'leader']);
        DB::table('odds_task_time_logs')->where('log_type', 'spv_review')->update(['log_type' => 'leader_review']);
    }

    public function down(): void
    {
        DB::table('odds_tasks')->where('status', 'leader_review')->update(['status' => 'spv_review']);
        DB::table('odds_tasks')->where('status', 'cancelled_by_leader')->update(['status' => 'cancelled_by_spv']);
        DB::table('odds_tasks')->where('status', 'revision_rejected_by_leader')->update(['status' => 'revision_rejected_by_spv']);
        DB::table('odds_task_results')->where('status', 'pending_leader')->update(['status' => 'pending_spv']);
        DB::table('odds_task_results')->where('status', 'approved_by_leader')->update(['status' => 'approved_by_spv']);
        DB::table('odds_task_reviews')->where('review_type', 'leader')->update(['review_type' => 'spv']);
        DB::table('odds_task_time_logs')->where('log_type', 'leader_review')->update(['log_type' => 'spv_review']);
    }
};
