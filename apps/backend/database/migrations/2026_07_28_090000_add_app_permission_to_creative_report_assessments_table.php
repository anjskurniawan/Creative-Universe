<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('creative_report_assessments', function (Blueprint $table): void {
            $table->unsignedTinyInteger('app_permission_count')->default(0)->after('leave_count');
        });
    }

    public function down(): void
    {
        Schema::table('creative_report_assessments', function (Blueprint $table): void {
            $table->dropColumn('app_permission_count');
        });
    }
};
