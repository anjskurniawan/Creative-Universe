<?php

namespace Database\Seeders;

use App\Models\Core\User;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\SystemRule;
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
                'sla_minutes' => 3,
                'is_active' => true,
            ]
        );

        Category::firstOrCreate(
            ['name' => 'Social Media Feed'],
            [
                'score_weight' => 1.5,
                'normal_revision_limit' => 2,
                'sla_minutes' => 2,
                'is_active' => true,
            ]
        );

        $additionalCategories = [
            ['name' => 'Instagram Story', 'score_weight' => 1, 'normal_revision_limit' => 2, 'sla_minutes' => 1],
            ['name' => 'Social Media Carousel', 'score_weight' => 2, 'normal_revision_limit' => 2, 'sla_minutes' => 3],
            ['name' => 'Product Launch Key Visual', 'score_weight' => 3, 'normal_revision_limit' => 3, 'sla_minutes' => 5],
            ['name' => 'E-Commerce Product Thumbnail', 'score_weight' => 1, 'normal_revision_limit' => 2, 'sla_minutes' => 2],
            ['name' => 'Website Hero Banner', 'score_weight' => 2.5, 'normal_revision_limit' => 2, 'sla_minutes' => 4],
            ['name' => 'Promotional Poster', 'score_weight' => 2, 'normal_revision_limit' => 2, 'sla_minutes' => 3],
            ['name' => 'Email Campaign Banner', 'score_weight' => 1.5, 'normal_revision_limit' => 2, 'sla_minutes' => 2],
            ['name' => 'Event Branding', 'score_weight' => 4, 'normal_revision_limit' => 3, 'sla_minutes' => 7],
            ['name' => 'Packaging Label', 'score_weight' => 3, 'normal_revision_limit' => 3, 'sla_minutes' => 5],
            ['name' => 'Presentation Deck', 'score_weight' => 3.5, 'normal_revision_limit' => 3, 'sla_minutes' => 6],
        ];

        foreach ($additionalCategories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name']],
                [...$category, 'is_active' => true]
            );
        }

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
            ['key' => 'no_response_hours'],
            [
                'value' => ['hours' => 24],
                'description' => 'Batas tidak ada respons sebelum sistem mengirim reminder ODDS.',
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

        SystemRule::firstOrCreate(
            ['key' => 'global_daily_capacity'],
            [
                'value' => [
                    'monday' => 420,
                    'tuesday' => 420,
                    'wednesday' => 420,
                    'thursday' => 420,
                    'friday' => 420,
                    'saturday' => 420,
                    'sunday' => 0,
                ],
                'description' => 'Kapasitas maksimal harian desainer (dalam menit).',
                'is_active' => true,
            ]
        );

        SystemRule::firstOrCreate(
            ['key' => 'holiday_calendar'],
            [
                'value' => ['dates' => []],
                'description' => 'Daftar tanggal libur (YYYY-MM-DD).',
                'is_active' => true,
            ]
        );

        User::role(['Designer', 'Videographer'])->get()->each(function (User $user) {
            DesignerProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'status' => 'available',
                    'specializations' => [],
                    'is_active' => true,
                ]
            );
        });
    }
}
