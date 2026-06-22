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
        Schema::create('odds_ticket_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('odds_tickets')->cascadeOnDelete();
            $table->foreignId('rater_id')->constrained('users');
            $table->tinyInteger('quality_score');
            $table->tinyInteger('speed_score');
            $table->tinyInteger('communication_score');
            $table->decimal('overall_score', 3, 2);
            $table->text('feedback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('odds_ticket_ratings');
    }
};
