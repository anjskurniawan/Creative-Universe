---
title: "Creative Universe Documentation Index"
status: "ACTIVE"
version: "1.0"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
---

# Creative Universe Documentation Index

## 1. Purpose
Dokumen ini merupakan indeks utama yang memetakan seluruh dokumentasi teknis di dalam monorepo Creative Universe, memudahkan developer menavigasi berkas secara hierarkis dan logis.

## 2. How to Read These Docs
Setiap file dokumentasi memiliki YAML frontmatter yang menunjukkan metadata seperti `status` (ACTIVE, TARGET, LEGACY, dll), `version`, dan `revised` (tanggal pembaruan ISO). Selalu perhatikan status dokumen sebelum mengambil keputusan arsitektur.

## 3. Source of Truth
Berdasarkan aturan tata kelola, hirarki sumber kebenaran data teknis (dari prioritas tertinggi ke terendah) adalah:
1. Keputusan arsitektur ter-approve (`docs/00_architecture/`)
2. SRD target backend/frontend (`docs/03_backend_api/` dan `docs/04_frontend_nextjs/`)
3. Spesifikasi kebutuhan bisnis asli (`docs/01_core_system/` dan `docs/02_pricetag_generator/`)
4. Dokumentasi dan file legacy (`legacy/` dan file usang).

## 4. Governance Docs
Dokumen tata kelola penulisan dan klasifikasi dokumentasi:
- [Source of Truth Rules](file:///c:/laragon/www/creativeuniverse/docs/00_governance/Source_of_Truth_Rules.md) — Aturan prioritas penentuan keputusan teknis.
- [Status Label Standard](file:///c:/laragon/www/creativeuniverse/docs/00_governance/Status_Label_Standard.md) — Standar label status (ACTIVE, TARGET, LEGACY, dll).
- [Documentation Classification Index](file:///c:/laragon/www/creativeuniverse/docs/99_cleanup/Documentation_Classification_Index.md) — Daftar inventaris status seluruh berkas dokumentasi.

## 5. Architecture Docs
Keputusan arsitektur tingkat tinggi:
- [Headless Architecture](file:///c:/laragon/www/creativeuniverse/docs/00_architecture/Headless_Architecture.md) — Desain monorepo terpisah.
- [Architecture Decision Log](file:///c:/laragon/www/creativeuniverse/docs/00_architecture/Architecture_Decision_Log.md) — Log keputusan arsitektur (ADR).
- [Terminology and Conventions](file:///c:/laragon/www/creativeuniverse/docs/00_architecture/Terminology_and_Conventions.md) — Konvensi penamaan dan istilah kamus data.

## 6. Backend API Docs
- [Laravel REST API SRD](file:///c:/laragon/www/creativeuniverse/docs/03_backend_api/Laravel_REST_API_SRD.md) — Spesifikasi kebutuhan sistem API backend.
- [API Route Map](file:///c:/laragon/www/creativeuniverse/docs/03_backend_api/API_Route_Map.md) — Peta rute API backend riil hasil verifikasi `route:list`.

## 7. Frontend Next.js Docs
- [NextJS Frontend SRD](file:///c:/laragon/www/creativeuniverse/docs/04_frontend_nextjs/NextJS_Frontend_SRD.md) — Spesifikasi antarmuka Next.js target.
- [Frontend Structure Verification](file:///c:/laragon/www/creativeuniverse/docs/04_frontend_nextjs/Frontend_Structure_Verification.md) — Hasil audit struktur folder frontend.
- [Frontend API & Auth Verification](file:///c:/laragon/www/creativeuniverse/docs/04_frontend_nextjs/Frontend_API_Auth_Verification.md) — Analisis detail integrasi client API, CSRF, dan Echo.

## 8. Database and ERD Docs
- [Creative Universe MainApp ERD](file:///c:/laragon/www/creativeuniverse/docs/01_core_system/CreativeUniverse-MainApp_ERD.md) — Skema database sistem utama.
- [Database ERD Verification](file:///c:/laragon/www/creativeuniverse/docs/05_database/Database_ERD_Verification.md) — Hasil pemetaan migrasi riil backend vs ERD lama.

## 9. Security Docs
- [RBAC and Permission Matrix](file:///c:/laragon/www/creativeuniverse/docs/06_security/RBAC_and_Permission_Matrix.md) — Matriks peran (roles) dan perizinan Spatie.
- [Maintenance Command Security](file:///c:/laragon/www/creativeuniverse/docs/06_security/Maintenance_Command_Security.md) — Evaluasi keamanan command remote Web Artisan.
- [Environment and Broadcasting Security](file:///c:/laragon/www/creativeuniverse/docs/06_security/Environment_and_Broadcasting_Security.md) — Keamanan variabel lingkungan dan keputusan Pusher/Reverb.

## 10. Operations Docs
- [Operations Verification](file:///c:/laragon/www/creativeuniverse/docs/08_operations/Operations_Verification.md) — Panduan deployment cPanel, static export, local dev, dan gaps operasional.

## 11. Module Docs
Dokumentasi spesifik untuk Sub-App modul individu:
- [Creative Universe MainApp SRD](file:///c:/laragon/www/creativeuniverse/docs/01_core_system/CreativeUniverse-MainApp_SRD.md)
- [Pricetag Generator SRD](file:///c:/laragon/www/creativeuniverse/docs/02_pricetag_generator/CreativeUniverse-SubApp_PricetagGenerator_SRD.md)
- [ODDS Sub-App SRD](file:///c:/laragon/www/creativeuniverse/docs/06_odds/CreativeUniverse-SubApp_ODDS_SRD.md) (Status: OUTDATED)
- [ODDS Sub-App ERD](file:///c:/laragon/www/creativeuniverse/docs/06_odds/CreativeUniverse-SubApp_ODDS_ERD.md) (Status: OUTDATED)

## 12. Cleanup and Audit Docs
- [Repository and Docs Audit](file:///c:/laragon/www/creativeuniverse/docs/99_cleanup/Repository_And_Docs_Audit.md) — Laporan awal audit repo.
- [Enterprise Refactor Task List](file:///c:/laragon/www/creativeuniverse/docs/99_cleanup/Enterprise_Refactor_Task_List.md) — Daftar tugas terstruktur per batch.
- [ODDS Implementation Verification](file:///c:/laragon/www/creativeuniverse/docs/99_cleanup/ODDS_Implementation_Verification.md) — Detail sinkronisasi implementasi ODDS.

## 13. NEEDS_REVIEW Docs
Terdapat file dokumentasi yang tidak selaras dengan implementasi riil dan membutuhkan ulasan berkala:
- [brainstromming ODDS.md](file:///c:/laragon/www/creativeuniverse/docs/brainstromming%20ODDS.md) — Catatan coret-coretan ide ODDS.
- [Documentation Gap Register](file:///c:/laragon/www/creativeuniverse/docs/99_cleanup/Documentation_Gap_Register.md) — Daftar lubang informasi dokumentasi.

## 14. Recommended Reading Order
Bagi developer baru yang bergabung di proyek:
1. `docs/00_governance/Source_of_Truth_Rules.md` (Pahami tata tertib penentuan kebenaran)
2. `docs/README.md` (Pahami peta navigasi ini)
3. `docs/00_architecture/Headless_Architecture.md` (Ketahui kerangka headless yang digunakan)
4. `docs/03_backend_api/Laravel_REST_API_SRD.md` dan `docs/04_frontend_nextjs/NextJS_Frontend_SRD.md` (Pahami kontrak API & Frontend)
5. `docs/08_operations/Operations_Verification.md` (Ikuti alur deployment).
