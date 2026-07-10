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
        Schema::create('homework_tasks', function (Blueprint $table) {
            $table->id();
            $table->date('task_given_date');
            $table->string('task_name');
            $table->string('pic_vendor')->nullable(); // e.g. Mireco, Fushion
            $table->string('support_file_path')->nullable();
            $table->date('deadline_date')->nullable();
            $table->string('draft_file_path')->nullable();
            $table->string('status')->default('0'); // 0, ACC Draft, Progress Design, Approval Design, Kirim Email, Done
            $table->json('task_timestamps')->nullable(); // Store completion timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homework_tasks');
    }
};
