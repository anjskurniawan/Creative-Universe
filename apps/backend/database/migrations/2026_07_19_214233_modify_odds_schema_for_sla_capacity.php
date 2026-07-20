<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('odds_categories', function (Blueprint $table) {
            $table->dropColumn('workload_point');
        });

        Schema::table('odds_tasks', function (Blueprint $table) {
            $table->dropColumn('workload_point');
        });

        Schema::table('odds_designer_profiles', function (Blueprint $table) {
            $table->renameColumn('daily_capacity_points', 'daily_capacity_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('odds_categories', function (Blueprint $table) {
            $table->unsignedInteger('workload_point')->default(1);
        });

        Schema::table('odds_tasks', function (Blueprint $table) {
            $table->unsignedInteger('workload_point')->default(1);
        });

        Schema::table('odds_designer_profiles', function (Blueprint $table) {
            $table->renameColumn('daily_capacity_minutes', 'daily_capacity_points');
        });
    }
};
