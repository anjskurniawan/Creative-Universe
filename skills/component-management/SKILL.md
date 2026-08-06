---
name: component-management
description: Otomatisasi alur kerja pembuatan (create), pemindahan (move), dan ekstraksi (extract) komponen React/Next.js ke dalam direktori src/components/ tanpa mengubah styling atau logika.
---

# Component Management Skill

Skill ini memberikan panduan standar bagi agen AI saat menangani komponen React/Next.js di repositori Creative Universe (terutama di `apps/frontend/src/components/`).

---

## 1. Aturan Mutlak Preservation (Strict Code Integrity)

Saat melakukan operasi **Create**, **Move**, atau **Extract** pada komponen:

1. **DILARANG KERAS MUTASI VISUAL & LOGIKA:**
   * Jangan merubah atau refaktor kelas Tailwind CSS, inline styles, struktur JSX/HTML, nama props, maupun logika internal (hooks, state, handler).
   * Semua markup dan perilaku visual harus presisi 100% sama dengan sumber aslinya.
2. **PENYESUAIAN YANG DIPERBOLEHKAN HANYA:**
   * Penyesuaian path import (menggunakan alias `@/components/...` atau `@/features/...`).
   * Penyesuaian statement `export` (export default / named export) agar sesuai konvensi file.
   * Pembersihan import yang tidak terpakai (*unused imports*) pada file hasil ekstraksi/pemindahan.

---

## 2. Struktur Pengelompokan Folder (`src/components/`)

Secara otomatis rekomendasikan path tujuan di bawah `apps/frontend/src/components/` berdasarkan kategori berikut:

* **`src/components/ui/`**: Komponen atom bersama / UI primitives (misal: button, modal, date-picker, input, toast).
* **`src/components/layout/`**: Komponen tata letak global (misal: container, navbar, sidebar, workspace).
* **`src/components/navigation/`**: Komponen navigasi laci/fitur spesifik.
* **`src/components/feedback/`**: Komponen penanganan error visual dan status feedback.
* **`src/components/<feature-name>/`**: Komponen khusus domain fitur tertentu (misal: `creative-report/`, `creative-ai/`, `odds/`).

---

## 3. Protokol Operasi

### Mode A: Create (Membuat Komponen Baru)
1. Tentukan nama komponen (kebab-case untuk nama file, PascalCase untuk nama komponen).
2. Buat file baru di folder tujuan (`apps/frontend/src/components/<kategori>/<nama-file>.tsx`).
3. Pastikan komponen menggunakan directive `"use client";` jika mengonsumsi React hooks/interaktivitas browser.

### Mode B: Move (Memindahkan Komponen)
1. Pindahkan file komponen ke lokasi terpusat di `apps/frontend/src/components/<kategori>/`.
2. Perbarui seluruh berkas lain yang mengimpor komponen tersebut agar mengarah ke path baru.
3. Hapus file/folder lama tempat komponen sebelumnya berada.

### Mode C: Extract (Mengekstrak Bagian Kode dari Halaman Besar)
1. Identifikasi blok JSX dan state/props yang dibutuhkan oleh blok tersebut.
2. Buat file komponen baru di `apps/frontend/src/components/<kategori>/<nama-file>.tsx`.
3. Pindahkan blok JSX dan props type definition ke file baru tanpa merubah styling.
4. Impor komponen baru tersebut di file asal dan ganti blok JSX lama dengan panggilan komponen baru.

---

## 4. Alur Verifikasi Otomatis

Setelah setiap operasi Create, Move, atau Extract selesai dilakukan:

1. Jalankan pemeriksaan tipe TypeScript dari root frontend:
   ```powershell
   cd apps/frontend
   npx tsc --noEmit
   ```
2. Pastikan kompilasi berjalan sukses tanpa eror kompilasi atau import terputus (*broken imports*).
3. Update berkas indeks katalog komponen di `notes/component_functions.md` jika ada komponen baru yang ditambahkan.
