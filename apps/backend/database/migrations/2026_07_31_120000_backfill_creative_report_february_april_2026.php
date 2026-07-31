<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['2026-02-01', '2026-04-01'] as $period) {
            DB::table('creative_report_members as member')
                ->where('member.status', 'active')
                ->where('member.position_name', '<>', 'Manajer')
                ->whereNotExists(function ($query) use ($period) {
                    $query->select(DB::raw(1))
                        ->from('creative_report_assessments as assessment')
                        ->whereColumn('assessment.creative_report_member_id', 'member.id')
                        ->where('assessment.period', $period);
                })
                ->get(['member.id', 'member.user_id', 'member.position_name'])
                ->each(function ($member) use ($period): void {
                    $groupName = match ($member->position_name) {
                        'SPV' => 'Supervisor Creative Production',
                        'Videographer' => 'Creative Video Production',
                        default => 'Creative Design Production',
                    };
                    $groupId = DB::table('creative_report_groups')->where('name', $groupName)->value('id');
                    if (! $groupId) return;

                    DB::table('creative_report_assessments')->insert([
                        'creative_report_group_id' => $groupId,
                        'user_id' => $member->user_id,
                        'creative_report_member_id' => $member->id,
                        'period' => $period,
                        'creative_scores' => json_encode(array_fill(0, 10, 0)),
                        'leave_count' => 0,
                        'app_permission_count' => 0,
                        'absence_count' => 0,
                        'late_count' => 0,
                        'status' => 'draft',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                });
        }
    }

    public function down(): void
    {
        DB::table('creative_report_assessments')
            ->whereIn('period', ['2026-02-01', '2026-04-01'])
            ->where('status', 'draft')
            ->delete();
    }
};
