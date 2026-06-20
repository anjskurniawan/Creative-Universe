# Dokumentasi Creative Universe

- [Universal AI Agent Handover Prompt](AI_Agent_Handover_Prompt.md)

Dokumentasi ini memakai tiga tingkat sumber kebenaran agar implementasi lama dan arsitektur baru tidak tercampur.

1. `00_architecture/` menetapkan keputusan arsitektur lintas aplikasi.
2. `03_backend_api/` dan `04_frontend_nextjs/` menetapkan target implementasi baru.
3. `01_core_system/` dan `02_pricetag_generator/` menyimpan requirement bisnis, ERD, dan referensi implementasi Laravel Livewire yang masih berjalan selama migrasi.

Jika terdapat konflik, urutan prioritasnya adalah:

1. keputusan arsitektur yang berstatus `APPROVED`;
2. SRD target backend/frontend;
3. requirement bisnis Core/Pricetag;
4. implementasi dan dokumentasi legacy.

## Struktur target repository

```text
creativeuniverse/
├── apps/
│   ├── backend/                 Laravel 11 REST API
│   └── frontend/                Next.js + React
├── legacy/
│   └── laravel-livewire/        Snapshot read-only aplikasi lama
├── docs/
└── README.md
```

## Indeks dokumen

- [Dokumentasi teknis master v2.0](CreativeUniverse_Application_Documentation_v2-0.md)
- [Arsitektur headless](00_architecture/Headless_Architecture.md)
- [Architecture decision log](00_architecture/Architecture_Decision_Log.md)
- [Terminologi dan konvensi](00_architecture/Terminology_and_Conventions.md)
- [Baseline route legacy](05_migration/Legacy_Route_Baseline.md)
- [Strategi migrasi](05_migration/Livewire_to_Headless_Migration.md)
- [Milestone roadmap refactor](05_migration/Milestone_Roadmap.md)
- [M0 - Baseline dan keputusan](05_migration/M0_Baseline_and_Decisions.md)
- [SRD Laravel REST API](03_backend_api/Laravel_REST_API_SRD.md)
- [SRD Next.js](04_frontend_nextjs/NextJS_Frontend_SRD.md)
- [SRD Core](01_core_system/CreativeUniverse-MainApp_SRD.md)
- [ERD Core](01_core_system/CreativeUniverse-MainApp_ERD.md)
- [SRD Pricetag](02_pricetag_generator/CreativeUniverse-SubApp_PricetagGenerator_SRD.md)

## Aturan pembaruan

- Perubahan route harus memperbarui route test dan dokumen kontrak pada commit yang sama.
- Perubahan skema database harus memperbarui migration, model, ERD, dan API resource terkait.
- File dalam `legacy/` tidak menjadi sumber kebenaran dan tidak menerima fitur baru.
- Dokumen menggunakan UTF-8, Bahasa Indonesia, istilah dari kamus resmi, dan tanggal ISO `YYYY-MM-DD`.
