# Dokumentasi Teknis Master: Creative Universe v1.8

Dokumen ini merupakan panduan arsitektur, teknis, dan cetak biru kode utama untuk sistem **Creative Universe**, sebuah aplikasi hub berbasis web (Super-App) yang dikembangkan untuk divisi Creative PT. Doran Sukses Indonesia (JETE). Dokumen ini berfungsi sebagai referensi serah terima (handover) tingkat tinggi yang memetakan seluruh komponen sistem, logika bisnis, keamanan, alur kerja sub-aplikasi, kode file, detail fungsi, parameter, serta panduan pengembangan secara mandiri.

---

## 1. Arsitektur Global & Standardisasi Sistem

Creative Universe dirancang dengan arsitektur monolitik modular yang bersih. Sistem ini memisahkan logika bisnis inti (Core) dengan sub-aplikasi operasional secara struktural, namun tetap berbagi basis data dan sistem otentikasi yang sama.

### 1.1 Stack Teknologi Inti
Sistem dibangun di atas ekosistem Laravel modern dengan komponen sebagai berikut:
* **Framework Backend**: Laravel 11.x (PHP 8.2+)
* **Engine Frontend**: Livewire 3.x (termasuk Volt Single File Component untuk interaksi reaktif)
* **CSS Framework**: Tailwind CSS (dikompilasi secara lokal melalui Vite)
* **Interaktivitas Client**: AlpineJS (terintegrasi dengan Livewire)
* **Database**: MySQL 8.x atau MariaDB 10.x
* **Layanan Pihak Ketiga**: Pusher (Real-time Broadcasting) dan Fonnte (WhatsApp Gateway)

### 1.2 Struktur Folder dan Manajemen File
Demi menjaga kerapihan dan memudahkan pemeliharaan jangka panjang (arsip tingkat tinggi), struktur folder diatur secara modular:
* **Routing Modular**: Rute aplikasi tidak menumpuk di file `web.php` bawaan, melainkan dipisahkan ke dalam folder `routes/modules/`. File `web.php` hanya bertugas mengimpor rute-rute modul tersebut (misalnya `core.php` dan `pricetag.php`).
* **Namespace Terpisah**: Kode backend diorganisasikan di dalam namespace `App\Http\Controllers\Core` untuk sistem utama dan namespace terpisah seperti `App\Models\Pricetag` dan `App\Livewire\Pricetag` untuk sub-aplikasi.
* **Standardisasi Penamaan Database**: Setiap tabel yang dibuat oleh sub-aplikasi wajib menggunakan prefix unik (contoh: `pricetag_categories`, `pricetag_products`). Penamaan kolom audit kepemilikan (`created_by`, `updated_by`, `deleted_by`) dan kolom timestamps (`created_at`, `updated_at`, `deleted_at`) diseragamkan di seluruh tabel database.
* **Folder Favicon Terstruktur**: Seluruh berkas pendukung ikon web (favicon pack) disentralisasi di dalam direktori `public/favicons/` untuk menjaga kerapihan direktori root public. Berkas manifest `site.webmanifest` dikonfigurasi untuk membaca ikon di folder ini.

---

## 2. Fitur Core (Master App)

Sistem Core menyediakan infrastruktur dasar seperti manajemen pengguna, autentikasi, otorisasi, pencatatan aktivitas, serta layanan komunikasi global.

### 2.1 Pendaftaran Akun & Alur Persetujuan (Approval)
Pendaftaran akun memerlukan persetujuan administrator sebelum akun dapat aktif digunakan.

### 2.2 Otorisasi Dinamis & RBAC (Role-Based Access Control)
Manajemen otorisasi tingkat lanjut berbasis peran dan izin (roles & permissions).

### 2.3 Sesi Perangkat & Log Aktivitas (Security Module)
Pelacakan aktivitas pengguna dan manajemen sesi perangkat aktif untuk keamanan sistem.

### 2.4 Real-Time Broadcasting & Notifikasi WhatsApp
Integrasi komunikasi real-time dan notifikasi pihak ketiga.

### 2.5 Panel Pemeliharaan (Maintenance Panel)
Panel kontrol untuk menjalankan perintah pemeliharaan Laravel (artisan commands) dengan sekali klik.

### 2.6 Dashboard & Pemantauan Sistem (Kapasitas Root)
Statistik dan monitoring performa sistem secara visual.

---

## 3. Sub-App: Pricetag Generator

