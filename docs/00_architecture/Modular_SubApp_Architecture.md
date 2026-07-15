---
title: "Modular Sub-App Architecture"
status: "APPROVED"
version: "1.0"
created: "2026-07-14"
revised: "2026-07-14"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
---

# Modular Sub-App Architecture

## 1. Keputusan

Creative Universe adalah modular monolith. Seluruh modul tetap berjalan dalam satu Laravel backend dan satu database, tetapi kepemilikan business rule dan data dipisahkan secara tegas per Sub-App.

## 2. Peta domain

### Core

Core hanya menyediakan capability yang dapat dipakai semua Sub-App:

- account dan authentication;
- role, permission, dan application access;
- user management, profile, dan settings;
- chat dan conversation;
- notification;
- asset dan file reference;
- activity log dan audit.

Core dilarang mengambil alih business rule milik Sub-App.

### Sub-App

1. **KV Retail Task** — workflow tugas Key Visual retail. Page route kanonis: `/kv-retail`. API prefix kanonis: `/api/v1/kv-retail`.
2. **Creative Report** — laporan dan penilaian Creative. API prefix: `/api/v1/creative-reports`.
3. **One Dashboard Design System (ODDS)** — sistem workflow desain sesuai rancangan produk yang telah disetujui. API prefix: `/api/v1/odds`.
4. **Generator** — induk berbagai generator. Page route: `/generator`; generator Pricetag berada di `/generator/pricetag` dan API `/api/v1/generator/pricetag`.
5. **Creative Artificial Intelligence** — aplikasi eksperimen. UI memakai **Creative AI**, page route `/creative-ai`, dan backend memakai key serta API prefix `cai`/`/api/v1/cai`.
6. **Design Assets** — aplikasi eksperimen. Page route `/design-assets` dan API prefix `/api/v1/design-assets` jika backend-nya diaktifkan.

Daftar resmi Core dan Sub-App berada di `Application_Catalog.md`. Dokumen tersebut menjadi registry penamaan agar route, permission, namespace, dan dokumentasi tidak kehilangan arah.

## 3. Aturan ketergantungan

- Semua Sub-App boleh menggunakan capability Core melalui contract publik.
- Sub-App tidak boleh melakukan query langsung ke tabel Sub-App lain.
- Sub-App tidak boleh mengimpor model internal Sub-App lain.
- Permintaan sinkron lintas aplikasi menggunakan service contract.
- Reaksi terhadap kejadian bisnis menggunakan domain event dan listener.
- Integrasi yang business rule-nya belum disetujui hanya boleh memiliki extension point; jangan membuat alur otomatis prematur.

Contoh target ODDS ke Creative Report:

```text
ODDS selesai
  -> domain event yang disetujui
  -> integration listener
  -> Creative Report contract
  -> record milik Creative Report
```

Alur tersebut belum diimplementasikan sampai aturan penilaian dan waktu sinkronisasinya diputuskan.

## 4. Struktur backend target

```text
app/
|-- Core/
|   |-- Contracts/
|   |-- Actions/
|   |-- Models/
|   `-- Services/
|-- SubApps/
|   |-- KvRetail/
|   |-- CreativeReport/
|   |-- Odds/
|   |-- Generator/
|   |   `-- Pricetag/
|   |-- Cai/
|   `-- DesignAssets/
`-- Http/
    |-- Controllers/Api/V1/
    |   |-- Core/
    |   |-- KvRetail/
    |   |-- CreativeReport/
    |   |-- Odds/
    |   |-- Generator/
    |   |-- Cai/
    |   `-- DesignAssets/
    |-- Requests/Api/V1/
    `-- Resources/Api/V1/

routes/
|-- api.php
`-- api/
    |-- core.php
    |-- kv-retail.php
    |-- creative-report.php
    |-- odds.php
    |-- generator.php
    |-- cai.php
    `-- design-assets.php
```

Controller, Request, dan Resource tetap berada pada HTTP boundary. Model, Action, Service, Contract, Event, dan business enum berada pada domain pemiliknya.

## 5. Application access dan permission

Core mengelola daftar Sub-App dan hak akses pengguna. Memiliki akses ke Sub-App tidak otomatis memberikan seluruh fiturnya.

Permission key teknis:

```text
kv-retail.tasks.view
kv-retail.tasks.create
kv-retail.tasks.update-status
creative-report.assessments.view
creative-report.assessments.update
odds.reports.view
pricetag.catalog.manage
```

Metadata tampilan permission minimal memuat:

- `application_key`;
- `group_key`;
- `display_name`;
- `description`;
- `sort_order`.

Contoh alias UI:

| Key teknis | Nama tampilan | Grup |
|---|---|---|
| `kv-retail.tasks.view` | Melihat Tugas KV Retail | Tugas |
| `kv-retail.tasks.create` | Membuat Tugas KV Retail | Tugas |
| `odds.reports.view` | Melihat Laporan ODDS | Laporan |

Role tetap global. Hierarki tidak boleh bergantung pada perbandingan string nama role; gunakan level otoritas yang tersimpan dan tervalidasi. Baseline urutan: Root, Manajer, SPV, lalu role operasional lain sesuai kebutuhan.

## 6. Kepemilikan tabel

| Pemilik | Prefix target |
|---|---|
| Core | tabel inti yang telah disetujui, tanpa prefix baru yang dipaksakan |
| KV Retail Task | `kv_retail_*` |
| Creative Report | `creative_report_*` |
| ODDS | `odds_*` |
| Generator - Pricetag | `generator_pricetag_*` |
| Creative Artificial Intelligence | `cai_*` |
| Design Assets | `design_assets_*` |

Rename tabel wajib menggunakan migration yang mempertahankan data, foreign key, index, dan relasi. `migrate:fresh` bukan strategi refactor data.

## 7. Quality gate modularisasi

- `composer test` wajib lulus sebelum dan sesudah setiap batch.
- Laravel Pint wajib lulus.
- Tidak ada perubahan kontrak API tanpa compatibility plan.
- Tidak ada rename tabel tanpa backup dan verifikasi jumlah record.
- Satu batch hanya memindahkan satu domain atau satu boundary.
