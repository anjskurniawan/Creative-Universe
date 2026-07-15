<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kv_retail_tasks', function (Blueprint $table) {
            $table->string('legacy_source', 100)->nullable()->after('id');
            $table->unsignedBigInteger('legacy_id')->nullable()->after('legacy_source');
            $table->unique(['legacy_source', 'legacy_id'], 'kv_retail_tasks_legacy_source_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('kv_retail_tasks', function (Blueprint $table) {
            $table->dropUnique('kv_retail_tasks_legacy_source_id_unique');
            $table->dropColumn(['legacy_source', 'legacy_id']);
        });
    }
};
