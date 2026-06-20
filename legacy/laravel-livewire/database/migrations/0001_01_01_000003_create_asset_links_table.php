<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Sesuai SRD v6.2 Seksi 7.2 & ERD v1.0 Seksi 5.7
     */
    public function up(): void
    {
        Schema::create('asset_links', function (Blueprint $table) {
            $table->id();
            $table->string('linkable_type', 255);
            $table->unsignedBigInteger('linkable_id');
            $table->enum('provider', ['google_drive', 'dropbox', 'onedrive', 'youtube', 'other']);
            $table->string('label', 255);
            $table->text('url');
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // Composite index for polymorphic lookup — ERD Seksi 9.2
            $table->index(['linkable_type', 'linkable_id']);

            // FK constraints — ownership
            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();

            // Additional indexes — ERD Seksi 9.2
            $table->index('created_by');
            $table->index('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_links');
    }
};
