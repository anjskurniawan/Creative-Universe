# Pricetag Generator Sub-App V1 Documentation

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
The **Pricetag Generator** is a specialized sub-app built to automate the generation of promotional pricetag images for the JETE brand. It replaces manual image-editing workflows by sending product and pricing parameters from a central Laravel dashboard to a Google Apps Script (GAS) service, which builds the formatted images and stores them directly on Google Drive.

### Target Objectives
* **Automation**: Instantly create customized promotional images using pre-designed layouts.
* **Scalability**: Handle mass generation through queue-based chunk processing without hitting server timeouts or API rate limits.
* **Centralization**: Maintain a complete history of all generated batches, including direct view and download links.

---

## 2. Architecture & Components

The sub-app follows Laravel's standard MVC architecture, powered by **Livewire v3** for rich, reactive UI interfaces.

```
[ Laravel Dashboard ] ──(Dispatch Job)──► [ Queued Jobs ]
         │                                       │
  (Service Call)                           (Service Call)
         │                                       │
         ▼                                       ▼
  [ PricetagGeneratorService ] ──────────► [ Google Apps Script Web App ]
                                                 │
                                           (Builds Image)
                                                 │
                                                 ▼
                                         [ Google Drive ]
```

### Key Components

#### 1. Livewire Components
* **`App\Livewire\Pricetag\Search`**: Handles catalog search, filtering, and direct links to generated files.
* **`App\Livewire\Pricetag\Generator`**: The core operational interface containing:
  * **Generate Tunggal**: Synchronous single pricetag generator.
  * **Checklist Multi Generate**: Checkbox table to batch-process selected variants with customized discount prices.
  * **Bulk Upload CSV**: File-uploader for queueing mass operations.
* **`App\Livewire\Pricetag\History`**: Renders batch generation progress, detailed item results, and download options.
* **`App\Livewire\Pricetag\Database`**: Restricted management for categories, products, and CSV mass imports.

#### 2. Services
* **`App\Services\GoogleAppScript\PricetagGeneratorService`**: Encapsulates external HTTP API calls to the Google Apps Script Web App, handling payloads, responses, and polymorphic `AssetLink` creation.

#### 3. Queued Jobs
* **`App\Jobs\Pricetag\GeneratePricetagChunkJob`**: Background job executing batches of **5 items** per chunk. This ensures stability, avoids execution time-out blocks on hosting providers, and respects Google daily rate limits.

---

## 3. Database Schema & Models

### Entity Relationship Diagram (Conceptual)
```
  ┌──────────────────┐          ┌──────────────────┐
  │ PricetagCategory │──(has)──►│ PricetagProduct  │ (with variant & price)
  └──────────────────┘          └────────┬─────────┘
                                         │ (polymorphic)
                                         ▼
                                ┌──────────────────┐
                                │    AssetLink     │
                                └──────────────────┘
                                         ▲
                                         │ (has)
  ┌──────────────────┐          ┌────────┴─────────┐
  │  PricetagBatch   │──(has)──►│PricetagBatchItem │
  └──────────────────┘          └──────────────────┘
```

### Database Tables

#### 1. `pricetag_categories`
Stores product categories.
* `id` (bigint, PK)
* `name` (varchar, unique)
* `created_by`, `updated_by`, `deleted_by` (foreign keys to users)
* `deleted_at` (timestamp, soft delete)

#### 2. `pricetag_products`
Stores product records, pricing, and category mapping.
* `id` (bigint, PK)
* `category_id` (bigint, FK)
* `name` (varchar)
* `variant_name` (varchar, default: 'Default')
* `normal_price` (int)
* `discount_price` (int, nullable)
* `created_by`, `updated_by`, `deleted_by` (foreign keys to users)
* `deleted_at` (timestamp, soft delete)

#### 3. `pricetag_batches`
Tracks grouped queue tasks.
* `id` (bigint, PK)
* `batch_name` (varchar)
* `status` (varchar) - `pending`, `processing`, `completed`, `failed`
* `total_items` (int)
* `processed_items` (int)
* `created_by`, `updated_by`, `deleted_by` (foreign keys to users)

