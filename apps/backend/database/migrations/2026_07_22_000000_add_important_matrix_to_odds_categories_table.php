<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('odds_categories', function (Blueprint $table) {
            $table->string('important_matrix', 20)->default('Q4')->after('sla_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('odds_categories', function (Blueprint $table) {
            $table->dropColumn('important_matrix');
        });
    }
};
