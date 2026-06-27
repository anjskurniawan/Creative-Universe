---
status: ACTIVE
version: 1.0
revised: 2026-06-20
inherits:
  - ../01_core_system/CreativeUniverse-MainApp_SRD.md
  - ../02_pricetag_generator/CreativeUniverse-SubApp_PricetagGenerator_SRD.md
---

# SRD Laravel 11 REST API

Dokumen ini menetapkan kontrak target backend. Endpoint di bawah belum dianggap aktif sampai route, controller, test, dan dokumentasi API tersedia di `apps/backend`.

## 1. Standar umum

- Prefix: `/api/v1`.
- Format: JSON, kecuali upload menggunakan `multipart/form-data`.
- Auth browser: Sanctum stateful cookie.
- Endpoint privat: `auth:sanctum` dan middleware akun aktif.
- Authorization: policy/gate/Spatie pada setiap operasi.
- Validasi: Form Request dengan pesan Bahasa Indonesia.

Konfigurasi production yang disetujui:

- base URL backend: `https://creative.doran.id/api/v1`;
- origin frontend dan backend: `https://creative.doran.id`;
- `SESSION_DOMAIN` tidak diisi agar cookie bersifat host-only;
- `SANCTUM_STATEFUL_DOMAINS=creative.doran.id`;
- production tidak memerlukan CORS lintas-origin; allowlist CORS hanya dipakai untuk origin development yang eksplisit;
- cookie production memakai HTTPS dan secure flag.
- Serialization: API Resource; jangan mengembalikan model mentah.
- Pagination metadata mengikuti response envelope resmi.

## 2. Target endpoint Core

### Auth

| Method | Endpoint | Akses | Tujuan |
|---|---|---|---|
| POST | `/api/v1/auth/login` | guest | membuat session |
| POST | `/api/v1/auth/logout` | auth | mengakhiri session aktif |
| GET | `/api/v1/auth/me` | auth | bootstrap user, role, permission, status |
| POST | `/api/v1/auth/password/otp` | guest | meminta OTP WhatsApp |
| POST | `/api/v1/auth/password/otp/verify` | guest | memverifikasi OTP |
| POST | `/api/v1/auth/password/reset` | guest | menetapkan password baru |

### Profile dan session

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/v1/profile` | auth + aktif |
| PATCH | `/api/v1/profile` | auth + aktif |
| PUT | `/api/v1/profile/password` | auth + aktif |
| POST | `/api/v1/profile/avatar` | auth + aktif; multipart image maksimal 2 MB |
| DELETE | `/api/v1/profile` | Root sesuai rule aktual |
| GET | `/api/v1/profile/sessions` | auth + aktif |
| DELETE | `/api/v1/profile/sessions/{session}` | auth + aktif |
| GET | `/api/v1/profile/activities` | auth + aktif |
| PATCH | `/api/v1/profile/settings` | auth + policy setting |

### Dashboard dan notification

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/v1/dashboard` | auth + aktif |
| GET | `/api/v1/notifications` | auth + aktif |
| PATCH | `/api/v1/notifications/{notification}/read` | owner |
| PATCH | `/api/v1/notifications/read-all` | auth + aktif |

Endpoint M5 yang sudah aktif dan teruji per 2026-06-19 adalah auth, dashboard, `GET/PATCH /profile`, perubahan password, upload avatar, active sessions, serta notification pada tabel di atas. `DELETE /profile` dan `PATCH /profile/settings` tetap merupakan kontrak target dan belum menjadi route aktif; keduanya tidak boleh dipanggil frontend sampai milestone terkait menyediakannya.