**Pricetag Generator** adalah sub-aplikasi yang digunakan untuk membuat gambar label harga promo atau diskon secara otomatis melalui integrasi dengan Google Slides dan Google Apps Script (GAS).

### 3.1 Alur Kerja Pencarian & Pembuatan (Generate)
Sub-aplikasi ini memisahkan alur pencarian (Cari Pricetag) dan alur pembuatan (Generator):
1. **Cari Pricetag (Alur Pencarian Dua Tahap)**:
   * **Tahap 1 (Kategori)**: Tampilan awal menyajikan daftar kategori dalam bentuk grid kartu compact. Setiap kartu kategori memiliki ikon di sisi kiri, serta satu grup teks di sebelah kanan yang menyusun Jumlah Produk di baris atas dan Nama Kategori di baris bawah secara sejajar. Input pencarian di tahap ini hanya menyaring nama kategori.
   * **Tahap 2 (Produk)**: Ketika kategori diklik, sistem berpindah menampilkan grid produk/varian di bawah kategori tersebut. Input pencarian otomatis beralih untuk menyaring nama produk dan varian secara real-time. Kartu produk menerapkan sistem *collapse* & *expand* (terlipat secara default dengan menampilkan nama produk & varian secara sejajar menyamping; detail lain tersembunyi). Grid produk disetel menggunakan parameter `items-start` sehingga ketika satu kartu di-expand, tinggi kartu lain pada baris yang sama tidak ikut meregang. Disediakan tombol navigasi "Kembali ke Kategori" untuk mengembalikan tampilan ke daftar kategori awal.
   * **Daftar Universal & Status**: Daftar produk bersifat universal (lintas pengguna) dan menampilkan semua produk (baik yang sudah digenerate maupun belum). Status produk ditunjukkan dengan label `Ready` (jika memiliki asset links) atau `Tidak Ready` (jika belum pernah digenerate).
   * **Tiga Tombol Aksi (Expanded)**: Setiap kartu produk memiliki area detail yang jika di-expand menampilkan nama kategori, status, detail harga (normal & promo), waktu update terakhir, serta tombol **Download** (Google Drive download link, dinonaktifkan jika belum ready), **Preview** (Google Drive view link, dinonaktifkan jika belum ready), dan **Edit** (mengarahkan pengguna langsung ke tab Single Generator untuk produk tersebut).
2. **Single Generate (Pembuatan Tunggal)**:
   * **Langkah 1 (Kategori)**: Daftar kategori bawaan sengaja disembunyikan. Hanya kotak pencarian (search bar) kategori saja yang terlihat secara default. Daftar kategori baru akan muncul apabila operator telah mengetik kata kunci pencarian.
   * **Langkah 5 (Memproses)**: Animasi progress bar berjalan secara gradual dan realistis (0% naik perlahan ke 90% menggunakan durasi simulasi Alpine.js, kemudian terisi penuh ke 100% setelah respon server diperoleh, barulah berpindah ke Langkah 6).
   * **Langkah 6 (Selesai)**: Menampilkan hasil pembuatan label promo dengan opsi pratinjau dan unduh langsung. Ikon sukses di langkah ini dilengkapi animasi pulse & ping yang dinamis untuk visualisasi interaktif.
   * Pengguna memilih kategori produk, nama produk, dan varian secara berjenjang (dropdown dinamis), atau diarahkan langsung dari menu pencarian via tautan edit.
   * Nilai harga normal ditampilkan sebagai kolom readonly, sedangkan harga diskon diinput secara manual pada Langkah 4.
   * Sistem melakukan panggilan API sinkron ke Web App Google Apps Script (GAS) menggunakan kelas layanan `PricetagGeneratorService`.
   * GAS memproses template Google Slides, menghasilkan gambar label harga, menyimpannya di Google Drive, dan mengembalikan tautan hasil generate ke Laravel untuk disimpan di database.
3. **Multi Generate (Pembuatan Massal via CSV)**:
   * Pengguna mengunggah berkas CSV yang berisi daftar produk, varian, dan harga diskon.
   * Berkas divalidasi terlebih dahulu terhadap database produk yang ada.
   * Baris data yang valid dipecah menjadi beberapa bagian (Chunking) dengan ukuran **5 item per kelompok**.
   * Pemecahan ini krusial untuk menghindari batas waktu eksekusi skrip Google Apps Script (maksimal 6 menit) dan batas waktu eksekusi server shared hosting.

### 3.2 Sistem Antrean (Laravel Queue) & Progress Bar
Antrean pemrosesan terintegrasi untuk menangani pekerjaan massal secara asinkron.

