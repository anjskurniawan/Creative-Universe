<?php

namespace Database\Seeders;

use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerProfile;
use App\Models\Core\User;
use Illuminate\Database\Seeder;

class OddsCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Define levels based on spreadsheet mapping: Light (1pt, 30m), Normal (2pt, 60m), Hard (3pt, 180m), Extreme (5pt, 1440m)
        $categoryData = [
            // LIGHT (1 Poin, 30 min)
            ['name' => 'Instagram JETE Indonesia', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Instagram JETE RUN', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Keperluan Retail JETE', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'JETE X Esports', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Instagram JETE X', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Instagram Jadwal Lari', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Slider Web JETE', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q4'],
            ['name' => 'Instagram JETE Smart', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Thumbnail YT JETE', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q4'],
            ['name' => 'Artikel JETE & DG', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q4'],
            ['name' => 'Office Bandung', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Office Makassar', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q4'],
            ['name' => 'Office Jakarta', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            ['name' => 'Packaging Produk Outline', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q2'],
            ['name' => 'Katalog JETE Besar & Kecil', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q2'],
            ['name' => 'Keperluan PM JETE', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q2'],
            ['name' => 'Deskripsi Produk JETE', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q2'],
            ['name' => 'IG Doran Gadget', 'workload_point' => 1, 'sla_minutes' => 30, 'important_matrix' => 'Q3'],
            
            // NORMAL (2 Poin, 60 min)
            ['name' => 'All Desain Samsung by Doran Gadget', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q2'],
            ['name' => 'All Marketplace Pusat (Surabaya)', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q3'],
            ['name' => 'Office Balikpapan', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q3'],
            ['name' => 'Office Jogja', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q3'],
            ['name' => 'Office Semarang', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q3'],
            ['name' => 'Instagram Pak Jhonny', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q1'],
            ['name' => 'Feed JETE Runners', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q3'],
            ['name' => 'Feed JETE Squad', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q3'],
            ['name' => 'Office Bali', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q3'],
            ['name' => 'Graphic Youtube DG', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q4'],
            ['name' => 'Katalog Event JETE X', 'workload_point' => 2, 'sla_minutes' => 60, 'important_matrix' => 'Q2'],

            // HARD (3 Poin, 180 min)
            ['name' => 'Event JETE RUN', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Deskripsi Produk Barang Baru', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q2'],
            ['name' => 'All Request Marketing Subaya', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Branding Retail Store', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q2'],
            ['name' => 'Web Xsports Medal', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q2'],
            ['name' => 'PM All Brand', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Request Corporate', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Feed DJI Enterprise', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q2'],
            ['name' => 'VM Garmin Indonesia', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q2'],
            ['name' => 'Programmer - Apps', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Jhonny - CEO', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Instagram Doran Pengadaan', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q3'],
            ['name' => 'Modeling & Rendering 3D Produk', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q2'],
            ['name' => 'Layout Popup Store Gramedia', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => '3D Akrilik Display', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Launching / Branding Campaign / Promo', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q1'],
            ['name' => 'Retail Doran Gadget', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q3'],
            ['name' => 'Marketing JKT', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q3'],
            ['name' => 'Konten Digital Marketing', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q3'],
            ['name' => 'Sales Tradisional', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q3'],
            ['name' => 'Akrilik dll', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q4'],
            ['name' => 'HRD | Head Office', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q3'],
            ['name' => 'Packaging Produk', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q2'],
            ['name' => 'All D\'Souv', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q4'],
            ['name' => 'JETE Pop Style', 'workload_point' => 3, 'sla_minutes' => 180, 'important_matrix' => 'Q4'],
        ];

        // Ensure all categories exist and update SLA / score / important_matrix
        $categoryIds = [];
        foreach ($categoryData as $data) {
            $cat = Category::updateOrCreate(
                ['name' => $data['name']],
                [
                    'score_weight' => $data['workload_point'],
                    'normal_revision_limit' => 2,
                    'sla_minutes' => $data['sla_minutes'],
                    'important_matrix' => $data['important_matrix'],
                    'is_active' => true,
                ]
            );
            $categoryIds[$data['name']] = $cat->id;
        }

        $this->command->info('Seeded ' . count($categoryData) . ' ODDS categories successfully.');

        // Designer mapping to category names
        $designerMapping = [
            'Bobby' => [
                'Instagram JETE Indonesia',
                'Instagram JETE RUN',
            ],
            'Shaloom' => [
                'Event JETE RUN',
                'Deskripsi Produk Barang Baru',
                'All Request Marketing Subaya',
                'Branding Retail Store',
                'Web Xsports Medal',
                'PM All Brand',
                'Request Corporate',
                'Feed DJI Enterprise',
                'VM Garmin Indonesia',
                'Programmer - Apps',
                'Jhonny - CEO',
            ],
            'Bagus' => [
                'Instagram Doran Pengadaan',
                'Modeling & Rendering 3D Produk',
                'Layout Popup Store Gramedia',
                '3D Akrilik Display',
            ],
            'Adrian' => [
                'All Desain Samsung by Doran Gadget',
                'All Marketplace Pusat (Surabaya)',
                'Launching / Branding Campaign / Promo',
                'Office Balikpapan',
                'Office Jogja',
                'Office Semarang',
            ],
            'Fatur' => [
                'IG Doran Gadget',
                'Retail Doran Gadget',
                'Instagram Pak Jhonny',
                'Feed JETE Runners',
                'Feed JETE Squad',
                'Office Bali',
                'Graphic Youtube DG',
                'Katalog Event JETE X',
            ],
            'Richard' => [
                'Keperluan Retail JETE',
                'JETE X Esports',
                'Marketing JKT',
                'Konten Digital Marketing',
                'Instagram JETE X',
                'Instagram Jadwal Lari',
            ],
            'Asriya' => [
                'Sales Tradisional',
                'Akrilik dll',
                'Slider Web JETE',
                'Instagram JETE Smart',
                'Thumbnail YT JETE',
                'Artikel JETE & DG',
                'HRD | Head Office',
                'Office Bandung',
                'Office Makassar',
                'Office Jakarta',
            ],
            'Ilham' => [
                'Packaging Produk Outline',
                'Packaging Produk',
                'Katalog JETE Besar & Kecil',
                'Keperluan PM JETE',
            ],
            'Anjas' => [
                'All D\'Souv',
            ],
            'Fadhil' => [
                'Deskripsi Produk JETE',
                'JETE Pop Style',
            ],
        ];

        // Seed designer specializations
        foreach ($designerMapping as $designerKey => $catNames) {
            // Find designer profile by user name
            $profile = DesignerProfile::whereHas('user', function ($query) use ($designerKey) {
                $query->where('name', 'like', "%{$designerKey}%");
            })->first();

            if ($profile) {
                $specIds = [];
                foreach ($catNames as $cName) {
                    if (isset($categoryIds[$cName])) {
                        $specIds[] = (string) $categoryIds[$cName];
                    }
                }
                $profile->update([
                    'specializations' => $specIds
                ]);
                $this->command->info("Updated specializations for designer matching '{$designerKey}'.");
            }
        }
    }
}
