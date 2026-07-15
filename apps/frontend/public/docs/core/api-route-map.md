# Creative Universe API Route Map

**Status:** ACTIVE
**Verified:** 2026-07-15 melalui `php artisan route:list --json`

## Ringkasan

- Total route aplikasi dan package: **146**.
- Route API `/api/v1`: **112**.
- Seluruh route Sub-App memakai prefix kanonis dan tidak memiliki compatibility alias lama.

| Prefix API | Jumlah | Ownership |
|---|---:|---|
| `auth` | 6 | Core |
| `cai` | 1 | Creative AI, experimental |
| `chat` | 4 | Core |
| `creative-reports` | 5 | Creative Report |
| `dashboard` | 1 | Core |
| `generator` | 17 | Generator / Pricetag |
| `health` | 1 | Core |
| `kv-retail` | 7 | KV Retail Task |
| `maintenance` | 2 | Core, restricted |
| `notifications` | 3 | Core |
| `odds` | 40 | One Dashboard Design System |
| `onboarding` | 2 | Core |
| `permissions` | 1 | Core |
| `profile` | 7 | Core |
| `roles` | 4 | Core |
| `settings` | 2 | Core |
| `users` | 9 | Core |

## Route publik

- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/password/otp`
- `POST /api/v1/auth/password/otp/verify`
- `POST /api/v1/auth/password/reset`

Route lain membutuhkan autentikasi atau middleware authorization sesuai domainnya.

## Prefix kanonis Sub-App

- KV Retail Task: `/api/v1/kv-retail/*`
- Creative Report: `/api/v1/creative-reports/*`
- ODDS: `/api/v1/odds/*`
- Generator Pricetag: `/api/v1/generator/pricetag/*`
- Creative AI: `/api/v1/cai/*`
- Design Assets: `/api/v1/design-assets/*` belum memiliki endpoint aktif.

## Route operasional non-API

- Broadcasting authorization: `/broadcasting/auth`.
- Maintenance cPanel: `POST /_cmd/*`, dilindungi token dan rate limit.
- Log Viewer: `/log-viewer/*`, mengikuti authorization package.
- Laravel health: `/up`.

## Verifikasi wajib

Setiap perubahan route harus menjalankan `php artisan route:list --json`, test backend, build frontend, dan memperbarui dokumen ini. URL lama tidak boleh ditambahkan kembali tanpa keputusan compatibility window.
