<?php

namespace Database\Seeders;

use App\Models\Core\AssetLink;
use App\Models\Core\User;
use App\SubApps\Generator\Pricetag\Models\PricetagCategory;
use App\SubApps\Generator\Pricetag\Models\PricetagProduct;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PricetagTestDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Drop/Truncate all pricetag database tables
        Schema::disableForeignKeyConstraints();

        DB::table('generator_pricetag_batch_items')->truncate();
        DB::table('generator_pricetag_batches')->truncate();
        DB::table('generator_pricetag_products')->truncate();
        // DB::table('generator_pricetag_categories')->truncate(); // Do not delete existing categories

        // Also clean up polymorphic asset links for products
        AssetLink::where('linkable_type', PricetagProduct::class)->delete();

        Schema::enableForeignKeyConstraints();

        // Get admin/root user ID for ownership
        $admin = User::where('email', 'admin@creativeuniverse.test')->first();
        if (! $admin) {
            $admin = User::first();
        }

        $userId = $admin ? $admin->id : 1;

        // 2. Read and parse CSV file
        $csvPath = database_path('seeders/data/DB Produk Sementara.csv');
        if (! file_exists($csvPath)) {
            $this->command->error("CSV file not found at: {$csvPath}");
            $this->command->error('Please place the CSV file in apps/backend/database/seeders/data/ to run this seeder.');

            return;
        }

        $file = fopen($csvPath, 'r');
        $header = fgetcsv($file); // Skip header

        $categoriesMap = []; // name => id

        // Preload existing categories so we don't recreate them
        $existingCategories = PricetagCategory::all();
        foreach ($existingCategories as $cat) {
            $categoriesMap[$cat->name] = $cat->id;
        }

        $defaultCategories = [
            'Smarthome Devices',
            'Smart Wearables',
            'Headphone',
            'Speaker',
            'Mobile Power & Connectivity',
            'Device Tracking',
            'Bag',
            'Computer Peripherals',
            'Storage',
            'Remote Collaboration',
            'Content Creation Essentials',
            'Phone Accessories',
        ];

        foreach ($defaultCategories as $name) {
            if (! isset($categoriesMap[$name])) {
                $category = PricetagCategory::create([
                    'name' => $name,
                    'created_by' => $userId,
                ]);
                $categoriesMap[$name] = $category->id;
            }
        }

        while (($row = fgetcsv($file)) !== false) {
            if (count($row) < 5) {
                continue;
            } // Skip invalid rows

            $categoryName = trim($row[0]);
            $productName = trim($row[1]);
            $variantName = trim($row[2]) ?: ' ';
            $normalPrice = intval(preg_replace('/[^0-9]/', '', $row[3]));
            $discountPriceRaw = trim($row[4]);
            $discountPrice = $discountPriceRaw === '' ? null : intval(preg_replace('/[^0-9]/', '', $discountPriceRaw));

            if (! isset($categoriesMap[$categoryName])) {
                $category = PricetagCategory::create([
                    'name' => $categoryName,
                    'created_by' => $userId,
                ]);
                $categoriesMap[$categoryName] = $category->id;
            }

            PricetagProduct::create([
                'category_id' => $categoriesMap[$categoryName],
                'name' => $productName,
                'variant_name' => $variantName,
                'normal_price' => $normalPrice,
                'discount_price' => $discountPrice,
                'created_by' => $userId,
            ]);
        }
        fclose($file);

        $this->command->info('Seeded products and categories from DB Produk Sementara.csv');
    }
}
