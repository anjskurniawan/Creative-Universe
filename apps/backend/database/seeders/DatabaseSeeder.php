<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Idempotent seeder - aman dijalankan berulang kali.
     */
    public function run(): void
    {
        // Seed fondasi hosting terlebih dahulu (tanpa data demo/transaksi).
        $this->call(ProductionDatabaseSeeder::class);

        // Data katalog contoh hanya untuk full seeder lokal/development.
        $this->call(PricetagTestDataSeeder::class);
    }
}
