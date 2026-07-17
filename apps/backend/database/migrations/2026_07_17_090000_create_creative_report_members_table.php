<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('creative_report_members')) {
            Schema::create('creative_report_members', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->unique()->constrained('users')->nullOnDelete();
                $table->string('name');
                $table->foreignId('position_id')->nullable()->constrained('positions')->nullOnDelete();
                $table->string('position_name');
                $table->string('status')->default('pending');
                $table->timestamp('joined_at')->nullable();
                $table->timestamp('resigned_at')->nullable();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
                $table->timestamps();

                $table->index(['status', 'position_name']);
            });
        }

        Schema::table('creative_report_assessments', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'period']);
            $table->dropForeign(['user_id']);
            $table->foreignId('creative_report_member_id')->nullable()->after('creative_report_group_id')
                ->constrained('creative_report_members')->nullOnDelete();
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->unique(['user_id', 'period']);
            $table->unique(['creative_report_member_id', 'period'], 'creative_report_member_period_unique');
        });
    }

    public function down(): void
    {
        Schema::table('creative_report_assessments', function (Blueprint $table) {
            $table->dropUnique('creative_report_member_period_unique');
            $table->dropForeign(['creative_report_member_id']);
            $table->dropColumn('creative_report_member_id');
            $table->dropUnique(['user_id', 'period']);
            $table->dropForeign(['user_id']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique(['user_id', 'period']);
        });

        Schema::dropIfExists('creative_report_members');
    }
};
