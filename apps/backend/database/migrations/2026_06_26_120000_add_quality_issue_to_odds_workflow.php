<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('odds_tasks', function (Blueprint $table) {
            $table->boolean('quality_issue_flag')->default(false)->after('leader_revision_count');
            $table->text('quality_issue_note')->nullable()->after('quality_issue_flag');
        });

        Schema::table('odds_designer_daily_reports', function (Blueprint $table) {
            $table->boolean('quality_issue_flag')->default(false)->after('overdue');
        });
    }

    public function down(): void
    {
        Schema::table('odds_designer_daily_reports', function (Blueprint $table) {
            $table->dropColumn('quality_issue_flag');
        });

        Schema::table('odds_tasks', function (Blueprint $table) {
            $table->dropColumn(['quality_issue_flag', 'quality_issue_note']);
        });
    }
};
