<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('odds_designer_profiles', function (Blueprint $table) {
            $table->dropColumn('daily_capacity_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('odds_designer_profiles', function (Blueprint $table) {
            $table->integer('daily_capacity_minutes')->default(420)->after('specializations');
        });
    }
};
