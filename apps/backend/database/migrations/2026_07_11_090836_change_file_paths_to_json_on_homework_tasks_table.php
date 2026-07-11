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
        Schema::table('homework_tasks', function (Blueprint $table) {
            $table->dropColumn(['support_file_path', 'draft_file_path']);
        });

        Schema::table('homework_tasks', function (Blueprint $table) {
            $table->json('support_file_path')->nullable();
            $table->json('draft_file_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('homework_tasks', function (Blueprint $table) {
            $table->dropColumn(['support_file_path', 'draft_file_path']);
        });

        Schema::table('homework_tasks', function (Blueprint $table) {
            $table->string('support_file_path')->nullable();
            $table->string('draft_file_path')->nullable();
        });
    }
};
