---
title: "Source of Truth Rules"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
---

# Source of Truth Rules

Dokumen ini menetapkan tata kelola, hirarki, dan protokol penyelesaian konflik kebenaran sumber data (Source of Truth) untuk proyek Creative Universe. Semua pengerjaan refaktor dan pemeliharaan wajib tunduk pada aturan ini.

## 1. Hirarki Sumber Kebenaran

Jika terdapat ketidaksesuaian atau kontradiksi antara dokumen teknis, draf, dan kode aktual, urutan prioritas penyelesaian adalah sebagai berikut:

1. **Architecture Decision Records (ADR)** yang berstatus `APPROVED` (berada di folder `docs/00_architecture/`). Ini menetapkan keputusan tingkat tinggi tentang hosting, domain, dan otentikasi.
2. **Software Requirements Documents (SRD)** aktif untuk Backend REST API (`docs/03_backend_api/`) dan Frontend Next.js (`docs/04_frontend_nextjs/`).
3. **Spesifikasi Modul / Sub-App** (Core, Pricetag, ODDS) yang berstatus `ACTIVE` atau `APPROVED`.
4. **Kode Aktual / Test Suite** yang telah berjalan dan teruji lulus (`apps/backend` dan `apps/frontend`).
5. **Logika Bisnis Legacy** di dalam `legacy/laravel-livewire/` (hanya digunakan untuk referensi logika/rumus perhitungan).

## 2. Penanganan Konflik Kode vs Dokumentasi

Ketika ditemukan ketidaksesuaian antara kode yang sedang berjalan dengan dokumen spesifikasi:

* **Skenario A: Kode Benar & Dokumen Outdated**  
  Jika kode aktual berfungsi dengan benar, lulus test suite, dan disetujui secara visual oleh pengguna, namun dokumen spesifikasi masih memuat rancangan lama:
  * **Protokol:** Dokumentasi harus diperbarui agar sinkron dengan kode aktual. Perubahan dokumen dan kode harus dicatat dalam commit yang sama.
* **Skenario B: Kode Salah/Deviasi & Dokumen Benar**  
  Jika implementasi kode menyimpang dari SRD atau ADR tanpa persetujuan arsitektur:
  * **Protokol:** Kode harus direfaktor agar patuh pada dokumen spesifikasi, setelah divalidasi keamanannya.
* **Skenario C: Ambiguitas Logika Bisnis**  
  Jika spesifikasi tertulis dan implementasi aktual sama-sama tidak memberikan kejelasan (misalnya pada penanganan data anomali):
  * **Protokol:** Tandai bagian tersebut sebagai `NEEDS_REVIEW`, hentikan eksekusi sepihak, dan minta keputusan tertulis dari Project Owner sebelum melanjutkan pengodean.

## 3. Resolusi Status Label

Setiap fitur, berkas, endpoint, dan dokumen wajib dikelompokkan ke dalam label status berikut:

* `ACTIVE`: Diimplementasikan dan berjalan pada kode repositori baru.
* `VERIFIED_ACTIVE`: Telah diuji kelulusannya oleh unit/feature test atau inspeksi manual build.
* `TARGET`: Rencana pengembangan masa depan yang belum ditulis kodenya.
* `LEGACY`: Snapshot lama yang read-only; dilarang dimodifikasi tetapi valid sebagai referensi logika bisnis.
* `DEPRECATED`: Fitur/kode lama yang masih terpasang tetapi tidak lagi direkomendasikan dan akan segera dihapus.
* `ARCHIVED`: Berkas yang tidak digunakan lagi dan telah siap dipindahkan ke direktori `trash/`.
* `NEEDS_REVIEW`: Isu yang belum jelas kepemilikan bisnisnya dan membutuhkan konfirmasi.

## 4. Pengaruh Audit terhadap Dokumentasi

Hasil audit berkala pada `docs/99_cleanup/Repository_And_Docs_Audit.md` berfungsi sebagai bukti dasar (baseline evidence). Setiap agen baru wajib membaca laporan audit untuk mengetahui status terkini proyek sebelum menyusun rancangan kerja atau memodifikasi kode.