### 3.3 Penyimpanan Tautan Aset Secara Polymorphic
Asset links disimpan secara dinamis menggunakan relasi polymorphic.

### 3.4 Manajemen Database Sub-App
Pengelolaan database kategori dan produk untuk sub-app.

---

## 4. Cetak Biru Kode (Code Blueprint) & Detail Fungsi

Bagian ini menyajikan dokumentasi teknis mendalam untuk setiap kelas kode utama, middleware, model, aksi bisnis, dan komponen Livewire dalam ekosistem Creative Universe. Dokumentasi ini disusun untuk memudahkan pemahaman fungsi individual secara mandiri.

### 4.1 Aksi Bisnis Utama (`app/Actions/Core`)
Aksi bisnis inti diatur secara terpusat untuk menjaga konsistensi logika aplikasi.

### 4.5 Komponen Livewire Utama (`app/Livewire`)

#### 4.5.1 `Generator` (Pricetag Sub-App)
* **Lokasi File**: `app/Livewire/Pricetag/Generator.php`
* **Tujuan**: Menyediakan mesin antar-muka pembuatan gambar pricetag secara interaktif.
* **Fungsi Utama**:
  * `mount()`: Mendeteksi parameter query `product_id` di URL. Jika ditemukan, sistem memuat data produk secara otomatis, mengatur tab aktif ke `'single'`, dan menetapkan `$wizardStep` langsung ke `4` (Langkah Form Input Harga Promo) sehingga operator dapat langsung mengganti harga diskon tanpa melalui langkah pemilihan dari awal.
  * `processSingleGeneration(PricetagGeneratorService $generatorService)`: Memanggil layanan `PricetagGeneratorService` secara sinkron dan mencatat history. Setelah selesai, ia menembakkan browser event `generation-finished` dengan parameter status keberhasilan, daripada merubah `wizardStep` secara langsung.
  * `finishGeneration(bool $success)`: Method penyelesaian akhir yang dipanggil dari frontend. Jika sukses, memindahkan `wizardStep` ke `6` (Selesai); jika gagal, mengembalikan ke `4` (Atur Harga).
  * `generateSingleWizard()`: Memvalidasi harga diskon baru untuk pembuatan tunggal (Single Generate) dan mengarahkan step alur ke status pemrosesan.
  * `generateChecklist()`: Memproses pembuatan berkas massal berbasis daftar pilihan produk dengan cara membuat record `PricetagBatch` dan membagi antrean data ke dalam queue pekerjaan dalam ukuran masing-masing 5 produk.
  * `generateBulk()`: Memproses pengunggahan berkas CSV untuk pencetakan massal, membaca separator (koma atau titik koma), memvalidasi kecocokan nama produk dan varian terhadap database, lalu membagi antrean pekerjaan pencetakan ke sistem queue database.

#### 4.5.7 `Search` (Pricetag Sub-App)
Komponen Livewire untuk pencarian dan pemantauan status pricetag.

---

## 5. Standar Keamanan & Deployment (Shared Hosting cPanel)
Sistem dikonfigurasi untuk bekerja secara aman pada lingkungan shared hosting.

---

## 6. Referensi File & Panduan Obsidian

* **Spesifikasi Kebutuhan Sistem Inti**: [[docs/01_core_system/CreativeUniverse-MainApp_SRD.md|SRD Core System]]
* **Desain Basis Data Inti**: [[docs/01_core_system/CreativeUniverse-MainApp_ERD.md|ERD Core System]]
* **Spesifikasi Kebutuhan Generator Pricetag**: [[docs/02_pricetag_generator/CreativeUniverse-SubApp_PricetagGenerator_SRD.md|SRD Pricetag Generator]]
* **Desain Basis Data Generator Pricetag**: [[docs/02_pricetag_generator/CreativeUniverse-SubApp_PricetagGenerator_ERD.md|ERD Pricetag Generator]]
* **Dokumentasi API Google Apps Script**: [[docs/02_pricetag_generator/PricetagGenerator_GoogleAppScript.md|GAS Integration Guide]]
* **Panduan Operasional Generator Pricetag**: [[docs/02_pricetag_generator/pricetag_generator_V1_5_Documentation.md|Operational Guide v1.5]]

Dokumen master ini akan terus diperbarui seiring dengan penambahan fitur baru, perbaikan bug, maupun perubahan kebijakan teknis dalam ekosistem Creative Universe.
