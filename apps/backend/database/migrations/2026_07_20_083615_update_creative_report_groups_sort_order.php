<?php

use Illuminate\Database\Migrations\Migration;
use App\SubApps\CreativeReport\Models\ReportGroup;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        ReportGroup::where('name', 'Supervisor Creative Production')->update(['sort_order' => 1]);
        ReportGroup::where('name', 'Creative Design Production')->update(['sort_order' => 2]);
        ReportGroup::where('name', 'Creative Video Production')->update(['sort_order' => 3]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        ReportGroup::where('name', 'Supervisor Creative Production')->update(['sort_order' => 1]);
        ReportGroup::where('name', 'Creative Video Production')->update(['sort_order' => 2]);
        ReportGroup::where('name', 'Creative Design Production')->update(['sort_order' => 3]);
    }
};
