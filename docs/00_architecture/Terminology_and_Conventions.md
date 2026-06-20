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
| Pricetag Generator | Nama Sub-App | Price Tag/PriceTag yang berubah-ubah |
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
