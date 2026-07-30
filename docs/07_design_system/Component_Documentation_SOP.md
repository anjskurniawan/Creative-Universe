# Standard Operating Procedure (SOP) Dokumentasi Komponen UI
*Panduan Wajib untuk AI Agent (Antigravity / Codex) dalam Pembuatan & Manajemen Dokumentasi Komponen*

Prosedur ini wajib diikuti oleh seluruh AI Agent saat **Membuat Komponen Baru**, **Merevisi Komponen**, atau **Menyusun Dokumentasi Komponen Interaktif** di `/docs` guna memastikan setiap komponen memiliki dokumentasi kelas dunia yang konsisten, bersih, dan 100% *on-point*.

---

## 1. Anatomi Standar 6 Bagian Utama Dokumentasi Komponen

Setiap file dokumentasi interaktif yang dibuat di `apps/frontend/src/components/docs/templates/*-documentation.tsx` **WAJIB** memiliki 6 bagian utama berurutan berikut:

```
┌───────────────────────────────────────────────────────────┐
│ 1. Hero Section (.doc-hero)                               │
│    Badge + Title + Subtitle + Quick Links (Figma/Source/WAI)│
├───────────────────────────────────────────────────────────┤
│ 2. Interactive Playground (.doc-playground)               │
│    - Tab Controls (.doc-playground-controls)              │
│    - White Canvas + Dark Grid Pattern (.doc-playground-content)│
│    - White Card Wrapper (.doc-preview-area)               │
├───────────────────────────────────────────────────────────┤
│ 3. Installation & Usage (.doc-install-card)               │
│    - File Location + Copyable Import Statement            │
├───────────────────────────────────────────────────────────┤
│ 4. Component Source Code (.doc-code-block-container)      │
│    - Full Source Code Block + One-Click Copy Button       │
├───────────────────────────────────────────────────────────┤
│ 5. Variants Gallery (.doc-grid)                           │
│    - Visual Grid of States, Themes, & Configurations      │
├───────────────────────────────────────────────────────────┤
│ 6. API Reference Table (.doc-table-wrapper)               │
│    - Comprehensive Props Table (Prop, Type, Default, Desc)│
└───────────────────────────────────────────────────────────┘
```

---

## 2. Aturan Baku Interactive Playground

### A. Latar Belakang Canvas & White Card Wrapper
- **Latar Belakang Grid Canvas Putih (`.doc-playground-content`)**:
  Canvas playground **WAJIB** berlatar belakang putih murni (`#ffffff`) dengan pola garis kisi-kisi (*grid pattern*) gelap transparan (`rgba(0,0,0,0.08)` / 20px x 20px).
- **Pembungkus Kartu Putih Murni (`.doc-preview-area`)**:
  Komponen yang sedang diuji **WAJIB DIBUNGKUS** di dalam `.doc-preview-area` (White Card Wrapper dengan `bg-white`, `rounded-2xl`, `border`, dan `shadow-xl`) yang simetris di tengah kanvas *grid pattern*.

### B. Prinsip Direct Rendering & Zero Dummy Triggers
- **HAPUS Tombol Trigger Buatan**:
  Untuk komponen *popover/dropdown* (seperti `AppsDropdown`, `NotificationDropdown`, `MessageDropdown`, `ProfileDropdown`), **DILARANG** membuat tombol trigger buatan (seperti "Message Trigger" atau "Apps Switcher Button").
- **Tampilkan Komponen Langsung (*On-Point*)**:
  Sediakan opsi **Dropdown State: Open (Visible) / Closed (Hidden)** pada toolbar kontrol interaktif (`.doc-playground-controls`). Komponen *dropdown* harus langsung berdiri mandiri di tengah *White Card Wrapper* saat opsi `Open` dipilih. Jika `Closed`, tampilkan indikator teks halus.

---

## 3. Alur Kerja Pembuatan Komponen Baru (Create)

1. **Buat File Komponen:**
   Tulis kode komponen di struktur direktori yang tepat dalam `apps/frontend/src/components/` berdasarkan kategorinya (`ui/`, `typography/`, `layout/`, `navigation/`, dll).
2. **Buat File Dokumentasi Interaktif (.tsx):**
   Buat file dokumentasi di `apps/frontend/src/components/docs/templates/[component-name]-documentation.tsx` menggunakan struktur 6 bagian utama di atas.
3. **Daftarkan di Registry (`component-registry.ts`):**
   Buka `apps/frontend/src/components/docs/component-registry.ts` dan daftarkan entri baru lengkap dengan *title*, *category*, *description*, dan *slug*.
4. **Daftarkan Router Dokumentasi (`DocsContent.tsx`):**
   Buka `apps/frontend/src/components/docs/DocsContent.tsx`, impor berkas dokumentasi yang baru dibuat, dan tambahkan rute *render* `slug`.
5. **Verifikasi Kompilasi & Visual:**
   Jalankan `npx tsc --noEmit` untuk mengonfirmasi kelulusan kompilasi kode TypeScript tanpa kesalahan.

---

## 4. Alur Kerja Merevisi Komponen (Update)

1. **Modifikasi Komponen Utama:** Perbarui kode di komponen terkait.
2. **Perbarui Dokumentasi (.tsx):**
   - Jika ada *props* baru, tambahkan ke tabel **API Reference**.
   - Jika ada fitur visual baru, buat *control input/select/checkbox* di **Interactive Playground**.
   - Perbarui contoh di bagian **Component Source Code**.
3. **Verifikasi Ulang:** Jalankan `npx tsc --noEmit`.

---

## 5. Alur Kerja Menghapus Komponen (Delete)

1. **Hapus File Komponen Utama:** Bersihkan file `.tsx` dari lokasi asalnya.
2. **Bersihkan Referensi:** Gunakan `grep_search` untuk memastikan tidak ada file lain yang mengimpor komponen tersebut.
3. **Hapus Entri Registry & Router:** Hapus entri dari `component-registry.ts`, berkas `.tsx` dokumentasinya di `templates/`, dan rute di `DocsContent.tsx`.

---

> [!TIP]
> **Prompt Cepat untuk User / Agent:**
> *"Tolong buat/revisi komponen [Nama Komponen] dan ikuti SOP dalam `component_documentation_sop.md` agar dokumentasinya memiliki 6 bagian lengkap, White Card Wrapper di atas grid canvas putih, serta terdaftar di Docs."*
