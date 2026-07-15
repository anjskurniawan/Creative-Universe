---
status: APPROVED
version: 1.0
revised: 2026-06-19
---

# Terminologi dan Konvensi

| Istilah resmi | Makna | Hindari |
|---|---|---|
| backend | Laravel 11 REST API di `apps/backend` | BE dalam dokumen formal |
| frontend | Next.js + React di `apps/frontend` | FE dalam dokumen formal |
| legacy application | Snapshot Laravel Livewire di `legacy/laravel-livewire` | aplikasi utama |
| API endpoint | Route HTTP milik Laravel dengan prefix `/api/v1` | page route |
| page route | Route halaman milik Next.js | API route |
| Web Artisan endpoint | Endpoint operasional Laravel dengan command allowlist | API publik |
| Root | Role dengan otoritas sistem tertinggi | Superadmin |
| Sub-App | Modul bisnis di Creative Universe | microservice, kecuali benar-benar dipisah |
| Core | Capability lintas Sub-App: account, auth, RBAC, profile, settings, chat, notification, asset/file, dan activity log | tempat menaruh business rule semua aplikasi |
| KV Retail Task | Sub-App pengelolaan tugas Key Visual retail | Homework Task, KV Retail Store |
| Creative Report | Sub-App laporan dan penilaian Creative | Jangan memakai Creative Performance Report sebagai nama aplikasi |
| One Dashboard Design System | Nama resmi Sub-App dengan singkatan ODDS | mengganti kepanjangan berdasarkan bentuk implementasi |
| Generator | Sub-App induk untuk berbagai jenis generator | menganggap setiap generator sebagai Sub-App tingkat atas |
| Pricetag | Generator pembuatan pricetag di dalam Sub-App Generator | Pricetag sebagai Sub-App tingkat atas |
| Creative Artificial Intelligence | Nama resmi aplikasi eksperimen; UI memakai Creative AI dan backend memakai key `cai` | Creative Artificial Intelligen |
| Design Assets | Nama resmi aplikasi eksperimen pengelolaan aset desain | Assets Design |
| Documentation | Fitur Core untuk dokumentasi aplikasi | Docs sebagai nama produk resmi |
| asset link | Referensi URL eksternal pada tabel `asset_links` | istilah polymorphic lain |
| `linkable_type`, `linkable_id` | Kolom polymorphic resmi asset link | nama kolom alternatif |
| batch | Satu kelompok pekerjaan generate | job, jika yang dimaksud record bisnis |
| queue job | Unit pekerjaan Laravel Queue | batch |

## Konvensi route

- REST API: `/api/v1/{resource}`.
- Resource memakai plural kebab-case: `/pricetag-products`.
- Next.js page route tidak memakai prefix `/api`.
- Route operasional Laravel tetap terpisah dari REST API.
- Nama route Laravel memakai pola `api.v1.{module}.{resource}.{action}` jika route name dibutuhkan.
- Permission key memakai pola `{app}.{resource}.{action}`, misalnya `kv-retail.tasks.create`.
- Label permission pada UI menggunakan alias Bahasa Indonesia dan tidak menampilkan key teknis sebagai label utama.
- Prefix tabel mengikuti pemilik domain: `kv_retail_*`, `creative_report_*`, `odds_*`, `generator_pricetag_*`, `cai_*`, dan `design_assets_*`.

## Konvensi response

```json
{
  "success": true,
  "message": "Data berhasil diambil.",
  "data": {},
  "meta": {}
}
```

Validation error menggunakan HTTP `422` dan field error berbentuk object:

```json
{
  "success": false,
  "message": "Data yang diberikan tidak valid.",
  "errors": {
    "email": ["Email sudah digunakan."]
  }
}
```

## Konvensi status

- Gunakan enum/domain constant pada backend, bukan string tersebar.
- Status batch Pricetag: `pending`, `processing`, `completed`, `failed`.
- Status batch item: `pending`, `success`, `failed`.
- Label UI diterjemahkan ke Bahasa Indonesia tanpa mengubah nilai kontrak API.
