# Pemetaan Status Layout Rute (Route Layout Status)
*Dicatat pada: 2026-08-06*

Dokumen ini mendata status implementasi standarisasi struktur tata letak (layout) berbasis berkas `layout.tsx` lokal pada setiap rute halaman di aplikasi frontend.

---

## 1. Rute yang SUDAH Menggunakan Standarisasi `layout.tsx` Lokal

Rute-rute ini telah dipisahkan tata letaknya ke dalam berkas `layout.tsx` lokal yang membungkus seluruh sub-halaman di bawahnya menggunakan komponen layout terpusat (`Container` / `SubAppShell` / `Workspace`):

* **`/panel/*`** (Dashboard, Users, Roles, Maintenance)  
  * Tata Letak: [apps/frontend/src/app/(core)/panel/layout.tsx](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/app/(core)/panel/layout.tsx)
* **`/creative-report`** (Laporan Kreatif)  
  * Tata Letak: [apps/frontend/src/app/creative-report/layout.tsx](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/app/creative-report/layout.tsx)
* **`/creative-ai`** (Asisten Chat AI)  
  * Tata Letak: [apps/frontend/src/app/creative-ai/layout.tsx](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/app/creative-ai/layout.tsx)
* **`/odds`** (One Dashboard Design System)  
  * Tata Letak: [apps/frontend/src/app/odds/layout.tsx](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/app/odds/layout.tsx)
* **`/generator/*`** (Pricetag Generator)  
  * Tata Letak: [apps/frontend/src/app/generator/layout.tsx](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/app/generator/layout.tsx) & [apps/frontend/src/app/generator/pricetag/layout.tsx](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/app/generator/pricetag/layout.tsx)
* **`/design-assets`** (Galeri Aset Desain)  
  * Tata Letak: [apps/frontend/src/app/design-assets/layout.tsx](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/app/design-assets/layout.tsx)

---

## 2. Rute yang BELUM Menggunakan Konsep `layout.tsx` Lokal (Perlu Refaktor)

Rute-rute ini sudah memiliki layout visual yang konsisten tetapi **belum menerapkan pemisahan modular `layout.tsx` lokal**. Alih-alih menggunakan berkas layout, masing-masing halaman (`page.tsx`) masih membungkus dirinya sendiri dengan mengimpor komponen `Container` secara manual:

* **`/kv-retail/*`** (KV Retail Tasks)  
  * **Status:** Rute `/kv-retail`, `/kv-retail/month`, `/kv-retail/option`, `/kv-retail/performance`, `/kv-retail/unfinished` mengimpor dan merender `Container` secara terpisah di setiap file `page.tsx` individu.
  * **Saran Tindakan:** Satukan tata letak mereka dengan membuat satu berkas berkas `apps/frontend/src/app/kv-retail/layout.tsx` yang membungkus komponen `Container` utama, kemudian bersihkan pembungkus layout di masing-masing file `page.tsx`.

---

## 3. Rute Pengecualian Eksplisit (Explicit Layout Exceptions)

Rute-rute khusus berikut tidak menggunakan (dan dikecualikan dari) standarisasi `layout.tsx` lokal karena memerlukan tampilan khusus/fullscreen yang sepenuhnya berbeda dari struktur navigasi standar:

* **Halaman Landing Utama (`/`)**  
  * Alasan: Menampilkan visual landing page 3D (Three.js/GSAP) interaktif layar penuh.
* **Portal Otentikasi (`/login`, `/forgot-password`)**  
  * Alasan: Memerlukan tampilan minimalis berfokus penuh pada card input form login/reset password.
* **Halaman Error (`/forbidden` / 403)**  
  * Alasan: Halaman fallback error fullscreen.
* **Developer Sandbox (`/developer/*`)**  
  * Alasan: Ruang sandbox pengujian tata letak internal developer yang terisolasi dari menu navigasi aktif.
* **Halaman Dokumentasi (`/docs`)**  
  * Alasan: Menggunakan struktur navigasi dokumen dual-sidebar khusus yang terintegrasi langsung di halamannya.
