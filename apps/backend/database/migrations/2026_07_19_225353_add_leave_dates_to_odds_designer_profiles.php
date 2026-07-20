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
            $table->json('leave_dates')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('odds_designer_profiles', function (Blueprint $table) {
            $table->dropColumn('leave_dates');
        });
    }
};