#### 4. `pricetag_batch_items`
Tracks individual execution results in a batch.
* `id` (bigint, PK)
* `batch_id` (bigint, FK)
* `product_id` (bigint, FK)
* `status` (varchar) - `pending`, `success`, `failed`
* `error_message` (text, nullable)

---

## 4. Google Apps Script Integration

The service communicates with Google Apps Script via JSON POST request payloads.

### Request Payload Format
```json
{
  "user": "Nama Operator",
  "category": "AUDIO",
  "produk": "JETE TWS T10",
  "varian": "Black",
  "hargaNormal": 399000,
  "hargaPotongan": 199000,
  "fileName": "jete-tws-t10-black.jpg"
}
```

### Expected Response Payload
```json
{
  "status": "success",
  "file_url": "https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk",
  "download_url": "https://drive.google.com/uc?export=download&id=FILE_ID"
}
```

---

## 5. Feature Walkthrough & UI/UX

Obsidian users will notice rich interactive patterns styled with custom CSS:

### 1. Modern Indeterminate Loading Bar
Instead of plain spinners, processing states display an indeterminate loading bar styled directly in theme variables. It is placed at the top of the panels to align with validation alerts.

```css
/* Core indicator class */
.cu-loading-bar {
    position: relative;
    height: 6px;
    background-color: var(--color-cu-panel-soft);
    border-radius: 9999px;
    overflow: hidden;
}
.cu-loading-bar-value {
    background-color: var(--color-cu-info);
    position: absolute;
    top: 0;
    bottom: 0;
    left: -100%;
    width: 50%;
    animation: cu-loading-indeterminate 1.6s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. Interactive Search & History
* **Cari Pricetag (Modern Catalog View)**:
  * **Minimalist Search Controls**: Focuses entirely on finding items with a clean query input and layout controls.
  * **View Switcher (Grid & List)**: An interactive Alpine.js layout switcher allowing users to choose between a card grid layout and a structured tabular list view.
  * **Product Card Grid**: Renders modern product cards with hover scaling effects, category badges, variant labels, and a visual "price sticker" style pricing segment showing normal and promotional prices.
* **Riwayat Generate**: Polling-based progress bar tracking jobs. Clicking on a history card toggles a drawer displaying a compact, minimalist grid tag layout showing product names, statuses, and action links. Includes direct batch ZIP downloads.

### 3. Simplified Database Management & Mass CSV Import
To make data input simple and efficient, the database management tab has been refactored:
* **Removal of Variant CRUD Table**: The manual single-item variant list table has been removed from database management since all variant listings can be easily monitored from the **Cari Pricetag** view.
* **Simplified Product Flow**: When adding a product, operators can select an existing category OR toggle "Buat Kategori Baru" to automatically create the category on the fly.
* **Mass CSV Importer**: The CSV import feature performs a full bulk insert/update. It automatically parses `kategori`, `produk`, `varian`, `harga_normal`, and `harga_diskon` and registers them into the database, generating new category and product structures dynamically if they do not yet exist.

#### Supported CSV Headers (Indonesian / English variations):
* **kategori** / **category**
* **produk** / **product**
* **varian** / **variant_name** (Optional, defaults to "Default")
* **harga_normal** / **normal_price**
* **harga_diskon** / **discount_price** (Optional, defaults to 0)

### 4. Dedicated SaaS-like Studio Layout
The interface has been redesigned to feel like a dedicated creative tool (e.g., Figma or Canva) rather than a generic administrative dashboard:
* **Removal of Sidebar Navigation**: Vertical sidebars are replaced by a sleek, top horizontal hero card banner.
* **Top Navigation Pill Menu**: A modern horizontal pill bar is nested within the header card, providing seamless routing between Search, Generator, History, and Database tabs.
* **Ambient Glares**: Features background gradients, glassmorphic headers, and drop shadows to achieve a highly modern, professional, and interactive workspace feel.

### 5. Alur Pembuatan Label Satuan (Step-by-Step Wizard)
Untuk meningkatkan kerapian visual dan keramahan pengguna (user-friendliness), proses pembuatan label satuan diubah menjadi wizard interaktif langkah-demi-langkah dengan **tampilan list minimalis (tanpa ikon)** dan memiliki **lebar yang konsisten (`max-w-xl`) di setiap langkah**:
1. **Langkah 1: Pilih Kategori**: Menampilkan daftar kategori produk dalam bentuk list vertikal bersih tanpa ikon. Dilengkapi bilah pencarian dinamis untuk memfilter kategori.
2. **Langkah 2: Pilih Produk**: Menampilkan daftar nama produk dalam bentuk list vertikal bersih di bawah kategori terpilih, lengkap dengan bilah pencarian real-time.
3. **Langkah 3: Pilih Varian**: Jika produk memiliki beberapa variasi (misalnya warna berbeda), sistem menampilkan daftar varian dalam bentuk list bersih beserta harga normalnya. Langkah ini juga dilengkapi bilah pencarian.
   > [!TIP]
   > **Sistem Otomatisasi Lewati Langkah**: Jika produk hanya memiliki satu varian default (misalnya varian bernama "Default" atau kosong), sistem secara cerdas akan langsung melewati langkah ini ke Langkah 4 untuk mempercepat input data.
4. **Langkah 4: Input Harga Promo**: Menampilkan detail lengkap produk terpilih (Nama, Kategori, Varian, dan Harga Normal) sebagai konteks bagi operator, serta menyediakan input untuk harga promo (diskon) baru.
5. **Langkah 5: Memproses Pembuatan**: Setelah tombol pembuatan diklik, sistem langsung berpindah ke halaman memuat (*loading*) ini untuk menampilkan progress bar animasi secara instan. Proses *generate* gambar asinkron dipicu menggunakan `wire:init` setelah halaman termuat di browser.
6. **Langkah 6: Selesai**: Menampilkan hasil pembuatan label promo dengan opsi untuk melihat pratinjau file langsung di Google Drive atau mengunduhnya secara langsung. Terdapat tombol untuk memulai proses pembuatan label baru kembali ke awal.

> [!IMPORTANT]
> Seluruh penulisan pesan, label tombol, dan panduan wizard menggunakan Bahasa Indonesia yang mudah dipahami oleh pengguna awam tanpa istilah developer teknis yang rumit serta tidak menampilkan informasi berbau teknis seperti kode identitas teknis produk di dalam visualisasi UI wizard. Proses integrasi dibungkus rapi sehingga terlihat seperti sistem internal Creative Universe yang bekerja secara langsung.

---

## 6. Installation & Configuration

### Prerequisites
* PHP 8.2+ with the following extensions:
  * `PDO`
  * `openssl`
  * `zip` (ZipArchive)

### Step 1: Configure Environment Variables (`.env`)
Add the Google Apps Script Web App URL and set the queue connection to database:
```env
QUEUE_CONNECTION=database
GOOGLE_APPS_SCRIPT_PRICETAG_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

### Step 2: Run Database Migrations & Seeds
```bash
php artisan migrate
php artisan db:seed --class=PricetagTestDataSeeder
```

### Step 3: Run the Queue Worker (Production)
```bash
php artisan queue:work --queue=default
```

---

## 7. Automated Tests & Verification

The suite includes feature tests verifying authorization barriers, model activity logging triggers, single/checklist creation, and ZIP compression.

Run the test suite using PHPUnit:
```bash
vendor/bin/phpunit
```

---

## 8. Troubleshooting & Maintenance

> [!warning]
> **Queue Sticking**: If generated checklist items do not update or stay marked as "Antrean", make sure `php artisan queue:work` is actively running in the background.

> [!note]
> **Daily Limits**: Google Drive API and Apps Script have daily quotas for file creation. If the script returns errors, verify the daily limit is not exceeded on the Google Console dashboard.

---
*Document Version: 1.1.0*
*Last Modified: 2026-06-17*
