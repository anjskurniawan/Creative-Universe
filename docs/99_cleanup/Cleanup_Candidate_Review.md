---
title: "Cleanup Candidate Review"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
source_files:
  - "docs/99_cleanup/Repository_And_Docs_Audit.md"
  - "docs/99_cleanup/Enterprise_Refactor_Task_List.md"
scope: "cleanup candidate review before trash movement"
---

# Cleanup Candidate Review

## 1. Purpose
Mengevaluasi empat kandidat pembersihan (cleanup candidates) pertama di repositori untuk menentukan tingkat risiko penghapusan, dependensi dengan kode/dokumen aktif, serta memberikan rekomendasi tindakan lanjut (Keep, Move to Trash, atau Owner Review).

## 2. Review Method
Evaluasi dilakukan dengan memeriksa isi fisik direktori secara rekursif, melakukan pencarian referensi (grep search) di seluruh codebase, serta meninjau dependensinya pada seeder database dan alur build aplikasi.

## 3. Candidate Summary

| Task ID | File/Folder | Exists | Category | Risk | Recommendation | Reason |
|---|---|---|---|---|---|---|
| CLN-001 | `apps/backend/apps` | Ya | `temp-files` | LOW | move to trash later | Hanya berisi struktur folder kosong mendalam tanpa berkas apa pun. |
| CLN-002 | `apps/frontend/node_modules.broken` | Ya | `build-artifacts` | LOW | move to trash later | Sisa instalasi compiler tailwind oxide yang rusak. Tidak di-import package manager. |
| CLN-003 | `DB Produk Sementara.csv` | Ya | `obsolete` | LOW | move to trash later | Berkas telah disalin ke `apps/backend/database/seeders/data/`. Berkas root tidak lagi dipakai seeder. |
| CLN-004 | `docs/brainstromming ODDS.md` | Ya | `outdated-docs` | NEEDS_REVIEW | needs owner review | Berisi 995 baris dokumentasi ide detail ODDS yang berpotensi memiliki keputusan produk unik yang belum dipindahkan to SRD aktif. |
| CLN-005 | `apps/backend/nul` | Ya | `temp-files` | LOW | delete candidate (manual) | Berkas khusus Windows (NUL device namespace). Tidak boleh otomatis dipindahkan. |
| CLN-006 | `apps/backend/.phpunit.result.cache` | Ya | `temp-files` | LOW | move to trash later / ignore | Berkas cache pengujian PHPUnit. Regenerasi otomatis saat tes dijalankan. |
| CLN-007 | `apps/frontend/tsconfig.tsbuildinfo` | Ya | `build-artifacts` | LOW | move to trash later / ignore | Berkas cache kompilasi incremental TypeScript. Regenerasi otomatis. |

---

## 4. Detailed Review

### CLN-001 — apps/backend/apps
Struktur folder: `apps/backend/apps/backend/app/Notifications/Odds`.
Semua direktori di dalamnya kosong. Tidak ada file PHP atau berkas konfigurasi. Folder ini adalah residu tidak sengaja saat pembuatan nama direktori ganda.
- **Dependencies:** Tidak ada referensi dalam kode aktif maupun konfigurasi composer/autoload.
- **Risk:** LOW.

### CLN-002 — apps/frontend/node_modules.broken
Berisi `@tailwindcss/oxide-win32-x64-msvc/tailwindcss-oxide.win32-x64-msvc.node`.
Merupakan cadangan modul gagal yang dibuat secara manual saat penyelesaian dependensi Windows lokal.
- **Dependencies:** Tidak tercatat dalam `package.json` aktif.
- **Risk:** LOW.

### CLN-003 — DB Produk Sementara.csv
Berkas data CSV produk sementara berukuran 692 byte yang terletak di root direktori proyek.
- **Dependencies:** Sebelumnya dirujuk oleh seeder. Namun, pada Batch 12, berkas telah disalin secara permanen ke `apps/backend/database/seeders/data/DB Produk Sementara.csv` dan seeder telah direfaktor untuk membaca dari sub-folder backend.
- **Risk:** LOW (Berkas root ini kini usang dan aman untuk dipindahkan ke trash).

