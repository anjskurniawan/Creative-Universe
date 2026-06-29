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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_onboarded')->default(true)->after('password');
            $table->unsignedBigInteger('division_id')->nullable()->after('is_onboarded');
            $table->unsignedBigInteger('position_id')->nullable()->after('division_id');

            $table->foreign('division_id')->references('id')->on('divisions')->nullOnDelete();
            $table->foreign('position_id')->references('id')->on('positions')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropForeign(['position_id']);
            $table->dropColumn(['is_onboarded', 'division_id', 'position_id']);
        });
    }
};
