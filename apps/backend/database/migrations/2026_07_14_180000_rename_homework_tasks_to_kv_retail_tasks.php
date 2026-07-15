<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('homework_tasks', 'kv_retail_tasks');
        Schema::rename('homework_task_user', 'kv_retail_task_user');

        Schema::table('kv_retail_task_user', function (Blueprint $table) {
            $table->renameColumn('homework_task_id', 'kv_retail_task_id');
        });
    }

    public function down(): void
    {
        Schema::table('kv_retail_task_user', function (Blueprint $table) {
            $table->renameColumn('kv_retail_task_id', 'homework_task_id');
        });

        Schema::rename('kv_retail_task_user', 'homework_task_user');
        Schema::rename('kv_retail_tasks', 'homework_tasks');
    }
};