### AI Agent

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/api/v1/ai/chat` | auth + `access-core` |

Endpoint `/api/v1/ai/chat` terintegrasi dengan Google AI Studio Gemini API (model `gemini-3.5-flash`). Payload menerima `message` (string wajib), `agent_type` (wajib: `storyboard`, `thumbnail`, atau `copywriting`), dan `history` (array opsional berisi pesan-pesan sebelumnya untuk mempertahankan konteks multi-turn). Controller memanggil `GeminiService` untuk berinteraksi dengan API Google secara aman menggunakan `GEMINI_API_KEY` dari server.

### User dan role

| Method | Endpoint | Permission |
|---|---|---|
| GET | `/api/v1/users` | `manage-users` |
| GET | `/api/v1/users/options` | `manage-users` atau `approve-users`; hasil dibatasi capability pemanggil |
| GET | `/api/v1/users/{user}` | `manage-users`; session/activity hanya Root |
| PATCH | `/api/v1/users/{user}` | `manage-users` + policy hierarchy |
| GET | `/api/v1/users/{user}/audit` | Root |
| GET | `/api/v1/users/{user}/sessions` | Root |
| DELETE | `/api/v1/users/{user}/sessions/{session}` | Root |
| GET | `/api/v1/users/whitelist-manager-permissions` | Root |
| POST | `/api/v1/users/whitelist-manager-permissions` | Root |
| GET | `/api/v1/roles` | `manage-roles` |
| POST | `/api/v1/roles` | `manage-roles` |
| PATCH | `/api/v1/roles/{role}` | `manage-roles` |
| DELETE | `/api/v1/roles/{role}` | `manage-roles` + protected-role rule |
| GET | `/api/v1/permissions` | `manage-roles` |

Endpoint M6 pada tabel di atas aktif dan teruji per 2026-06-20. Response user management memisahkan direct permission (`permissions`) dari permission efektif gabungan role (`all_permissions`). Manajer tidak dapat membaca atau mengubah Root, tidak dapat memberikan role Root, dan hanya dapat mengubah direct permission yang masuk whitelist serta dimilikinya sendiri. Permission target di luar kewenangan Manajer dipertahankan oleh backend. Manajer tidak memiliki akses audit terbatas terhadap bawahan: endpoint audit dan session pengguna lain seluruhnya Root-only, dengan guard pada route dan controller.

### Maintenance UI

| Method | Endpoint | Permission | Tujuan |
|---|---|---|---|
| GET | `/api/v1/maintenance/status` | `run-artisan` | status queue/config yang aman ditampilkan |
| POST | `/api/v1/maintenance/commands` | `run-artisan` | menjalankan command dari allowlist UI |

Maintenance API memakai session Sanctum dan CSRF. Ia tidak menerima atau mengembalikan `ARTISAN_SECRET`. Command pemeliharaan mencakup pembersihan cache, restart antrean, pembuatan tautan storage, migrasi database, seeding, pemicu antrean, pembersihan log/data usang (activity logs, notifications, failed jobs, temp uploads, stale records, token password resets), serta optimasi cache sistem. Perintah destruktif (seperti `migrate-fresh` dan seeding penuh) dilindungi oleh guard environment dan otomatis ditolak pada environment production.

## 3. Target endpoint Pricetag

Semua endpoint memerlukan akun aktif dan `access-pricetag`. Endpoint mutasi database juga memerlukan `pricetag.manage`.

| Method | Endpoint | Tujuan |
|---|---|---|
| GET | `/api/v1/pricetag/categories` | daftar/search kategori |
| GET | `/api/v1/pricetag/products` | daftar/search produk dan varian |
| GET | `/api/v1/pricetag/products/{product}` | detail produk dan asset link |
| POST | `/api/v1/pricetag/generations/single` | generate satu produk |
| POST | `/api/v1/pricetag/generations/checklist` | membuat batch pilihan |
| POST | `/api/v1/pricetag/generations/csv` | upload CSV dan membuat batch |
| GET | `/api/v1/pricetag/batches` | history sesuai scope user |
| GET | `/api/v1/pricetag/batches/{batch}` | progress dan batch items |
| POST | `/api/v1/pricetag/categories` | membuat kategori |
| PATCH | `/api/v1/pricetag/categories/{category}` | mengubah kategori |
| DELETE | `/api/v1/pricetag/categories/{category}` | soft delete kategori |
| POST | `/api/v1/pricetag/products` | membuat produk |
| PATCH | `/api/v1/pricetag/products/{product}` | mengubah produk |
| DELETE | `/api/v1/pricetag/products/{product}` | soft delete produk |
| POST | `/api/v1/pricetag/imports/products` | import/update database CSV |

Per 2026-06-20, endpoint baca `GET /pricetag/categories`, `GET /pricetag/categories/{category}`, `GET /pricetag/products`, dan `GET /pricetag/products/{product}` sudah aktif. Endpoint produk mendukung `category_id`, `search`, `status=ready|not_ready`, sorting, dan pagination. CRUD kategori dan produk juga aktif dengan `pricetag.manage`, ownership otomatis, soft delete, validasi kombinasi produk/varian, serta audit perubahan harga. Kategori yang masih memiliki produk aktif tidak dapat dihapus. Alias lama `/pricetag-categories` hanya dipertahankan sementara untuk kompatibilitas dan bukan kontrak frontend baru.

Import database `POST /pricetag/imports/products` aktif dengan multipart field `file`, permission `pricetag.manage`, ukuran maksimal 2 MB, separator koma/titik koma, dan alias header Indonesia/Inggris. Format template kanonis adalah `kategori,produk,variant,harga normal,harga diskon`; alias lama dengan underscore tetap diterima. Import bersifat atomic: duplicate atau baris invalid mengembalikan 422 beserta nomor baris tanpa partial write. Record aktif diperbarui dan record soft-deleted yang cocok dipulihkan.

## 4. Web Artisan

Web Artisan bukan bagian dari REST API. Implementasi baru mempertahankan capability minimum untuk `migrate --force`, `storage:link`, `optimize:clear`, permission seed, queue restart, dan queue worker fallback.

Target route Web Artisan menggunakan method `POST`. Route `GET /_cmd/*` hanya milik baseline legacy dan tidak diteruskan sebagai desain baru.

Setiap eksekusi harus tercatat pada `activity_log`. `migrate:fresh` dan seeding penuh harus ditolak ketika environment production.

## 5. Realtime

- broadcaster: Pusher (`BROADCAST_CONNECTION=pusher`; alias kompatibilitas `BROADCAST_DRIVER=pusher`);
- package backend: `pusher/pusher-php-server` 7.2.8;
- cluster: `PUSHER_APP_CLUSTER`, saat ini `ap1`;
- channel notifikasi: private per user `private-App.Models.Core.User.{id}`;
- channel batch Pricetag: private per batch dan hanya dapat diakses creator atau Root;
- payload event hanya memuat identifier dan status minimum;
- detail data diambil ulang melalui REST API setelah event diterima.

## 6. Testing minimum

- auth, CSRF, same-origin production, CORS development, dan rate limiting;
- active middleware;
- seluruh permission dan hierarchy Root/Manajer;
- validation response `422`;
- ownership history batch;
- upload CSV invalid/valid;
- service GAS difake pada test;
- broadcasting authorization;
- Web Artisan token, IP allowlist, environment guard, dan audit.
