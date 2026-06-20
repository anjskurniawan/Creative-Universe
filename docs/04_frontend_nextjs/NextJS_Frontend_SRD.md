---
status: DRAFT
version: 1.1
revised: 2026-06-20
depends_on: ../03_backend_api/Laravel_REST_API_SRD.md
---

# SRD Next.js Frontend

## 1. Tujuan

Frontend Next.js menggantikan seluruh Blade, Livewire, Volt, dan Alpine pada aplikasi aktif. Implementasi legacy tetap menjadi referensi UX selama migrasi, bukan dependency runtime.

## 2. Struktur

```text
apps/frontend/
├── app/                     page routes dan layout
├── components/              shared UI
├── features/                auth, core, pricetag
├── lib/                     API client, auth, realtime, utilities
├── public/
└── tests/
```

## 3. Target page route

| Route | Akses | Sumber data utama |
|---|---|---|
| `/` | publik | konten landing |
| `/login` | guest | auth API |
| `/register` | guest | auth API |
| `/forgot-password` | guest | OTP API |
| `/pending` | auth pending | `/auth/me` |
| `/dashboard` | auth aktif | dashboard API |
| `/profile` | auth aktif | profile API |
| `/users` | `manage-users` | users API |
| `/users/pending` | `approve-users` | pending users API |
| `/roles` | `manage-roles` | roles/permissions API |
| `/maintenance` | `run-artisan` | maintenance API berbasis Sanctum; bukan Web Artisan secret endpoint |
| `/pricetag/search` | `access-pricetag` | categories/products API |
| `/pricetag/generator` | `access-pricetag` | generation API |
| `/pricetag/history` | `access-pricetag` | batches API |
| `/pricetag/database` | `pricetag.manage` | category/product/import API |

Per 2026-06-20, route Core `/`, auth, `/pending`, `/dashboard`, `/profile`, serta route administrasi M6 `/users`, `/users/pending`, dan `/roles` sudah tersedia sebagai static export dan terhubung ke REST API. Route M7 `/pricetag/search` dan `/pricetag/database` juga sudah operasional; route generation/history tetap diselesaikan pada M8.

Halaman `/users` mencakup search/filter, pengelolaan akun, reset password admin, aktivasi, role, direct permission, whitelist delegasi Manajer, dan audit/session Root-only. Halaman `/users/pending` memakai listener Pusher tanpa polling periodik serta menyediakan approve/reject dengan konfirmasi. Halaman `/roles` menyediakan pembuatan role, perubahan permission, dan penghapusan role non-protected.

## 4. Auth dan authorization UX

- Session di-bootstrap dari `GET /api/v1/auth/me`.
- Frontend boleh menyembunyikan menu berdasarkan permission, tetapi backend tetap memutuskan akses.
- `401` mengarah ke login.
- `403` menampilkan halaman akses ditolak.
- akun pending diarahkan ke `/pending` dan tidak dapat membuka `/profile` sampai backend rule berubah.
- `419` memicu refresh CSRF/session yang aman.

## 5. Data fetching

- Data server dan mutation memakai satu API client terpusat.
- Base path API browser memakai URL relatif `/api/v1`; hostname API terpisah tidak digunakan.
- Cookie dikirim dengan credentials.
- Error `422` dipetakan ke field form.
- Query key/cache key dikelompokkan per feature.
- Event realtime hanya memicu invalidasi/refetch, bukan menjadi satu-satunya sumber data.

Notifikasi Core memakai private channel `App.Models.Core.User.{id}`. Browser hanya menerima identifier/status minimum dari Pusher lalu mengambil ulang data melalui `GET /api/v1/notifications`. Kredensial frontend dibatasi pada `NEXT_PUBLIC_PUSHER_KEY` dan `NEXT_PUBLIC_PUSHER_CLUSTER`; Pusher secret tetap hanya berada di backend.

Frontend memakai `laravel-echo` 2.3.7 dan `pusher-js` 8.5.0 dengan cluster dari `NEXT_PUBLIC_PUSHER_CLUSTER` (saat ini `ap1`). Halaman `/users/pending` subscribe ke `private-admin.notifications` dan mendengar `.PendingUserRegistered`; event hanya memicu refetch REST API. Build production wajib memiliki `NEXT_PUBLIC_PUSHER_KEY`. Polling `setInterval` tidak digunakan sebagai fallback karena dapat menciptakan respons balapan dengan event realtime.

## 6. UI/UX

- Semua label dan pesan berbahasa Indonesia.
- Semua aksi server memiliki loading, disabled, success, error, dan retry state.
- Aksi destruktif memiliki modal konfirmasi.
- Wizard Pricetag mempertahankan enam langkah dan deep link `?product_id={id}`.
- Search Pricetag mempertahankan alur kategori lalu produk/varian.
- Accessibility keyboard, focus, label, dan contrast menjadi acceptance criteria.

## 7. Deployment tanpa terminal production

- Hostname frontend adalah `https://creative.doran.id`.
- REST API production berada di `https://creative.doran.id/api/v1`.
- Frontend dan backend memakai satu shared hosting cPanel serta origin yang sama.
- `next.config` wajib memakai `output: 'export'`.
- Halaman tidak boleh membutuhkan SSR, ISR runtime, Server Actions, Next.js Route Handlers/API Routes, atau middleware Next.js.
- Server Component hanya boleh dipakai jika seluruh outputnya dapat ditentukan saat build; session dan data privat dimuat client-side dari Laravel API.
- Image optimization runtime dinonaktifkan atau memakai external loader yang kompatibel dengan static export.
- Build dijalankan di lokal atau CI.
- Hasil build `out` dipaketkan ke public artifact Laravel tanpa menimpa `index.php`, `.htaccess`, storage link, atau asset backend.
- Deployment utama berbasis Git/cPanel atau artifact upload.
- Production tidak menjalankan process Node.js.
- Frontend tidak boleh mengandalkan Web Artisan Laravel untuk build/restart Node.
- Static route dan deep link harus tetap dapat dilayani Apache; dynamic data memakai query string atau client-side fetch.

## 8. Testing minimum

- unit test utility dan mapper;
- component test untuk form dan permission-driven UI;
- integration test dengan API mock;
- end-to-end test login, pending, approval, role, dan seluruh flow Pricetag;
- test responsive dan accessibility pada halaman kritis.
