---
status: APPROVED
version: 1.0
revised: 2026-06-19
owner: Divisi Creative - PT Doran Sukses Indonesia (JETE)
---

# Arsitektur Headless Creative Universe

## 1. Keputusan

Creative Universe dimigrasikan dari monolit Laravel Livewire menjadi monorepo headless:

```text
Browser
   │
   ▼
Next.js + React (`apps/frontend`)
   │ HTTPS JSON / multipart / WebSocket
   ▼
Laravel 11 REST API (`apps/backend`)
   │
   ├── MySQL
   ├── database queue
   ├── Pusher
   ├── Fonnte
   └── Google Apps Script
```

Laravel tetap menjadi satu-satunya pemilik business rule, autentikasi, otorisasi, database, audit, queue, dan integrasi eksternal. Next.js tidak mengakses database atau credential layanan eksternal secara langsung.

## 2. Batas tanggung jawab

### Backend

- menyediakan REST API dengan prefix `/api/v1`;
- menjalankan validasi otoritatif melalui Form Request;
- menjalankan policy, gate, dan permission Spatie;
- mengelola session, CSRF, queue, notifikasi, audit, dan file;
- menyediakan broadcasting authorization;
- memanggil GAS dan Fonnte melalui Service Class;
- menyediakan Web Artisan endpoint terproteksi untuk operasi Laravel yang memang dibutuhkan tanpa terminal.

### Frontend

- menyediakan halaman, layout, form, loading state, dan navigasi;
- mengonsumsi kontrak API, bukan model database;
- memakai Client Component untuk state/session interaktif; Server Component hanya boleh menghasilkan konten statis saat build;
- menampilkan permission dari payload user hanya untuk UX; keputusan akses tetap milik backend;
- menerima event realtime lalu melakukan invalidasi/refetch data terkait.

### Legacy

`legacy/laravel-livewire` adalah snapshot read-only. Folder ini tidak ikut build, test, atau deployment aplikasi baru.

## 3. Autentikasi

Target autentikasi browser adalah Laravel Sanctum stateful cookie. Frontend dan backend memakai origin production yang sama, `https://creative.doran.id`.

Alur minimum:

1. frontend meminta CSRF cookie;
2. frontend mengirim kredensial ke backend;
3. backend membuat session dan mengembalikan user beserta role/permission;
4. seluruh endpoint privat memakai `auth:sanctum` dan middleware akun aktif;
5. frontend menangani `401`, `403`, `419`, dan `422` secara konsisten.

Token bearer tidak menjadi default untuk browser. Token dapat ditambahkan kemudian untuk consumer non-browser melalui keputusan arsitektur terpisah.

## 4. Static export dan constraint production

Node.js hanya digunakan di lokal atau CI untuk development, test, dan build Next.js. Production tidak menjalankan process Node.js dan tidak bergantung pada akses terminal interaktif.

Next.js wajib memakai static export. Fitur yang membutuhkan runtime Node.js tidak boleh digunakan, termasuk SSR, ISR runtime, Server Actions, Route Handlers/API Routes Next.js, middleware Next.js, dan pembacaan cookie/header pada server runtime.

Build frontend menghasilkan `apps/frontend/out`. Artifact statis tersebut dipublikasikan bersama Laravel `public` secara terkontrol. Web Artisan Laravel tidak boleh dipakai untuk menjalankan `npm` atau membangun Next.js.

Apache melayani file Next.js yang sudah ada secara langsung. Request `/api/v1`, `/sanctum`, broadcasting authorization, dan endpoint operasional Laravel diteruskan ke `public/index.php` Laravel.

## 5. Operasi Laravel tanpa terminal

Backend memiliki dua jalur operasi yang tidak boleh dicampur:

1. **Deployment Web Artisan** untuk operator/deployment client, memakai header secret dan optional IP allowlist. Jalur ini menangani migration, cache, storage link, permission seed, dan queue fallback.
2. **Maintenance API** untuk halaman admin Next.js, memakai Sanctum, CSRF, permission `run-artisan`, environment guard, dan allowlist yang lebih sempit. Secret Web Artisan tidak pernah dikirim ke frontend.

Deployment Web Artisan mengikuti ketentuan:

- dilindungi secret pada header, optional IP allowlist, rate limit, dan audit log;
- tidak memuat secret pada query string;
- hanya command allowlist yang boleh dijalankan;
- target endpoint command menggunakan method `POST`; method `GET` pada legacy hanya dicatat sebagai baseline migrasi;
- response tidak boleh membocorkan credential atau environment;
- command destruktif seperti `migrate:fresh` dan seeding penuh dilarang di production;
- endpoint operasional tidak berada di bawah kontrak REST publik `/api/v1`.

Queue dan scheduler tetap dipicu melalui Cron Job yang dikonfigurasi dari UI cPanel. Endpoint `queue-work` hanya fallback operasional, bukan pengganti cron permanen.

## 6. Realtime

Pusher menjadi baseline realtime selama migrasi. Channel notifikasi user dan progress batch wajib private/presence sesuai kebutuhan; channel publik yang mengekspos ID atau status operasional tidak diperbolehkan pada target baru.

Frontend berlangganan event melalui Laravel Echo/Pusher client. Backend selalu memverifikasi user pada broadcasting authorization endpoint.

## 7. Data dan integrasi

- Database tetap satu dan dimiliki backend.
- Prefix tabel per Sub-App tetap dipertahankan.
- Polymorphic asset menggunakan istilah `linkable_type` dan `linkable_id`.
- Ownership memakai `created_by`, `updated_by`, `deleted_by`.
- Integrasi GAS, Fonnte, dan provider lain hanya berada di `apps/backend/app/Services`.

## 8. Topologi production yang disetujui

- frontend statis: `https://creative.doran.id`;
- backend API: `https://creative.doran.id/api/v1`;
- hosting: satu shared hosting cPanel;
- session cookie: host-only, secure, HTTP-only, dan SameSite sesuai kebutuhan;
- CORS production: tidak diperlukan untuk komunikasi same-origin;
- deployment frontend: static artifact dari build lokal/CI;
- deployment backend: Git/cPanel dan Web Artisan terproteksi untuk operasi Laravel yang diizinkan.

Konfigurasi Next.js wajib tetap kompatibel dengan static export. Halaman dinamis menggunakan client-side data fetching ke `/api/v1`; route yang memerlukan parameter build-time harus memiliki daftar parameter statis atau memakai query string.
