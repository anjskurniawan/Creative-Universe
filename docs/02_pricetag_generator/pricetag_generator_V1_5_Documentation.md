# Pricetag Generator Sub-App V1.5 Documentation

> **Status:** Legacy UI Reference
> Dokumen ini menjelaskan implementasi Laravel Livewire yang menjadi baseline migrasi. Requirement bisnis dan UX tetap berlaku; target teknis baru berada di `docs/03_backend_api/Laravel_REST_API_SRD.md` dan `docs/04_frontend_nextjs/NextJS_Frontend_SRD.md`.

Welcome to the official documentation for the **Pricetag Generator** sub-app within the *Creative Universe* project. This document serves as a complete technical guide, detailing the system architecture, database structure, Google Apps Script integration, key features, local setup, and testing procedures.

---

## 📂 Table of Contents
1. [[#1. Introduction & Overview]]
2. [[#2. Architecture & Components]]
3. [[#3. Database Schema & Models]]
4. [[#4. Google Apps Script Integration]]
5. [[#5. Feature Walkthrough & UI/UX]]
6. [[#6. Installation & Configuration]]
7. [[#7. Automated Tests & Verification]]
8. [[#8. Troubleshooting & Maintenance]]

---

## 1. Introduction & Overview
This sub-app automates price tag creation via Google Slides and Google Apps Script (GAS) API integrations, streamlining workflow operations.

---

## 2. Architecture & Components

Implementasi legacy mengikuti Laravel MVC dan Livewire v3. Pada target headless, Action, Service, Model, Job, dan database dipertahankan di backend, sedangkan komponen Livewire digantikan oleh React feature components yang mengonsumsi REST API.

```
[ Laravel Dashboard ] --(Dispatch Job)--> [ Queued Jobs ]
         │                                       │
  (Service Call)                           (Service Call)
         │                                       │
         ▼                                       ▼
  [ PricetagGeneratorService ] ----------> [ Google Apps Script Web App ]
                                                 │
                                           (Builds Image)
                                                 │
                                                 ▼
                                         [ Google Drive ]
```

### Key Components

#### 1. Livewire Components (Legacy Mapping)
* **`App\Livewire\Pricetag\Search`**: Mengelola alur pencarian katalog dua tingkat: menyaring kategori terlebih dahulu dengan grid compact (ikon di kiri sejajar dengan grup teks nama kategori & total produk di kanan), lalu menyaring produk/varian dengan grid collapse/expand (`items-start` alignment) yang menampilkan semua data secara universal lintas user.
* **`App\Livewire\Pricetag\Generator`**: The core operational interface containing:
  * **Generate Tunggal**: Synchronous single pricetag generator. Terintegrasi dengan parameter query `product_id` untuk langsung melompat ke form input harga. Dilengkapi alur pencarian kategori interaktif (menyembunyikan daftar kategori secara default sebelum pencarian dilakukan) dan visualisasi pemrosesan gradual 0% -> 90% -> 100%.
  * **Checklist Multi Generate**: Checkbox table to batch-process selected variants with customized discount prices.
  * **Bulk Upload CSV**: File-uploader for queueing mass operations.
* **`App\Livewire\Pricetag\History`**: Renders batch generation progress, detailed item results, and download options.
* **`App\Livewire\Pricetag\Database`**: Restricted management for categories, products, and CSV mass imports.

#### 2. Services
Service layer handles direct communications with Google Apps Script Web App.

#### 3. Queued Jobs
Queue layer handles background processes for batch pricing label generations.

---

## 3. Database Schema & Models
Database contains structured categories, products, batches, and batch items to track progress and asset links.

---

## 4. Google Apps Script Integration
Google Apps Script receives payloads, clones template slides, replaces parameters, converts to image assets, and writes to Google Drive.

---

## 5. Feature Walkthrough & UI/UX

### 1. Modern Indeterminate Loading Bar
Visual indication during batch processing and operations.

### 2. Interactive Search & History
Category and product details, with expansion layout aligning elements.

### 3. Simplified Database Management & Mass CSV Import
Admin tools for synchronizing lists.

### 4. Dedicated SaaS-like Studio Layout
Dark mode clean UI specialized for label generation.

### 5. Alur Pembuatan Label Satuan (Step-by-Step Wizard)
Untuk meningkatkan kerapian visual dan keramahan pengguna (user-friendliness), proses pembuatan label satuan diubah menjadi wizard interaktif langkah-demi-langkah dengan **tampilan list minimalis (tanpa ikon)** dan memiliki **lebar yang konsisten (`max-w-xl`) di setiap langkah**:
1. **Langkah 1: Pilih Kategori**: Menampilkan kotak pencarian (search bar) kategori produk dalam bentuk list vertikal bersih tanpa ikon. Secara default, **daftar kategori bawaan disembunyikan** demi kerapian tampilan awal. Ketika operator mengetik kata kunci pada kotak pencarian, daftar kategori yang cocok akan langsung muncul ke bawah.
2. **Langkah 2: Pilih Produk**: Menampilkan daftar nama produk dalam bentuk list vertikal bersih di bawah kategori terpilih, lengkap dengan bilah pencarian real-time.
3. **Langkah 3: Pilih Varian**: Jika produk memiliki beberapa variasi (misalnya warna berbeda), sistem menampilkan daftar varian dalam bentuk list bersih beserta harga normalnya. Langkah ini juga dilengkapi bilah pencarian.
   > [!TIP]
   > **Sistem Otomatisasi Lewati Langkah**: Jika produk hanya memiliki satu varian default (misalnya varian bernama "Default" atau kosong), sistem secara cerdas akan langsung melewati langkah ini ke Langkah 4 untuk mempercepat input data.
4. **Langkah 4: Input Harga Promo**: Menampilkan detail lengkap produk terpilih (Nama, Kategori, Varian, dan Harga Normal) sebagai konteks bagi operator, serta menyediakan input untuk harga promo (diskon) baru.
   > [!NOTE]
   > **Akses Cepat (Deep Link)**: Jika operator membuka halaman generator dengan membawa query parameter `?product_id=X`, Livewire mount akan mendeteksi parameter tersebut dan langsung memposisikan alur wizard ke Langkah 4 ini secara instan dengan data produk yang sesuai.
5. **Langkah 5: Memproses Pembuatan**: Setelah tombol pembuatan diklik, sistem langsung berpindah ke halaman memuat (*loading*) ini. Halaman ini menggunakan simulasi progress bar berbasis Alpine.js yang berjalan **secara gradual/bertahap** dari 0% hingga maksimal 90% (menggunakan easing perlahan ketika mendekati 90% agar menunggu respon server). Setelah pemrosesan latar belakang selesai, server menembakkan browser event `generation-finished` untuk memerintahkan progress bar langsung terisi penuh ke 100% dan memicu pemindahan langkah wizard secara mulus.
6. **Langkah 6: Selesai**: Menampilkan hasil pembuatan label promo dengan opsi untuk melihat pratinjau file langsung di Google Drive atau mengunduhnya secara langsung. Terdapat tombol untuk memulai proses pembuatan label baru kembali ke awal.
   > [!TIP]
   > **Animasi Ikon Sukses**: Untuk menjaga konsistensi dengan visualisasi loading di Langkah 5, ikon centang sukses pada Langkah 6 didesain menggunakan animasi pulse & ping yang selaras, menciptakan interaksi UI yang responsif dan menawan.

> [!IMPORTANT]
> Seluruh penulisan pesan, label tombol, dan panduan wizard menggunakan Bahasa Indonesia yang mudah dipahami oleh pengguna awam tanpa istilah developer teknis yang rumit serta tidak menampilkan informasi berbau teknis seperti kode identitas teknis produk di dalam visualisasi UI wizard. Proses integrasi dibungkus rapi sehingga terlihat seperti sistem internal Creative Universe yang bekerja secara langsung.

---

## 6. Installation & Configuration
Configuration requires setting up GAS web app credentials in the environment setup.

Pada target baru, dependency backend dan frontend di-build dari folder masing-masing. Build production dilakukan di lokal/CI; runtime production tidak boleh bergantung pada terminal interaktif.

---

## 7. Automated Tests & Verification
Comprehensive features and authorization levels are guarded by automated tests.

---

## 8. Troubleshooting & Maintenance
Verify Google Apps Script API quotas and cPanel limits.

---
*Document Version: 1.5.0*
*Last Modified: 2026-06-19*
