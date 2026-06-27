---
title: "Needs Review Register"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
---

# Needs Review Register

## 1. Purpose
Mendata dan memantau seluruh berkas, fungsionalitas, atau modul di dalam monorepo Creative Universe yang dinilai memiliki ambiguitas arsitektur, perbedaan antara spesifikasi dokumentasi dengan kenyataan kode, atau memiliki risiko keamanan/operasi yang memerlukan keputusan dari Project Owner.

## 2. Items Requiring Review

| ID | Area | File/Folder | Reason | Risk | Owner Decision Needed | Recommended Next Action |
|---|---|---|---|---|---|---|
| REV-001 | Database / Seeders | `DB Produk Sementara.csv` | Telah direfaktor. Seeder kini membaca dari copy lokal di `apps/backend/database/seeders/data/`. | RESOLVED | - | Hapus file usang di root pada batch pembersihan final. |
| REV-002 | ODDS / Docs | `docs/brainstromming ODDS.md` | Dokumen brainstorming 995 baris. Transisi bisnis ke manajemen tugas telah DISETUJUI oleh owner. | RESOLVED | Persetujuan untuk menghapus file secara permanen setelah porting fungsionalitas tuntas. | Porting sisa keputusan produk ke specs ODDS baru. |
| REV-003 | Security / Realtime | `laravel/reverb` (composer) | Pustaka server websocket Reverb terinstal di backend meskipun Pusher merupakan broadcaster aktif tunggal saat ini. | LOW | Keputusan apakah Reverb harus sepenuhnya di-uninstall dari backend. | Hapus package reverb dari backend jika Pusher resmi digunakan secara permanen. |
| REV-004 | Operations / Windows | `apps/backend/nul` | Berkas reserved device Windows NUL yang terbuat secara tidak sengaja di backend. Mengakibatkan command Windows biasa gagal menghapusnya. | LOW | Instruksi pembersihan manual bagi developer Windows. | Gunakan instruksi Command Prompt NT namespace path atau WSL untuk menghapus berkas. |

## 3. Next Actions
- Berikan daftar ini kepada Project Owner untuk ditinjau dan diselesaikan.
- Lakukan refaktor teknis pada seeder database backend (`REV-001`).

## 4. Manual Cleanup Notes
- **Windows `nul` file (`REV-004`)**: File bernama `nul` di `apps/backend` adalah berkas *reserved* di Windows. Jangan gunakan skrip otomatis untuk menghapusnya. Developer harus menghapusnya secara manual menggunakan Command Prompt: `del "\\?\C:\laragon\www\creativeuniverse\apps\backend\nul"` atau via terminal WSL: `rm apps/backend/nul`.
