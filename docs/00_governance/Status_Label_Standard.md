---
title: "Status Label Standard"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
---

# Status Label Standard

Dokumen ini mendefinisikan secara baku standar label status yang disematkan pada setiap berkas, fitur, modul, rute, skema database, dan dokumen di dalam ekosistem Creative Universe.

## 1. Definisi Status Label & Contoh Kasus

### ACTIVE
Fitur atau berkas yang saat ini terpasang aktif di dalam kode monorepo repositori baru (`apps/backend` dan `apps/frontend`) dan dapat diakses/dijalankan.
* **Contoh:** Controller [AIAgentController.php](file:///c:/laragon/www/creativeuniverse/apps/backend/app/Http/Controllers/Api/AIAgentController.php) yang mengelola pengiriman pesan ke Gemini API.

### VERIFIED_ACTIVE
Fitur yang tidak hanya aktif di dalam kode, tetapi sudah teruji kelulusannya oleh test suite (PHPUnit) atau divalidasi berhasil lewat build/linting statis.
* **Contoh:** Rute autentikasi `POST /api/v1/auth/login` yang terbukti lulus pada berkas pengujian [AuthApiTest.php](file:///c:/laragon/www/creativeuniverse/apps/backend/tests/Feature/Api/AuthApiTest.php).

### TARGET
Fitur atau dokumen spesifikasi rancangan masa depan yang belum diimplementasikan di dalam kode aplikasi aktif.
* **Contoh:** Rute `DELETE /profile` yang direncanakan pada SRD tetapi belum dibuatkan kodenya di berkas rute.

### LEGACY
Seluruh kode program, skema database lama, atau dokumentasi terdahulu dari era Laravel Livewire monolit sebelum refaktor dimulai.
* **Contoh:** Berkas controller Livewire di [laravel-livewire](file:///c:/laragon/www/creativeuniverse/legacy/laravel-livewire/) yang kini berstatus read-only.

### DEPRECATED
Bagian kode atau endpoint yang masih aktif berjalan untuk menjaga kompatibilitas ke belakang (backwards compatibility), tetapi tidak direkomendasikan untuk pengembangan baru dan akan segera dihapus di milestone penutupan.
* **Contoh:** Rute alias `/pricetag-categories` yang dipertahankan sementara di `routes/api.php` tetapi digantikan oleh `/pricetag/categories`.

### ARCHIVED
Berkas (terutama berkas teks/dokumentasi atau CSV temporer) yang tidak lagi digunakan dan siap untuk dipindahkan ke folder `trash/YYYY-MM-DD/`.
* **Contoh:** Dokumentasi usang versi 1.5 [pricetag_generator_V1_5_Documentation.md](file:///c:/laragon/www/creativeuniverse/docs/02_pricetag_generator/pricetag_generator_V1_5_Documentation.md).

### NEEDS_REVIEW
Kode, berkas, atau keputusan bisnis yang terdeteksi memiliki kontradiksi atau ketidakjelasan arsitektur, sehingga memerlukan intervensi tinjauan manual sebelum dieksekusi.
* **Contoh:** Penggunaan sentinel spasi tunggal `" "` pada field `variant_name` di database untuk menghindari collision indeks unik variant produk.

---

## 2. Aturan Penyematan Status pada Berkas
Setiap dokumen markdown baru atau modifikasi wajib menyertakan status ini di bagian YAML frontmatter paling atas berkas:
```yaml
---
title: "Nama Berkas"
status: "ACTIVE | VERIFIED_ACTIVE | TARGET | LEGACY | DEPRECATED | ARCHIVED | NEEDS_REVIEW"
version: "X.X"
revised: "YYYY-MM-DD"
---
```
Jika status berkas berubah (misalnya dari DRAFT/TARGET menjadi ACTIVE), frontmatter wajib diperbarui pada commit yang sama dengan implementasi kodenya.
