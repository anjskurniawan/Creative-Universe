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
            $table->dropForeign(['approved_by']);
            // Drop index explicitly to satisfy SQLite in tests
            $table->dropIndex(['is_active']);
            $table->dropIndex(['approved_by']);
            $table->dropColumn([
                'is_active',
                'registration_note',
                'approved_by',
                'approved_at',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(false)->index();
            $table->text('registration_note')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();

            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->index('approved_by');
        });
    }
};
