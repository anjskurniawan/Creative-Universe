# CreativeUniverse-SubApp_PricetagGenerator_SRD

# 📄 SRD Sub-App: Pricetag Generator

**Status:** 🔒 APPROVED — Ready for Development

**Versi:** 1.0

**Induk Dokumen:** CreativeUniverse-MainApp_SRD v6.2 & ERD v1.0

## 1. Deskripsi & Ruang Lingkup

**Pricetag Generator** adalah Sub-App operasional yang dirancang untuk mengotomatisasi pembuatan gambar label harga promo/diskon menggunakan integrasi _Google Apps Script_ (GAS) dan _Google Slides_.

Aplikasi ini mendukung _Single Generate_ (via form) dan _Multi Generate_ (via _Bulk Upload_ CSV) dengan sistem antrean (_Queueing_) untuk mencegah _Time-Out_ pada _server_ dan limitasi API Google.

## 2. Struktur Navigasi & Hak Akses (RBAC)

Sub-App ini menggunakan sistem otorisasi berbasis _slug_ Spatie sesuai **SRD Seksi 6**.

_(Catatan: Statistik total data dan jumlah generate akan disematkan sebagai widget di Dashboard Root, bukan di Sub-App ini)._

|**Menu Sidebar**|**Deskripsi Fungsi**|**Hak Akses (Role/Permission)**|
|---|---|---|
|**Cari Pricetag**|Pencarian cepat _link_ gambar pricetag yang sudah ada.|Semua _User_ Sub-App|
|**Generator Pricetag**|Form tunggal berjenjang & Form unggah CSV.|Semua _User_ Sub-App|
|**Riwayat Generate**|Monitor status antrean CSV, _Progress Bar_, dan _link download_.|Semua _User_ (Data difilter per `created_by`), Root (Semua data)|
|**Manajemen Database**|CRUD data master (Kategori, Produk, Varian) & Unggah CSV untuk _Update_ Harga.|`role:root` atau _Permission_ `pricetag.manage`|

## 3. Arsitektur Database (Ekstensi ERD)

Semua tabel di bawah ini **WAJIB** mematuhi **ERD Seksi 10.5** (memiliki kolom `created_by`, `updated_by`, `deleted_by`, dan `deleted_at` untuk _SoftDeletes_).

### 3.1. Tabel Entitas Inti

- `pricetag_categories` (Kategori)
    
    - `id`, `name`
        
- `pricetag_products` (Produk & Varian)
    
    - `id`, `category_id`, `name`, `variant_name` (_Default: 'Default'_)
        
    - `normal_price`, `discount_price` (Integer)
    
    - Indeks unik komposit: `['name', 'variant_name']`
        

### 3.2. Tabel Pendukung Multi Generate

- `pricetag_batches` (Manajemen Antrean CSV)
    
    - `id`, `batch_name`
        
    - `status` (_Enum: pending, processing, completed, failed_)
        
    - `total_items`, `processed_items` (Integer)
        

### 3.3. Penyimpanan Link (_Polymorphic_)

Sesuai **ERD Seksi 2.1**, _link download_ dari Google Drive TIDAK disimpan di tabel `pricetag_variants`, melainkan di- _insert_ ke tabel `asset_links` milik _Core Main App_ dengan relasi:

- `assetable_type` = `App\Models\Pricetag\PricetagProduct`
    
- `assetable_id` = ID Produk
    

## 4. Alur Kerja (Workflows) & Performa

### 4.1. Single Generate

1. _User_ memilih data secara berjenjang: Kategori -> Produk -> Varian.
    
2. _User_ memasukkan "Harga Diskon" (Harga Normal _read-only_).
    
3. Sistem memanggil _Service Class_ API GAS (sinkron).
    
4. _Link_ Google Drive di-_generate_, disimpan ke `asset_links`, dan ditampilkan.
    

### 4.2. Multi Generate & Data Chunking (Resolusi Limitasi GAS)

Mengacu pada **SRD Seksi 2** (Batas _Shared Hosting_) dan batas waktu eksekusi skrip GAS (Maks. 6 menit):

1. _User_ mengunggah CSV berformat template khusus.
    
2. Sistem memvalidasi eksistensi kombinasi produk dan varian terhadap database. Data yang tidak valid ditolak.
    
3. Sistem membuat _record_ di `pricetag_batches`.
    
4. **Data Chunking:** Data CSV dipecah menjadi **5 item per kelompok (_chunk_)**. Mengingat 1 gambar = ~30 detik, 5 item = 150 detik (2,5 menit). Ini memberikan _safety margin_ 3,5 menit dari batas _Time-Out_ Google.
    
5. Sistem mendistribusikan _chunk_ ke _Laravel Database Queue_ (`GeneratePricetagChunkJob`).
    
6. Antarmuka Livewire Volt menggunakan `wire:poll` untuk memperbarui _Progress Bar_ (membaca kolom `processed_items`).
    

## 5. Standar Integrasi Eksternal (GAS)

Sesuai **SRD Seksi 18.4**, komunikasi dengan Web App Google Apps Script **DILARANG** dilakukan secara langsung dari Controller atau Volt SFC.

Seluruh pemanggilan API harus dibungkus dalam _Service Class_: `app/Services/GoogleAppScript/PricetagGeneratorService.php`.

## 6. Audit Trail & Keamanan

1. Perubahan "Harga Diskon" (baik via CRUD tunggal maupun CSV _Bulk Update_) WAJIB dicatat menggunakan _trait_ `LogsActivity`.
    
2. Format _prefix_ _log_ untuk Sub-App ini adalah: `[PRICETAG]`. Sesuai aturan, riwayat ini bisa dilacak ke `users.id` yang bersangkutan.
    

Silakan simpan dokumen di atas sebagai panduan tertulis kita. Apabila Anda sudah siap, silakan instruksikan saya untuk mulai membuat kode _Database Migration_ dan _Model_ berdasarkan struktur SRD di atas.