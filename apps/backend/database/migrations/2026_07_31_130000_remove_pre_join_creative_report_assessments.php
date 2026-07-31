<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
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
