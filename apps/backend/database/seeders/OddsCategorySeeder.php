<?php

namespace Database\Seeders;

use App\SubApps\Odds\Models\Category;
use Illuminate\Database\Seeder;

class OddsCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Instagram JETE Indonesia',
            'Instagram JETE RUN',
            'Event JETE RUN',
            'Deskripsi Produk Barang Baru',
            'All Request Marketing Subaya',
            'Branding Retail Store',
            'Web Xsports Medal',
            'PM All Brand',
            'Request Corporate',
            'Feed DJI Enterprise',
            'VM Garmin Indonesia',
            'Programer - Apps',
            'Jhonny - CEO',
            'Instagram Doran Pengadaan',
            'Modeling & Rendering 3D Produk',
            'Layout Popup Store Gramedia',
            '3D Akrilik Display',
            'All Desain Samsung by Doran Gadget',
            'All Marketplace Pusat (Surabaya)',
            'Launching | Branding Campaign | Promo',
            'Office Balikpapan',
            'Office Jogja',
            'Office Semarang',
            'IG Doran Gadget',
            'Retail Doran Gadget',
            'Instagram Pak Jhonny',
            'Feed JETE Runners',
            'Feed JETE Squad',
            'Office Bali',
            'Graphic Youtube DG',
            'Katalog Event JETE X',
            'Keperluan Retail JETE',
            'JETE X Esports',
            'Marketing JKT',
            'Konten Digital Marketing',
            'Instagram JETE X',
            'Instagram Jadwal Lari',
            'Sales Tradisional',
            'Akrilik dll',
            'Slider Web JETE',
            'Instagram JETE Smart',
            'Thumbnail YT JETE',
            'Artikel JETE & DG',
            'HRD | Head Office',
            'Office Bandung',
            'Office Makasar',
            'Office Jakarta',
            'Packaging Produk Outline',
            'Packaging Produk',
            'Katalog JETE Besar & Kecil',
            'Keperluan PM JETE',
            'All D\'Souv',
            'Deskripsi Produk JETE',
            'JETE Pop Style',
        ];

        foreach ($categories as $name) {
            Category::firstOrCreate(
                ['name' => $name],
                [
                    'score_weight' => 1.0,
                    'normal_revision_limit' => 2,
                    'sla_minutes' => 0,
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Seeded ' . count($categories) . ' ODDS categories successfully.');
    }
}
