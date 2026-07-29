<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('odds_categories', function (Blueprint $table) {
            $table->string('brief_format', 20)->default('default')->after('important_matrix');
        });
    }

    public function down(): void
    {
        Schema::table('odds_categories', function (Blueprint $table) {
            $table->dropColumn('brief_format');
        });
    }
};
