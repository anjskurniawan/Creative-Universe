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
        Schema::create('pricetag_batch_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('batch_id');
            $table->unsignedBigInteger('product_id');
            $table->string('status', 50)->default('pending'); // pending, success, failed
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->foreign('batch_id')->references('id')->on('pricetag_batches')->cascadeOnDelete();
            $table->foreign('product_id')->references('id')->on('pricetag_products')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricetag_batch_items');
    }
};
