# CreativeUniverse-SubApp_PricetagGenerator_ERD

# 📐 ERD Sub-App: Pricetag Generator

**Status:** APPROVED — Database Baseline

**Versi:** 1.1

**Induk Dokumen:** CreativeUniverse-MainApp_ERD v1.2 & SubApp_Pricetag_SRD v1.1

## 1. Spesifikasi Entitas (Tabel)

Tabel master dan header batch memiliki ownership serta `SoftDeletes`. Tabel detail `pricetag_batch_items` mengikuti migration aktual sebagai child lifecycle dari batch dan tidak memiliki ownership/soft delete terpisah.

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

Tabel master untuk menyimpan produk dan varian beserta harganya.

|**Kolom**|**Tipe Data**|**Modifiers / Constraints**|**Deskripsi**|
|---|---|---|---|
|`id`|`BIGINT`|Primary Key, Auto Increment|ID Produk|
|`category_id`|`BIGINT`|Not Null, FK -> `pricetag_categories.id`|Relasi ke Kategori|
|`name`|`VARCHAR(255)`|Not Null|Nama produk|
|`variant_name`|`VARCHAR(100)`|Nullable, Default 'Default'|Nama variasi (misal: "Hitam")|
|`normal_price`|`INTEGER`|Not Null, Default 0|Harga asli produk|
|`discount_price`|`INTEGER`|Nullable, Default 0|Harga promo/diskon saat ini|
|`created_by`|`BIGINT`|Not Null, FK -> `users.id`|Pembuat data|
|`updated_by`|`BIGINT`|Nullable, FK -> `users.id`|Pengubah data terakhir|
|`deleted_by`|`BIGINT`|Nullable, FK -> `users.id`|Penghapus data|
|_(Timestamps)_|`TIMESTAMP`|`created_at`, `updated_at`, `deleted_at`|Standar audit waktu|

### 1.3 Tabel `pricetag_batches`

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

### 1.4 Tabel `pricetag_batch_items`

Tabel detail untuk mencatat hasil setiap produk di dalam batch.

|**Kolom**|**Tipe Data**|**Modifiers / Constraints**|**Deskripsi**|
|---|---|---|---|
|`id`|`BIGINT`|Primary Key, Auto Increment|ID batch item|
|`batch_id`|`BIGINT`|Not Null, FK -> `pricetag_batches.id`, cascade delete|Batch pemilik|
|`product_id`|`BIGINT`|Not Null, FK -> `pricetag_products.id`, cascade delete|Produk yang diproses|
|`status`|`VARCHAR(50)`|Default `pending`|`pending`, `success`, `failed`|
|`error_message`|`TEXT`|Nullable|Detail kegagalan aman untuk operator|
|`created_at`, `updated_at`|`TIMESTAMP`|Nullable|Laravel timestamps|

## 2. Matriks Relasi Antar Tabel (Relationship)

Bagian ini menjelaskan secara rinci kardinalitas tabel di dalam Sub-App maupun integrasinya dengan Core App.

|**Tabel Asal**|**Relasi**|**Tabel Tujuan**|**Keterangan / Tipe Relasi**|
|---|---|---|---|
|`pricetag_categories`|**One-to-Many**|`pricetag_products`|1 Kategori memiliki banyak Produk.|
|`pricetag_products`|**MorphMany**|`asset_links` _(Core)_|**(CRITICAL)** Produk memiliki banyak hasil gambar Pricetag. Disimpan di Core via _Polymorphic_.|
|`pricetag_batches`|**One-to-Many**|`pricetag_batch_items`|Satu batch memiliki banyak hasil item.|
|`pricetag_products`|**One-to-Many**|`pricetag_batch_items`|Satu produk dapat muncul pada banyak batch.|
|`pricetag_categories`, `pricetag_products`, `pricetag_batches`|**Many-to-One**|`users` _(Core)_|Relasi ownership ke `users.id`.|

Relasi polymorphic produk ke `asset_links` menggunakan nama resmi `linkable_type` dan `linkable_id` sesuai migration aktual.

## 3. Checklist Kepatuhan ERD Core

- [x] Tidak ada modifikasi atau penambahan kolom baru secara langsung ke tabel master `users`.
- [x] Link _cloud_ (Google Drive URL) tidak di-_hardcode_ di dalam tabel Sub-App, melainkan menggunakan `asset_links` dari Core.
- [x] Ownership dan `SoftDeletes` diterapkan pada tabel master/header; `pricetag_batch_items` mengikuti lifecycle batch.
