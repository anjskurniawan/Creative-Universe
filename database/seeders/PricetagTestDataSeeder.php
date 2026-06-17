<?php

namespace Database\Seeders;

use App\Models\Core\User;
use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Illuminate\Database\Seeder;

class PricetagTestDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@creativeuniverse.test')->first();
        if (! $admin) {
            $admin = User::first();
        }

        $userId = $admin ? $admin->id : 1;

        // 1. Categories
        $audio = PricetagCategory::firstOrCreate(['name' => 'Audio'], ['created_by' => $userId]);
        $powerbank = PricetagCategory::firstOrCreate(['name' => 'Powerbank'], ['created_by' => $userId]);

        // 2. Products (carrying pricing)
        PricetagProduct::firstOrCreate(
            ['name' => 'JETE TWS T10', 'variant_name' => 'Black'],
            [
                'category_id' => $audio->id,
                'normal_price' => 399000,
                'discount_price' => 199000,
                'created_by' => $userId,
            ]
        );

        PricetagProduct::firstOrCreate(
            ['name' => 'JETE TWS T10', 'variant_name' => 'White'],
            [
                'category_id' => $audio->id,
                'normal_price' => 399000,
                'discount_price' => 199000,
                'created_by' => $userId,
            ]
        );

        PricetagProduct::firstOrCreate(
            ['name' => 'JETE Powerbank H1', 'variant_name' => 'Black'],
            [
                'category_id' => $powerbank->id,
                'normal_price' => 299000,
                'discount_price' => 149000,
                'created_by' => $userId,
            ]
        );
    }
}
