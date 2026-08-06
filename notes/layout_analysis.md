# Analisis Struktur Tata Letak (Layout) & Komponen Navigasi
*Dicatat pada: 2026-08-06*

Dokumen ini mendokumentasikan arsitektur tata letak aktif, pemetaan rute, serta komponen navigasi yang digunakan pada aplikasi frontend.

---

## 1. Pemetaan Komponen Layout Produksi Aktif

Komponen layout utama terpusat sepenuhnya di dalam direktori `apps/frontend/src/components/layout/` dan saling terhubung sebagai berikut:

* **Kerangka Kerja (Shell Layout):**
  * `container.tsx`: Berfungsi sebagai pembungkus terluar halaman Next.js.
  * `workspace.tsx`: Menyediakan struktur grid responsif, mengelola visibilitas menu di seluler, serta memposisikan sidebar dan navbar.
  * `content.tsx`: Pembungkus area konten utama yang menampilkan `children`.
  * `menu.tsx`: Menyediakan data navigasi item menu.

* **Panel Navigasi Samping (Sidebar):**
  * `sidebar.tsx`: Mengonsumsi sub-komponen responsif dari folder `sidebar/` (`sidebar-item.tsx`, `sidebar-footer.tsx`, `sidebar-section.tsx`) untuk merender sidebar global di Desktop atau menu laci di Mobile.

* **Panel Navigasi Atas (Navbar):**
  * `navbar.tsx`: Mengelola baris tindakan atas, otentikasi pengguna, serta mengintegrasikan berbagai drop-down dari folder `navbar/` (`apps-dropdown.tsx`, `message-dropdown.tsx`, `notification-dropdown.tsx`, `profile-dropdown.tsx`).

* **Middleware Visual:**
  * `route-guard.tsx`: Memastikan pengguna terotentikasi sebelum memuat layout inti.

---

## 2. Pemetaan Rute Berdasarkan Sistem Tata Letak (Layout)

| Rute / Path | Tipe Layout | Keterangan / Komponen Terkait |
| :--- | :--- | :--- |
| **`/`** | Kustom (Layar Penuh) | Landing page utama interaktif dengan Three.js & GSAP. |
| **`/login`, `/forgot-password`** | Kustom (Layar Penuh) | Menggunakan rute grup `(auth)` khusus dengan form otentikasi minimalis. |
| **`/forbidden` (403)** | Kustom (Layar Penuh) | Halaman error dengan card informasi akses ditolak. |
| **`/docs`** | Semi-Layout (Kustom + Navbar Utama) | Menggunakan navigasi khusus dokumentasi namun tetap mengonsumsi komponen `Navbar` global di bagian atasnya. |
| **`/panel/*`** | Layout `Container` Global | Dashboard inti, manajemen pengguna, dan pemeliharaan server. |
| **`/creative-report`** | Layout `Container` Global | Laporan evaluasi divisi creative. |
| **`/creative-ai`** | Layout `Container` Global | Aplikasi chat asisten AI. |
| **`/odds`** | Layout `Container` Global | Alur pembuatan dan peninjauan tugas desain. |
| **`/kv-retail`** | Layout `Container` Global | Halaman dibungkus secara dinamis di dalam komponen `Container` tata letak utama. |
| **`/generator/*`** | Layout `SubAppShell` | Generator harga (pricetag) dan katalog aset kreatif. |
| **`/design-assets`** | Layout `SubAppShell` | Galeri dan pustaka unduhan aset desain divisi. |
| **`/developer/*`** | Layout `Container` Global | **Rute Sandbox khusus Developer** untuk uji coba visual tata letak. |