### CLN-004 — docs/brainstromming ODDS.md
Berkas draf awal setebal 995 baris yang berisi konsep sistem design ODDS.
- **Dependencies:** Hanya dirujuk oleh berkas audit dokumentasi.
- **Risk:** NEEDS_REVIEW. Mengingat isi ulasannya sangat panjang dan mencakup transisi alur kerja dari *spreadsheet* ke *dashboard*, berkas ini berisiko dibuang sebelum seluruh pemikiran bisnisnya terekam di SRD ODDS yang baru.

### CLN-005 — apps/backend/nul
Berkas invalid penamaan khusus (NUL reserved name) di Windows filesystem.
- **Dependencies:** Tidak dirujuk oleh kode aktif. Berkas tidak dapat diakses secara normal di Windows API karena diblokir oleh Win32 I/O.
- **Risk:** LOW (namun membutuhkan instruksi manual).
- **Manual Cleanup Note:** Jangan dihapus menggunakan model otomatis. Jika developer di Windows ingin membersihkannya, gunakan command prompt dengan NT namespace path:
  `del "\\?\C:\laragon\www\creativeuniverse\apps\backend\nul"`
  Atau gunakan lingkungan WSL/Bash:
  `rm apps/backend/nul`

### CLN-006 — apps/backend/.phpunit.result.cache
Berkas cache hasil pengujian otomatis PHPUnit.
- **Dependencies:** Digenerasi secara otomatis setiap kali pengujian dijalankan. Tidak dirujuk oleh source code produksi.
- **Risk:** LOW.

### CLN-007 — apps/frontend/tsconfig.tsbuildinfo
Berkas cache informasi kompilasi incremental TypeScript.
- **Dependencies:** Digenerasi otomatis oleh tsc saat Next.js divalidasi/build. Tidak berpengaruh pada runtime.
- **Risk:** LOW.

---

## 5. Approved for Later Trash Movement

| Task ID | File/Folder | Trash Category | Risk | Target Trash Path |
|---|---|---|---|---|
| CLN-001 | `apps/backend/apps` | `temp-files` | LOW | `trash/2026-06-27/temp-files/apps/backend/apps` |
| CLN-002 | `apps/frontend/node_modules.broken` | `build-artifacts` | LOW | `trash/2026-06-27/build-artifacts/apps/frontend/node_modules.broken` |
| CLN-003 | `DB Produk Sementara.csv` (Root) | `obsolete` | LOW | `trash/2026-06-27/obsolete/DB Produk Sementara.csv` |
| CLN-006 | `apps/backend/.phpunit.result.cache` | `temp-files` | LOW | `trash/2026-06-27/temp-files/apps/backend/.phpunit.result.cache` |
| CLN-007 | `apps/frontend/tsconfig.tsbuildinfo` | `build-artifacts` | LOW | `trash/2026-06-27/build-artifacts/apps/frontend/tsconfig.tsbuildinfo` |

## 6. Needs Review Before Movement

| Task ID | File/Folder | Reason | Owner Decision Needed |
|---|---|---|---|
| CLN-004 | `docs/brainstromming ODDS.md` | Mengandung konteks historis fungsionalitas transisi ODDS yang sangat panjang (995 baris). | Project Owner harus memverifikasi apakah poin-poin brainstorming di dalamnya sudah terakomodasi sepenuhnya di SRD/ERD ODDS yang baru sebelum diarsipkan ke Trash. |
| CLN-005 | `apps/backend/nul` | File sistem khusus Windows. | Memerlukan penghapusan manual menggunakan WSL atau NT path khusus karena API standar Windows memblokirnya. |

## 7. Must Keep

*(Belum ada kandidat di kategori ini yang berstatus HIGH risk pasca pembenahan CSV di Batch 12).*

## 8. Suggested `.gitignore` Updates
Guna mencegah sisa build gagal atau file cache lokal masuk kembali ke dalam commit repositori, tambahkan/pastikan baris berikut ada di `.gitignore` utama (sudah di-ignore oleh berkas konfigurasi bawaan saat ini):
```text
# Broken dependencies backups
node_modules.broken/

# Local database temp files
*.csv

# Test caches & TS Build info
.phpunit.result.cache
**/.phpunit.result.cache
*.tsbuildinfo
apps/backend/nul
```

## 9. Next Actions
- Lakukan pemindahan aman ke folder `trash/` untuk kandidat berkategori LOW (`CLN-001` dan `CLN-002`).
- Rencanakan refaktor letak CSV untuk `CLN-003`.
