<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Mengganti nilai sentinel 'Default' pada kolom variant_name menjadi spasi tunggal.
 * Produk tanpa varian kini disimpan sebagai ' ' (default kolom).
 */
return new class extends Migration
{
    public function up(): void
    {
        // Konversi data lama: 'Default', string kosong, dan NULL menjadi spasi tunggal.
        DB::table('pricetag_products')
            ->whereIn('variant_name', ['Default', ''])
            ->orWhereNull('variant_name')
            ->update(['variant_name' => ' ']);

        // Ubah kolom agar NOT NULL dengan default spasi tunggal.
        // Gunakan Blueprint::change() agar Laravel menangani sintaks per-database (MySQL/SQLite).
        Schema::table('pricetag_products', function (Blueprint $table) {
            $table->string('variant_name', 100)->default(' ')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        // Kembalikan kolom ke kondisi semula: nullable dengan default 'Default'.
        Schema::table('pricetag_products', function (Blueprint $table) {
            $table->string('variant_name', 100)->default('Default')->nullable()->change();
        });

        // Rollback data spasi tunggal kembali menjadi 'Default'.
        DB::table('pricetag_products')
            ->where('variant_name', ' ')
            ->update(['variant_name' => 'Default']);
    }
};
