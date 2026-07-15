<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('creative_report_groups')) {
            Schema::create('creative_report_groups', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->unsignedTinyInteger('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('creative_report_assessments')) {
            Schema::create('creative_report_assessments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('creative_report_group_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->date('period');
                $table->json('creative_scores');
                $table->unsignedTinyInteger('leave_count')->default(0);
                $table->unsignedTinyInteger('absence_count')->default(0);
                $table->unsignedTinyInteger('late_count')->default(0);
                $table->string('status')->default('draft');
                $table->timestamp('completed_at')->nullable();
                $table->foreignId('completed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();

                $table->unique(['user_id', 'period']);
                $table->index(['period', 'creative_report_group_id'], 'creative_report_period_group_idx');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('creative_report_assessments');
        Schema::dropIfExists('creative_report_groups');
    }
};
