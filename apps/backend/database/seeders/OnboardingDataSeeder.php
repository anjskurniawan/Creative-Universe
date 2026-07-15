<?php

namespace Database\Seeders;

use App\Models\Core\Division;
use Illuminate\Database\Seeder;

class OnboardingDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisionNames = [
            'Accounting',
            'Audit',
            'Business Development',
            'Creative',
            'Direktur',
            'Doran Care',
            'Finance',
            'General Affair',
            'Gudang',
            'HRD',
            'Keamanan',
            'Kebersihan',
            'Live Streamer',
            'Marketing Digital',
            'Marketing Event',
            'PA of CEO',
            'Pajak',
            'Pengiriman',
            'Product Development',
            'Programmer',
            'Retail',
            'Sales Corporate',
            'Sales Online',
            'Sales Souvenir',
            'Sales Tradisional',
            'SPG DG Mall',
            'SPG DG Street',
            'SPG JETE',
            'SPG JETE Gramedia',
            'Teknisi IT',
            'Transportasi',
            'XSpots',
        ];

        foreach ($divisionNames as $divisionName) {
            Division::firstOrCreate(['name' => $divisionName]);
        }

        $creative = Division::firstWhere('name', 'Creative');
        $creative?->positions()->firstOrCreate(['name' => 'Manajer']);
        $creative?->positions()->firstOrCreate(['name' => 'SPV']);
        $creative?->positions()->firstOrCreate(['name' => 'Designer']);
        $creative?->positions()->firstOrCreate(['name' => 'Videographer']);
    }
}
