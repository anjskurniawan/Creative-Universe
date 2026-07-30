<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('odds_task_drafts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->cascadeOnDelete();
            $table->json('payload');
            $table->timestamps();

            $table->index(['requester_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('odds_task_drafts');
    }
};
