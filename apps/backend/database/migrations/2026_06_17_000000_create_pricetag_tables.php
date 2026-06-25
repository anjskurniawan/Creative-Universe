<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Kategori
        Schema::create('pricetag_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);

            // Ownership & SoftDeletes
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
        });

        // 2. Produk (holding pricing directly)
        Schema::create('pricetag_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->string('name', 255);
            $table->string('variant_name', 100)->default(' ');
            $table->integer('normal_price')->default(0);
            $table->integer('discount_price')->nullable()->default(0);

            $table->unique(['name', 'variant_name']);

            // Ownership & SoftDeletes
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('pricetag_categories')->cascadeOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
        });

        // 3. Batches (Manajemen Antrean)
        Schema::create('pricetag_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_name', 255);
            $table->string('status', 50)->default('pending'); // pending, processing, completed, failed
            $table->integer('total_items');
            $table->integer('processed_items')->default(0);

            // Ownership & SoftDeletes
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricetag_batches');
        Schema::dropIfExists('pricetag_products');
        Schema::dropIfExists('pricetag_categories');
    }
};
