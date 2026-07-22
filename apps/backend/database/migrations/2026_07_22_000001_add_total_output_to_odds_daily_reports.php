<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('odds_designer_daily_reports', function (Blueprint $table) {
            $table->unsignedInteger('total_output')->default(0)->after('output_done');
        });
    }

    public function down(): void
    {
        Schema::table('odds_designer_daily_reports', function (Blueprint $table) {
            $table->dropColumn('total_output');
        });
    }
};
