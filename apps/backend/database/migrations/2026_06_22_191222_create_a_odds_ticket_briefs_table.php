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
        Schema::create('odds_ticket_briefs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('odds_tickets')->cascadeOnDelete();
            $table->text('description');
            $table->string('target_audience', 255);
            $table->text('key_message');
            $table->json('required_outputs');
            $table->text('ai_summary')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('odds_ticket_briefs');
    }
};
