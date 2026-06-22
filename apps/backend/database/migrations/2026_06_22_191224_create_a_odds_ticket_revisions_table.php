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
        Schema::create('odds_ticket_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('odds_tickets')->cascadeOnDelete();
            $table->foreignId('version_id')->constrained('odds_ticket_versions')->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users');
            $table->string('revision_type', 20); // Enum
            $table->text('notes');
            $table->dateTime('revision_deadline')->nullable();
            $table->string('status', 20)->default('open'); // Enum
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('odds_ticket_revisions');
    }
};
