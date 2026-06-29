<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Core\Division;

class OnboardingDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $creative = Division::firstOrCreate(['name' => 'Creative']);
        $creative->positions()->firstOrCreate(['name' => 'Designer']);
        $creative->positions()->firstOrCreate(['name' => 'Videographer']);

        $marketing = Division::firstOrCreate(['name' => 'Marketing']);
        $marketing->positions()->firstOrCreate(['name' => 'Staff Marketing']);

        $produkManager = Division::firstOrCreate(['name' => 'Produk Manager']);
        $produkManager->positions()->firstOrCreate(['name' => 'Staff Produk']);
    }
}
