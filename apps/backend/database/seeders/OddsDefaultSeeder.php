<?php

namespace Database\Seeders;

use App\Models\Core\User;
use App\Models\Odds\Category;
use App\Models\Odds\DesignerProfile;
use App\Models\Odds\SystemRule;
use Illuminate\Database\Seeder;

class OddsDefaultSeeder extends Seeder
{
    public function run(): void
    {
        Category::firstOrCreate(
            ['name' => 'Marketplace Banner'],
            [
                'score_weight' => 2,
                'normal_revision_limit' => 2,
                'workload_point' => 2,
                'sla_days' => 3,
                'is_active' => true,
            ]
        );

        Category::firstOrCreate(
            ['name' => 'Social Media Feed'],
            [
                'score_weight' => 1.5,
                'normal_revision_limit' => 2,
                'workload_point' => 1,
                'sla_days' => 2,
                'is_active' => true,
            ]
        );

        SystemRule::firstOrCreate(
            ['key' => 'brief_return_limit'],
            [
                'value' => ['count' => 2],
                'description' => 'Jumlah maksimal brief boleh dikembalikan sebelum eskalasi SPV.',
                'is_active' => true,
            ]
        );

        SystemRule::firstOrCreate(
            ['key' => 'client_review_timeout_days'],
            [
                'value' => ['days' => 3],
                'description' => 'Batas client tidak merespons review sebelum auto done.',
                'is_active' => true,
            ]
        );

        SystemRule::firstOrCreate(
            ['key' => 'leader_revision_quality_issue_limit'],
            [
                'value' => ['count' => 2],
                'description' => 'Batas wajar revisi SPV sebelum task ditandai sebagai quality issue.',
                'is_active' => true,
            ]
        );

        User::role(['Designer', 'Videographer'])->get()->each(function (User $user) {
            DesignerProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'status' => 'available',
                    'specializations' => [],
                    'daily_capacity_points' => 8,
                    'max_active_tasks' => 3,
                    'assignment_priority' => 100,
                    'is_active' => true,
                ]
            );
        });
    }
}
