<?php

namespace Database\Seeders;

use App\Models\Odds\DesignCategory;
use Illuminate\Database\Seeder;

class OddsDesignCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Design PPT', 'sla_days' => 3],
            ['name' => 'Gambar Deskripsi', 'sla_days' => 3],
            ['name' => 'FEED IG', 'sla_days' => 3],
            ['name' => 'BANNER', 'sla_days' => 3],
            ['name' => 'Katalog', 'sla_days' => 5],
            ['name' => 'Packaging', 'sla_days' => 5],
            ['name' => 'Video Reels / TikTok', 'sla_days' => 3],
            ['name' => 'Thumbnail YouTube', 'sla_days' => 2],
        ];

        foreach ($categories as $cat) {
            DesignCategory::firstOrCreate(
                ['name' => $cat['name']],
                ['sla_days' => $cat['sla_days'], 'is_active' => true]
            );
        }
    }
}
