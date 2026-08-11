<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            $assessmentIds = DB::table('creative_report_assessments')
                ->join('creative_report_members', 'creative_report_members.id', '=', 'creative_report_assessments.creative_report_member_id')
                ->where(function ($query): void {
                    $query
                        ->whereRaw("creative_report_assessments.period < strftime('%Y-%m-01', creative_report_members.joined_at)")
                        ->orWhere(function ($query): void {
                            $query
                                ->whereNotNull('creative_report_members.resigned_at')
                                ->whereRaw("creative_report_assessments.period > strftime('%Y-%m-01', creative_report_members.resigned_at)");
                        });
                })
                ->pluck('creative_report_assessments.id');

            if ($assessmentIds->isNotEmpty()) {
                DB::table('creative_report_assessments')->whereIn('id', $assessmentIds)->delete();
            }

            return;
        }

        DB::statement(<<<'SQL'
            DELETE assessment
            FROM creative_report_assessments assessment
            INNER JOIN creative_report_members member
                ON member.id = assessment.creative_report_member_id
            WHERE assessment.period < DATE_FORMAT(member.joined_at, '%Y-%m-01')
               OR (
                    member.resigned_at IS NOT NULL
                    AND assessment.period > DATE_FORMAT(member.resigned_at, '%Y-%m-01')
               )
        SQL);
    }

    public function down(): void
    {
        // Historical rows removed by this correction cannot be restored safely.
    }
};
