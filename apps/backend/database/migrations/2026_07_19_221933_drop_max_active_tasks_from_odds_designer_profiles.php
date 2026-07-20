<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('odds_designer_profiles', function (Blueprint $table) {
            $table->dropColumn(['max_active_tasks', 'assignment_priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('odds_designer_profiles', function (Blueprint $table) {
            $table->integer('max_active_tasks')->default(3);
            $table->integer('assignment_priority')->default(100);
        });
    }
};
