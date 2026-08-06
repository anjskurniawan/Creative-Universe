# Panduan Batasan Rute Aplikasi (Route Boundaries Guide)
*Dicatat pada: 2026-08-06*

Dokumen konsolidasi ini menyimpan informasi batasan rute (*route boundaries*) dan catatan struktur Next.js app directory di repositori Creative Universe untuk referensi developer dan agen AI.

---

## 1. Core Route Group (`(core)`)
* **Status:** Aktif (Rute tidak muncul pada URL).
* **Fungsi:** Menampung rute untuk dashboard, profile, settings, users, roles, messages, dan maintenance.
* **Layout:** Menggunakan `core/layouts/core-shell.tsx` dan tidak lagi memiliki percabangan layout untuk Sub-App.

## 2. Creative AI Route Boundary (`/creative-ai`)
* **Status:** Eksperimen aktif di luar Core.
* **Fungsi:** Rute eksperimen chat kecerdasan buatan. Halaman dipindahkan pada migrasi F4 tanpa mengubah struktur URL `/creative-ai`.

## 3. Creative Report Route Boundary (`/creative-report`)
* **Status:** Aktif di luar Core.
* **Fungsi:** Folder rute ini bertindak murni sebagai *composition boundary* untuk fitur Creative Report. URL kanonis frontend adalah `/creative-report`.

## 4. Design Assets Route Boundary (`/design-assets`)
* **Status:** Eksperimen aktif di luar Core.
* **Fungsi:** Rute eksperimen galeri aset desain. Halaman dipindahkan pada migrasi F4 tanpa mengubah struktur URL `/design-assets`.

## 5. Generator Route Boundary (`/generator`)
* **Status:** Aktif di luar Core.
* **Fungsi:** Rute Sub-App generator harga (*pricetag*). Halaman dipindahkan ke sub-folder `generator/pricetag` pada migrasi F4 tanpa mengubah URL.

## 6. KV Retail Route Boundary (`/kv-retail`)
* **Status:** Aktif.
* **Fungsi:** Folder rute ini murni menjadi *composition boundary* untuk KV Retail Task. Logika bisnis dipindahkan ke `features/kv-retail` secara bertahap.
* **Referensi Teknis:** Informasi teknis KV Retail aktif terdokumentasi di [docs/03_backend_api/KV_Retail_Task_Reference.md](file:///c:/laragon/www/creativeuniverse/docs/03_backend_api/KV_Retail_Task_Reference.md).

## 7. ODDS Route Boundary (`/odds`)
* **Status:** Aktif di luar Core.
* **Fungsi:** Menampilkan One Dashboard Design System (ODDS). Halaman dan layout dipindahkan dari `(dashboard)/odds` pada migrasi F4 tanpa mengubah URL `/odds`.
