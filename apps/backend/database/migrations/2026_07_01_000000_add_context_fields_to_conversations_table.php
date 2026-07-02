<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->string('context_type', 50)->default('direct')->after('id');
            $table->unsignedBigInteger('context_id')->nullable()->after('context_type');
            $table->string('status', 20)->default('open')->after('context_id');
            $table->timestamp('closed_at')->nullable()->after('status');
            $table->string('closed_reason')->nullable()->after('closed_at');

            $table->unique(['context_type', 'context_id'], 'conversations_context_unique');
            $table->index(['context_type', 'status'], 'conversations_context_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropUnique('conversations_context_unique');
            $table->dropIndex('conversations_context_status_index');
            $table->dropColumn(['context_type', 'context_id', 'status', 'closed_at', 'closed_reason']);
        });
    }
};
