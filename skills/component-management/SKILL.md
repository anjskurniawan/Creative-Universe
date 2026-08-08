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

### Mode D: Sinkronisasi Developer Library

Jika ada perubahan pada isi `apps/frontend/src/components/`, sinkronkan katalog developer library secara otomatis sebelum menganggap pekerjaan selesai:

1. Baca seluruh file `.tsx` dan folder nested di `apps/frontend/src/components/`.
2. Sinkronkan struktur folder dan file ke `apps/frontend/src/app/developer/library/data/`.
   * Folder harus direpresentasikan sebagai entry dengan `file` yang diakhiri `/`.
   * File child harus berada di dalam `children` folder induknya.
   * Component yang berada langsung di `src/components/` tetap menjadi file root, bukan folder baru.
   * Gunakan separator `/` pada seluruh path catalog.
3. Tentukan nama component dari export utama source.
   * Jangan memakai nama helper atau export `Page` jika ada export component utama.
   * Jika satu file memiliki beberapa export component, simpan nama export utama dan catat file tetap satu kali.
4. Isi metadata setiap entry:
   * `description` harus menjelaskan fungsi nyata berdasarkan source component.
   * `tags` harus relevan dengan fungsi, interaksi, dan domain component.
   * Jangan memakai deskripsi atau tags generik berbasis nama file saja.
5. Sinkronkan `COMPONENT_DATABASE` di `library.data.ts` untuk kategori baru atau yang berubah.
6. Cocokkan component dengan `PREVIEW_REGISTRY`.
   * Preview harus dibuat di `apps/frontend/src/app/developer/library/previews/` berdasarkan kategori dan component.
   * Jangan menambahkan preview yang memanggil API nyata, autentikasi, atau mutasi database; gunakan fixture lokal.
   * Component kompleks yang belum aman dipreview harus memakai placeholder dengan alasan yang jelas.
7. Jangan menghapus metadata manual yang sudah dikurasi kecuali metadata tersebut terbukti salah berdasarkan source.
8. Setelah sinkronisasi, periksa bahwa tidak ada file source yang hilang, duplicate path, separator `\\`, metadata kosong, atau child folder yang ter-flatten menjadi file biasa.

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
4. Untuk perubahan catalog/library, jalankan juga pemeriksaan berikut dari root frontend:
   ```powershell
   npx tsc --noEmit
   git diff --check
   ```
5. Bedakan status component saat memperbarui catalog:
   * Component baru harus ditambahkan ke catalog library setelah metadata dan preview siap.
   * Component yang sudah terdaftar hanya diperbarui pada entry yang sama; jangan didaftarkan ulang atau dibuat duplicate entry.
   * Jika component di-rename, perbarui nama, export, path, metadata, dan referensi preview pada entry catalog yang sama.
   * Jika hanya ada perubahan implementasi atau styling, tidak perlu memasukkan component ulang ke catalog; cukup pertahankan entry dan perbarui metadata/preview jika relevan.
6. Laporkan jumlah file source, jumlah entry catalog, daftar file yang belum memiliki preview, dan setiap blocker yang belum terselesaikan.
7. Jika operasi berhasil, gunakan keterangan hasil yang sesuai konteks:
   * Untuk component baru: `Berhasil, component baru telah ditambahkan ke katalog library.`
   * Untuk component yang sudah ada: `Berhasil, catalog library telah diperbarui.`
   * Untuk rename: `Berhasil, nama dan referensi component di katalog library telah diperbarui.`
