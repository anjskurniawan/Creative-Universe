<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('odds_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->decimal('score_weight', 8, 2)->default(1);
            $table->unsignedInteger('normal_revision_limit')->default(2);
            $table->unsignedInteger('workload_point')->default(1);
            $table->unsignedInteger('sla_days')->default(3);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('odds_designer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('status', 20)->default('available');
            $table->json('specializations')->nullable();
            $table->unsignedInteger('daily_capacity_points')->default(8);
            $table->unsignedInteger('max_active_tasks')->default(3);
            $table->unsignedInteger('assignment_priority')->default(100);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'is_active']);
        });

        Schema::create('odds_system_rules', function (Blueprint $table) {
            $table->id();
            $table->string('key', 120)->unique();
            $table->json('value');
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('odds_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_number', 50)->unique();
            $table->string('request_type', 20)->default('design');
            $table->foreignId('category_id')->nullable()->constrained('odds_categories')->nullOnDelete();
            $table->json('category_snapshot');
            $table->foreignId('requester_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('preferred_designer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_designer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('design_purpose', 255);
            $table->text('brief_text');
            $table->text('reference_visual')->nullable();
            $table->dateTime('deadline');
            $table->string('important_matrix', 20)->default('normal');
            $table->text('attachment_notes')->nullable();
            $table->string('status', 50)->default('submitted');
            $table->string('task_type', 40)->default('new_task');
            $table->unsignedInteger('workload_point')->default(1);
            $table->decimal('priority_score', 10, 2)->default(0);
            $table->unsignedInteger('brief_return_count')->default(0);
            $table->unsignedInteger('leader_revision_count')->default(0);
            $table->unsignedInteger('normal_revision_count')->default(0);
            $table->timestamp('extra_revision_used_at')->nullable();
            $table->foreignId('extra_revision_approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('urgent_revision_used_at')->nullable();
            $table->foreignId('urgent_revision_approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('done_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->foreignId('current_queue_id')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'assigned_designer_id']);
            $table->index(['requester_id', 'created_at']);
            $table->index('deadline');
        });

        Schema::create('odds_task_briefs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->unique()->constrained('odds_tasks')->cascadeOnDelete();
            $table->text('content');
            $table->text('reference_visual')->nullable();
            $table->json('attachments')->nullable();
            $table->text('last_return_note')->nullable();
            $table->text('ai_summary')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('odds_task_queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('odds_tasks')->cascadeOnDelete();
            $table->foreignId('designer_id')->constrained('users')->restrictOnDelete();
            $table->string('queue_status', 30)->default('queued');
            $table->string('task_type', 40)->default('new_task');
            $table->decimal('priority_score', 10, 2)->default(0);
            $table->dateTime('estimated_start_at')->nullable();
            $table->dateTime('estimated_finish_at')->nullable();
            $table->text('skip_reason')->nullable();
            $table->timestamp('skipped_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['designer_id', 'queue_status', 'priority_score']);
        });

        Schema::table('odds_tasks', function (Blueprint $table) {
            $table->foreign('current_queue_id')->references('id')->on('odds_task_queue')->nullOnDelete();
        });

        Schema::create('odds_task_time_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('odds_tasks')->cascadeOnDelete();
            $table->foreignId('designer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('log_type', 30);
            $table->timestamp('started_at');
            $table->timestamp('stopped_at')->nullable();
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['task_id', 'log_type', 'stopped_at']);
        });

        Schema::create('odds_task_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('odds_tasks')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->foreignId('submitted_by')->constrained('users')->restrictOnDelete();
            $table->text('result_notes')->nullable();
            $table->string('status', 40)->default('pending_spv');
            $table->timestamp('submitted_at');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['task_id', 'version_number']);
        });

        Schema::create('odds_task_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('odds_tasks')->cascadeOnDelete();
            $table->foreignId('result_id')->nullable()->constrained('odds_task_results')->nullOnDelete();
            $table->foreignId('reviewer_id')->constrained('users')->restrictOnDelete();
            $table->string('review_type', 30);
            $table->string('decision', 30);
            $table->text('notes')->nullable();
            $table->unsignedTinyInteger('rating')->nullable();
            $table->timestamps();
        });

        Schema::create('odds_task_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('odds_tasks')->cascadeOnDelete();
            $table->foreignId('result_id')->nullable()->constrained('odds_task_results')->nullOnDelete();
            $table->foreignId('requested_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('revision_type', 30);
            $table->text('notes');
            $table->string('status', 30)->default('open');
            $table->boolean('is_urgent_final')->default(false);
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('odds_task_skip_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('odds_tasks')->cascadeOnDelete();
            $table->foreignId('designer_id')->constrained('users')->restrictOnDelete();
            $table->text('reason');
            $table->string('status', 30)->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable();
            $table->timestamps();
        });

        Schema::create('odds_task_cancel_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('odds_tasks')->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users')->restrictOnDelete();
            $table->text('reason');
            $table->string('status', 30)->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable();
            $table->timestamps();
        });

        Schema::create('odds_designer_daily_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date');
            $table->foreignId('designer_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('task_id')->nullable()->constrained('odds_tasks')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('odds_categories')->nullOnDelete();
            $table->boolean('output_done')->default(false);
            $table->unsignedInteger('active_work_duration_seconds')->default(0);
            $table->unsignedInteger('revision_duration_seconds')->default(0);
            $table->unsignedInteger('review_waiting_duration_seconds')->default(0);
            $table->unsignedInteger('revision_count')->default(0);
            $table->boolean('overdue')->default(false);
            $table->unsignedTinyInteger('rating')->nullable();
            $table->string('final_status', 50);
            $table->timestamp('done_at')->nullable();
            $table->decimal('score', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['report_date', 'task_id'], 'odds_daily_report_task_unique');
        });

        Schema::create('odds_designer_rankings', function (Blueprint $table) {
            $table->id();
            $table->string('period_type', 20);
            $table->date('period_start');
            $table->date('period_end');
            $table->foreignId('designer_id')->constrained('users')->restrictOnDelete();
            $table->unsignedInteger('total_output')->default(0);
            $table->decimal('total_score', 12, 2)->default(0);
            $table->unsignedInteger('total_work_duration_seconds')->default(0);
            $table->unsignedInteger('total_revision_duration_seconds')->default(0);
            $table->unsignedInteger('total_revision_count')->default(0);
            $table->unsignedInteger('overdue_count')->default(0);
            $table->decimal('average_rating', 4, 2)->nullable();
            $table->timestamps();

            $table->unique(['period_type', 'period_start', 'designer_id'], 'odds_ranking_period_designer_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('odds_designer_rankings');
        Schema::dropIfExists('odds_designer_daily_reports');
        Schema::dropIfExists('odds_task_cancel_requests');
        Schema::dropIfExists('odds_task_skip_requests');
        Schema::dropIfExists('odds_task_revisions');
        Schema::dropIfExists('odds_task_reviews');
        Schema::dropIfExists('odds_task_results');
        Schema::dropIfExists('odds_task_time_logs');
        Schema::table('odds_tasks', function (Blueprint $table) {
            $table->dropForeign(['current_queue_id']);
        });
        Schema::dropIfExists('odds_task_queue');
        Schema::dropIfExists('odds_task_briefs');
        Schema::dropIfExists('odds_tasks');
        Schema::dropIfExists('odds_system_rules');
        Schema::dropIfExists('odds_designer_profiles');
        Schema::dropIfExists('odds_categories');
    }
};
