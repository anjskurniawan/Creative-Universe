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
        $audio = PricetagCategory::withTrashed()->firstOrCreate(['name' => 'Audio'], ['created_by' => $userId]);
        if ($audio->trashed()) {
            $audio->restore();
        }
        $powerbank = PricetagCategory::withTrashed()->firstOrCreate(['name' => 'Powerbank'], ['created_by' => $userId]);
        if ($powerbank->trashed()) {
            $powerbank->restore();
        }

        // 2. Products (carrying pricing)
        $p1 = PricetagProduct::withTrashed()->where([
            'name' => 'JETE TWS T10',
            'variant_name' => 'Black',
        ])->first();
        if ($p1) {
            if ($p1->trashed()) {
                $p1->restore();
            }
            $p1->update([
                'category_id' => $audio->id,
                'normal_price' => 399000,
                'discount_price' => 199000,
                'created_by' => $userId,
            ]);
        } else {
            PricetagProduct::create([
                'name' => 'JETE TWS T10',
                'variant_name' => 'Black',
                'category_id' => $audio->id,
                'normal_price' => 399000,
                'discount_price' => 199000,
                'created_by' => $userId,
            ]);
        }

        $p2 = PricetagProduct::withTrashed()->where([
            'name' => 'JETE TWS T10',
            'variant_name' => 'White',
        ])->first();
        if ($p2) {
            if ($p2->trashed()) {
                $p2->restore();
            }
            $p2->update([
                'category_id' => $audio->id,
                'normal_price' => 399000,
                'discount_price' => 199000,
                'created_by' => $userId,
            ]);
        } else {
            PricetagProduct::create([
                'name' => 'JETE TWS T10',
                'variant_name' => 'White',
                'category_id' => $audio->id,
                'normal_price' => 399000,
                'discount_price' => 199000,
                'created_by' => $userId,
            ]);
        }

        $p3 = PricetagProduct::withTrashed()->where([
            'name' => 'JETE Powerbank H1',
            'variant_name' => 'Black',
        ])->first();
        if ($p3) {
            if ($p3->trashed()) {
                $p3->restore();
            }
            $p3->update([
                'category_id' => $powerbank->id,
                'normal_price' => 299000,
                'discount_price' => 149000,
                'created_by' => $userId,
            ]);
        } else {
            PricetagProduct::create([
                'name' => 'JETE Powerbank H1',
                'variant_name' => 'Black',
                'category_id' => $powerbank->id,
                'normal_price' => 299000,
                'discount_price' => 149000,
                'created_by' => $userId,
            ]);
        }
    }
}
