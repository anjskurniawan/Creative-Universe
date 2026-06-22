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
        Schema::create('odds_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 50)->unique()->index();
            $table->string('design_purpose', 255);
            $table->foreignId('requester_id')->constrained('users');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->foreignId('category_id')->constrained('odds_design_categories');
            $table->string('brand', 100);
            $table->string('channel', 100);
            $table->string('important_matrix', 20); // Enum
            $table->dateTime('deadline');
            $table->string('status', 50); // Enum
            $table->integer('brief_score')->nullable();
            $table->string('sla_status', 20)->nullable(); // Enum
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('odds_tickets');
    }
};
