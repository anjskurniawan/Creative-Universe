---
title: "Trash Index"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
scope: "safe archive index for moved cleanup candidates"
source_files:
  - "docs/99_cleanup/Cleanup_Candidate_Review.md"
---

# Trash Index

## 1. Purpose
Dokumen ini mencatat seluruh file dan folder yang dipindahkan ke dalam direktori `trash/` selama proses pembersihan repositori Creative Universe. File di dalam folder trash bersifat diarsipkan dan tidak dihapus secara permanen dari sistem.

## 2. Movement Rules
1. Hanya file/folder berstatus `LOW` risk dan telah disetujui (Approved) dalam dokumen `Cleanup_Candidate_Review.md` yang dipindahkan.
2. Struktur folder asal tetap dipertahankan di dalam subdirektori kategori trash bersangkutan.
3. Tidak melakukan penghapusan permanen (shift + delete) atau pengosongan recycle bin secara sepihak.

## 3. Trash Movement Summary

| Date | Original Path | Trash Path | Category | Risk | Reason | Source Task ID | Rollback Path |
|---|---|---|---|---|---|---|---|
| 2026-06-27 | `apps/backend/apps` | `trash/2026-06-27/temp-files/apps/backend/apps` | temp-files | LOW | Folder kosong residu nama ganda | CLN-001 | `apps/backend/apps` |
| 2026-06-27 | `apps/frontend/node_modules.broken` | `trash/2026-06-27/build-artifacts/apps/frontend/node_modules.broken` | build-artifacts | LOW | Cadangan compiler Tailwind Oxide rusak | CLN-002 | `apps/frontend/node_modules.broken` |
| 2026-06-27 | `apps/backend/.phpunit.result.cache` | `trash/2026-06-27/temp-files/apps/backend/.phpunit.result.cache` | temp-files | LOW | Berkas cache pengujian PHPUnit lokal | CLN-006 | `apps/backend/.phpunit.result.cache` |
| 2026-06-27 | `apps/frontend/tsconfig.tsbuildinfo` | `trash/2026-06-27/build-artifacts/apps/frontend/tsconfig.tsbuildinfo` | build-artifacts | LOW | Berkas cache kompilasi TS Next.js | CLN-007 | `apps/frontend/tsconfig.tsbuildinfo` |

## 4. Items Not Moved

| File/Folder | Reason | Status | Recommended Next Action |
|---|---|---|---|
| `DB Produk Sementara.csv` | Digunakan aktif oleh database seeder `PricetagTestDataSeeder.php` saat inisialisasi lokal. | HIGH | Simpan di repositori sampai pemanggilan seeder di-refaktor menggunakan resources internal. |
| `docs/brainstromming ODDS.md` | Mengandung draf ide spec ODDS 995 baris yang berisiko belum dipindahkan sepenuhnya ke SRD baru. | NEEDS_REVIEW | Ajukan ke Project Owner untuk dikaji ulang sebelum dibuang. |
| `apps/backend/nul` | Sistem I/O Windows memblokir pemindahan berkas karena bentrok dengan reserved name NUL. | LOW (Manual) | Lakukan penghapusan manual menggunakan WSL/Bash atau command prompt via NT path. |

## 5. Rollback Instructions
Untuk mengembalikan berkas yang telah dipindahkan, gunakan command line untuk memindahkannya kembali dari jalur folder trash menuju `Rollback Path` masing-masing.
Contoh:
`Move-Item -Path "trash/2026-06-27/temp-files/apps/backend/.phpunit.result.cache" -Destination "apps/backend/.phpunit.result.cache"`

## 6. NEEDS_REVIEW
- Tinjau file `nul` dan script seeder `DB Produk Sementara.csv`.

## 7. Next Actions
- Lakukan refaktor internal seeder agar tidak lagi bergantung pada CSV di root folder.
- Konsultasikan file draf brainstorming ODDS dengan Project Owner.
