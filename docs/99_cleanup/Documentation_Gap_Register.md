---
title: "Documentation Gap Register"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
source_files:
  - "docs/99_cleanup/Repository_And_Docs_Audit.md"
  - "docs/99_cleanup/Enterprise_Refactor_Task_List.md"
---

# Documentation Gap Register

## 1. Purpose
Mengidentifikasi, mencatat, dan merekomendasikan tindakan perbaikan untuk lubang-lubang informasi (gaps) dalam dokumentasi monorepo Creative Universe, meliputi dokumen yang hilang, lemah, kedaluwarsa, tumpang tindih, atau memiliki label status yang keliru.

## 2. Verification Method
Dibuat dengan membandingkan seluruh dokumen di dalam `docs/` terhadap hasil audit repositori di `Repository_And_Docs_Audit.md` dan analisis riil file backend/frontend pada Batch 1 hingga Batch 5.

## 3. Missing Docs

| Area | Missing Doc | Risk | Recommended Action |
|---|---|---|---|
| Database/ERD | `docs/05_database/Core_ERD.md` | Tidak ada visualisasi ERD terpusat untuk skema tabel core dan chat yang baru. | Konsolidasikan model core ke dalam file baru `Core_ERD.md` termasuk tabel `conversations` dan `messages`. |
| Operations | `docs/08_operations/cPanel_Cron_Jobs.md` | Risiko kegagalan eksekusi Queue Worker dan Scheduler di shared hosting cPanel jika instruksi tidak jelas. | Buat panduan konfigurasi Cron Job untuk scheduler dan queue:work di cPanel. |
| Operations | `docs/08_operations/Release_Checklist_and_Rollback.md` | Risiko downtime atau rusaknya public assets jika proses rilis Next.js static export manual gagal tanpa rollback plan. | Buat panduan rilis bertahap beserta skema backup/restore untuk direktori `public/`. |
| Chat Module | `docs/07_modules/chat/Chat_SRD.md` | Modul chat (`/chat/*`) sudah diimplementasikan di backend, namun tidak memiliki spesifikasi fungsional maupun API contract terdokumentasi. | Buat dokumen SRD khusus untuk modul Chat. |

## 4. Weak Docs

| File | Weakness | Risk | Recommended Action |
|---|---|---|---|
| `docs/README.md` | Sebelumnya hanya memuat daftar tautan dokumen acak tanpa urutan pembacaan terstruktur. | Developer baru mengalami kebingungan ("cognitive overload") saat mempelajari sistem. | Gunakan urutan baca terstruktur ("Recommended Reading Order") yang mengedepankan dokumen tata kelola (governance) terlebih dahulu. |
| `docs/08_operations/Operations_Verification.md` | Analisis deployment cPanel masih bersifat teoretis dan tidak memiliki detail perintah otomasi script. | Kesalahan manual menyalin artefak build frontend Next.js ke folder public backend. | Tambahkan referensi runbook taktis untuk memicu deploy terotomasi tanpa SSH. |

## 5. Outdated Docs

| File | Outdated Claim | Current Evidence | Recommended Action |
|---|---|---|---|
| `docs/06_odds/CreativeUniverse-SubApp_ODDS_SRD.md` | Menggunakan terminologi "Tickets" dan rute `/tickets`. | Implementasi backend menggunakan model "Tasks" dan rute `/tasks` yang teruji 100% lulus tes. | Tulis ulang dokumen SRD ODDS dengan paradigma "Tasks", "Queue", dan "Escalation". |
| `docs/06_odds/CreativeUniverse-SubApp_ODDS_ERD.md` | Mendefinisikan tabel-tabel seperti `odds_tickets`, `odds_ticket_versions`, dsb. | Migrasi database riil menciptakan tabel `odds_tasks`, `odds_task_versions`, dll. | Perbarui ERD ODDS agar selaras dengan skema database riil. |

## 6. Duplicate or Overlapping Docs

| File A | File B | Overlap | Recommended Action |
|---|---|---|---|
| `docs/01_core_system/CreativeUniverse-MainApp_ERD.md` | `docs/05_database/Database_ERD_Verification.md` | Keduanya mengulas struktur database inti. | Jadikan MainApp_ERD.md sebagai master model grafis/teks, sementara Database_ERD_Verification.md hanya fokus pada hasil verifikasi migrasi aktual. |
| `docs/README.md` | `docs/99_cleanup/Documentation_Classification_Index.md` | Keduanya mendaftar inventaris berkas dokumen. | README.md ditujukan untuk navigasi umum ("Index"), sedangkan Classification Index ditujukan untuk manajemen pembersihan dan tata kelola ("Governance"). |

## 7. Status Label Issues

| File | Current Status | Issue | Recommended Status |
|---|---|---|---|
| `docs/06_odds/CreativeUniverse-SubApp_ODDS_SRD.md` | `ACTIVE` (asumsi implisit) | Dokumen out-of-date terhadap implementasi riil. | `OUTDATED` / `NEEDS_REVIEW` |
| `docs/06_odds/CreativeUniverse-SubApp_ODDS_ERD.md` | `ACTIVE` (asumsi implisit) | Skema database di dokumen tidak cocok dengan migrasi riil. | `OUTDATED` / `NEEDS_REVIEW` |

## 8. NEEDS_REVIEW
- Status kepemilikan bisnis ODDS: Apakah peralihan dari sistem tiket menjadi sistem tugas tugas (Tasks/Queue) telah disetujui secara bisnis oleh Project Owner?
- Keberadaan file `docs/brainstromming ODDS.md` yang tumpang tindih dan tidak terstruktur. Harus dihapus atau dipindahkan ke arsip sampah.

## 9. Next Actions
- Lakukan refactor komprehensif pada file SRD dan ERD ODDS agar statusnya dapat naik kembali menjadi `ACTIVE` yang terverifikasi.
- Buat file `Core_ERD.md` untuk mencakup tabel perpesanan instan (Chat) yang baru diimplementasikan.
