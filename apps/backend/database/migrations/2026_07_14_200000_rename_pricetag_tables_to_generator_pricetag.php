<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('pricetag_categories', 'generator_pricetag_categories');
        Schema::rename('pricetag_products', 'generator_pricetag_products');
        Schema::rename('pricetag_batches', 'generator_pricetag_batches');
        Schema::rename('pricetag_batch_items', 'generator_pricetag_batch_items');
    }

    public function down(): void
    {
        Schema::rename('generator_pricetag_batch_items', 'pricetag_batch_items');
        Schema::rename('generator_pricetag_batches', 'pricetag_batches');
        Schema::rename('generator_pricetag_products', 'pricetag_products');
        Schema::rename('generator_pricetag_categories', 'pricetag_categories');
    }
};
