# CreativeUniverse-SubApp_PricetagGemerator_ERD

# 📐 ERD Sub-App: Pricetag Generator

**Status:** 🔒 APPROVED — Ready for Migration

**Versi:** 1.0

**Induk Dokumen:** CreativeUniverse-MainApp_ERD v1.0 & SubApp_Pricetag_SRD v1.0

## 1. Spesifikasi Entitas (Tabel)

Sesuai dengan pedoman inti, setiap tabel di Sub-App ini telah dilengkapi dengan _Ownership Columns_ (`created_by`, `updated_by`, `deleted_by`) yang berelasi ke tabel master `users` di Core App, serta menggunakan implementasi `SoftDeletes` (`deleted_at`).

### 1.1 Tabel `pricetag_categories`

Tabel master untuk menyimpan kategori produk.

|**Kolom**|**Tipe Data**|**Modifiers / Constraints**|**Deskripsi**|
|---|---|---|---|
|`id`|`BIGINT`|Primary Key, Auto Increment|ID Kategori|
|`name`|`VARCHAR(255)`|Not Null|Nama kategori|
|`created_by`|`BIGINT`|Not Null, FK -> `users.id`|Pembuat data|
|`updated_by`|`BIGINT`|Nullable, FK -> `users.id`|Pengubah data terakhir|
|`deleted_by`|`BIGINT`|Nullable, FK -> `users.id`|Penghapus data|
|`created_at`|`TIMESTAMP`|Nullable|Waktu dibuat|
|`updated_at`|`TIMESTAMP`|Nullable|Waktu diubah|
|`deleted_at`|`TIMESTAMP`|Nullable|Waktu dihapus (SoftDelete)|

### 1.2 Tabel `pricetag_products`

Tabel master untuk menyimpan produk yang terikat pada suatu kategori.

|**Kolom**|**Tipe Data**|**Modifiers / Constraints**|**Deskripsi**|
|---|---|---|---|
|`id`|`BIGINT`|Primary Key, Auto Increment|ID Produk|
|`category_id`|`BIGINT`|Not Null, FK -> `pricetag_categories.id`|Relasi ke Kategori|
|`name`|`VARCHAR(255)`|Not Null|Nama produk|
|`created_by`|`BIGINT`|Not Null, FK -> `users.id`|Pembuat data|
|`updated_by`|`BIGINT`|Nullable, FK -> `users.id`|Pengubah data terakhir|
|`deleted_by`|`BIGINT`|Nullable, FK -> `users.id`|Penghapus data|
|_(Timestamps)_|`TIMESTAMP`|`created_at`, `updated_at`, `deleted_at`|Standar audit waktu|

### 1.3 Tabel `pricetag_variants`

Tabel utama operasional tempat harga diatur dan pencarian dilakukan.

|**Kolom**|**Tipe Data**|**Modifiers / Constraints**|**Deskripsi**|
|---|---|---|---|
|`id`|`BIGINT`|Primary Key, Auto Increment|ID Varian|
|`product_id`|`BIGINT`|Not Null, FK -> `pricetag_products.id`|Relasi ke Produk|
|`sku_code`|`VARCHAR(100)`|Not Null, Unique|Kode SKU (Untuk validasi CSV)|
|`name`|`VARCHAR(255)`|Not Null|Nama varian (misal: "64GB / Hitam")|
|`normal_price`|`INTEGER`|Not Null, Default 0|Harga asli produk|
|`discount_price`|`INTEGER`|Nullable, Default 0|Harga promo/diskon saat ini|
|`created_by`|`BIGINT`|Not Null, FK -> `users.id`|Pembuat data|
|`updated_by`|`BIGINT`|Nullable, FK -> `users.id`|Pengubah data terakhir|
|`deleted_by`|`BIGINT`|Nullable, FK -> `users.id`|Penghapus data|
|_(Timestamps)_|`TIMESTAMP`|`created_at`, `updated_at`, `deleted_at`|Standar audit waktu|

### 1.4 Tabel `pricetag_batches`

Tabel pendukung untuk fitur _Multi Generate_ (Manajemen Antrean / _Chunking_).

|**Kolom**|**Tipe Data**|**Modifiers / Constraints**|**Deskripsi**|
|---|---|---|---|
|`id`|`BIGINT`|Primary Key, Auto Increment|ID Batch Queue|
|`batch_name`|`VARCHAR(255)`|Not Null|Nama proses (misal: "Promo Harbolnas")|
|`status`|`VARCHAR(50)`|Default 'pending'|`pending`, `processing`, `completed`, `failed`|
|`total_items`|`INTEGER`|Not Null|Total item dari CSV yang valid|
|`processed_items`|`INTEGER`|Default 0|Jumlah item yang berhasil di-generate|
|`created_by`|`BIGINT`|Not Null, FK -> `users.id`|User yang mengunggah CSV|
|`updated_by`|`BIGINT`|Nullable, FK -> `users.id`|Pengubah data terakhir|
|`deleted_by`|`BIGINT`|Nullable, FK -> `users.id`|Penghapus data|
|_(Timestamps)_|`TIMESTAMP`|`created_at`, `updated_at`, `deleted_at`|Standar audit waktu|

## 2. Matriks Relasi Antar Tabel (Relationship)

Bagian ini menjelaskan secara rinci kardinalitas tabel di dalam Sub-App maupun integrasinya dengan Core App.

|**Tabel Asal**|**Relasi**|**Tabel Tujuan**|**Keterangan / Tipe Relasi**|
|---|---|---|---|
|`pricetag_categories`|**One-to-Many**|`pricetag_products`|1 Kategori memiliki banyak Produk.|
|`pricetag_products`|**One-to-Many**|`pricetag_variants`|1 Produk memiliki banyak Varian.|
|`pricetag_variants`|**MorphMany**|`asset_links` _(Core)_|**(CRITICAL)** Varian memiliki banyak hasil gambar Pricetag. Disimpan di Core via _Polymorphic_.|
|`Semua Tabel Sub-App`|**Many-to-One**|`users` _(Core)_|Relasi dari `created_by`, `updated_by`, dan `deleted_by` ke `users.id`.|

## 3. Checklist Kepatuhan ERD Core

- [x] Tidak ada modifikasi atau penambahan kolom baru secara langsung ke tabel master `users`.
- [x] Link _cloud_ (Google Drive URL) tidak di-_hardcode_ di dalam tabel Sub-App, melainkan menggunakan `asset_links` dari Core.
- [x] Kepemilikan (_Ownership_) dan _SoftDeletes_ diterapkan di setiap tabel yang memungkinkan penghapusan data.
