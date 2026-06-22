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
        Schema::create('odds_ticket_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('odds_tickets')->cascadeOnDelete();
            $table->integer('version_number');
            $table->foreignId('submitted_by')->constrained('users');
            $table->string('status', 50); // Enum
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('odds_ticket_versions');
    }
};
