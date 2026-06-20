---
status: VERIFIED
verified_at: 2026-06-19
source: php artisan route:list --json
route_count: 66
---

# Baseline Route Laravel Livewire

Dokumen ini mencatat route aplikasi yang benar-benar aktif sebelum pemisahan backend/frontend. Route package seperti endpoint internal Log Viewer diringkas; hasil `route:list` tetap menjadi pemeriksaan final.

Eksekusi baseline 2026-06-19 menemukan 66 route: 45 route memakai middleware autentikasi dan 21 route bersifat publik atau memakai middleware lain.

## Route halaman dan autentikasi

| Method | URI | Nama route | Akses |
|---|---|---|---|
| GET | `/` | `home` | publik |
| GET, POST | `/register` | `register` untuk GET | guest |
| GET, POST | `/login` | `login` untuk GET | guest |
| POST | `/logout` | `logout` | auth |
| GET | `/forgot-password` | `password.request` | guest |
| GET | `/pending` | `pending` | auth, tidak mensyaratkan akun aktif |
| GET, POST | `/confirm-password` | `password.confirm` untuk GET | auth |
| PUT | `/password` | `password.update` | auth |
| GET | `/verify-email` | `verification.notice` | auth |
| GET | `/verify-email/{id}/{hash}` | `verification.verify` | auth + signed + throttle |
| POST | `/email/verification-notification` | `verification.send` | auth + throttle |
| GET | `/dashboard` | `dashboard` | auth + akun aktif |
| GET | `/profile` | `profile.edit` | auth + akun aktif |
| PATCH | `/profile` | `profile.update` | auth + akun aktif |
| DELETE | `/profile` | `profile.destroy` | auth + akun aktif |
| DELETE | `/profile/session/{session}` | `profile.session.revoke` | auth + akun aktif |
| POST | `/profile/role-settings` | `profile.role-settings.update` | auth + akun aktif |

Catatan penting: akun pending **tidak dapat membuka `/profile` pada route aktual**. Klaim lama bahwa akun pending dapat membuka `/profile` telah dibatalkan.

## Route utilitas dan development

| Method | URI | Nama route | Catatan |
|---|---|---|---|
| GET | `/up` | - | health check Laravel |
| GET | `/ui-test` | `ui-test` | halaman pengujian UI legacy |
| GET | `/dev` | `dev.index` | hanya environment local |
| GET | `/dev/components` | `dev.components` | hanya environment local |
| GET | `/dev/playground` | `dev.playground` | hanya environment local |

## Route Core

| Method | URI | Nama route | Permission |
|---|---|---|---|
| GET | `/users` | `core.users.index` | `manage-users` |
| GET | `/users/pending` | `core.users.pending` | `approve-users` |
| POST | `/users/{user}/approve` | `core.users.approve` | `approve-users` |
| POST | `/users/{user}/reject` | `core.users.reject` | `approve-users` |
| GET | `/roles` | `core.roles.index` | `manage-roles` |
| GET | `/maintenance` | `core.maintenance` | `run-artisan` |
| GET | `/log-viewer/{view?}` | `log-viewer.index` | policy package Log Viewer |

Pada legacy application, mutasi role dilakukan oleh komponen Livewire melalui `POST /livewire/update`. Route `POST /roles`, `PATCH /roles/{role}`, dan `DELETE /roles/{role}` belum ada.

## Route Pricetag

| Method | URI | Nama route | Akses |
|---|---|---|---|
| GET | `/pricetag` | `pricetag.` | auth + aktif + `access-pricetag` |
| GET | `/pricetag/search` | `pricetag.search` | auth + aktif + `access-pricetag` |
| GET | `/pricetag/generator` | `pricetag.generator` | auth + aktif + `access-pricetag` |
| GET | `/pricetag/history` | `pricetag.history` | auth + aktif + `access-pricetag` |
| GET | `/pricetag/database` | `pricetag.database` | tambahan `pricetag.manage` |

## Broadcasting

`GET|POST /broadcasting/auth` tersedia untuk otorisasi channel Laravel Broadcasting. Target backend baru harus memindahkan middleware autentikasinya ke konfigurasi Sanctum yang sesuai.

## Web Artisan endpoint aktual

Seluruh endpoint memakai prefix `/_cmd` dan header `X-Artisan-Token` melalui `ArtisanTokenMiddleware`.

| Method | URI | Command |
|---|---|---|
| GET | `/_cmd/migrate` | `migrate --force` |
| GET | `/_cmd/migrate-fresh` | `migrate:fresh --force` |
| GET | `/_cmd/storage-link` | `storage:link` |
| GET | `/_cmd/clear-cache` | `optimize:clear` |
| GET | `/_cmd/seed-permissions` | `db:seed --class=RolePermissionSeeder --force` |
| GET | `/_cmd/seed` | `db:seed --force` |
| GET | `/_cmd/queue-restart` | `queue:restart` |
| GET | `/_cmd/queue-work` | `queue:work --stop-when-empty` |

`migrate-fresh` dan seeding penuh tercatat karena route tersebut memang ada, tetapi keduanya tidak boleh digunakan pada production. Pada backend baru, operasi destruktif harus dihapus atau dibatasi sehingga tidak dapat dijalankan saat `APP_ENV=production`.
