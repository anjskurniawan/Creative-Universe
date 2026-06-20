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
- Seluruh feedback sukses/gagal pada sub-app Pricetag dikirim ke panel `Pemberitahuan` dan tidak ditampilkan lagi sebagai alert inline di halaman modul.
- Pencarian kategori pada wizard `/pricetag/generator` memakai filter API kategori berbasis query `name` agar hasil list kategori tetap akurat dan konsisten dengan kontrak backend.
- Status sukses/gagal pada flow `Buat Label Satuan` tidak lagi memakai alert di bagian atas halaman; feedback dikirim ke menu `Pemberitahuan` agar area wizard tetap bersih.
- Search Pricetag mempertahankan alur kategori lalu produk/varian.
- Checklist generator `/pricetag/generator` menampilkan katalog awal maksimal 10 item per halaman tanpa mewajibkan pencarian, dan pagination angka dibatasi 3 nomor bergeser (`1 2 3`, lalu `2 3 4`, dan seterusnya).
- Batch name otomatis untuk `Buat Label Sekaligus` mengikuti format `Pricetag Label (dd/mm/yyyy) #n`, dengan `n` diambil dari batch terakhir milik user lalu ditambah 1.
- Generator CSV memakai template kolom `kategori | produk | variant | harga normal | harga diskon`; backend menerima header tersebut secara langsung, tombol unduh template ditempatkan di kanan header box, dan nama batch diisi otomatis dengan format `Pricetag CSV (dd/mm/yyyy) #n`.
- Halaman database Pricetag membuka import CSV lewat tombol header dan modal khusus, menyediakan template CSV kosong, menampilkan nama file terpilih di dalam dropzone, serta menjaga tabel kategori/produk pada maksimum 10 item per halaman sebelum pagination. Parser impor menerima header template `kategori | produk | variant | harga normal | harga diskon` maupun alias underscore versi lama.
- Accessibility keyboard, focus, label, dan contrast menjadi acceptance criteria.
- Ikon UI memakai Google Material Symbols Rounded melalui komponen bersama `MaterialIcon`. Renderer memakai ligature font resmi dengan `FILL=1` sebagai default, optical size mengikuti ukuran komponen, dan weight kontekstual 300 untuk ikon kecil, 400 untuk navigasi, 500 untuk aksi/status, serta 600 untuk emphasis besar. Logo brand dan indikator loading bukan Material Symbol.
- Font Material Symbols dimuat dari stylesheet resmi Google Fonts di root layout dan kompatibel dengan static export; nama ikon tidak lagi dibatasi oleh sprite SVG lokal. Implementasi mengacu pada dokumentasi resmi: https://developers.google.com/fonts/docs/material_symbols.
- Dropdown avatar memakai panel light terstruktur: ringkasan avatar/username/nama, grup navigasi akun, grup administrasi berbasis permission, dan aksi keluar yang dipisahkan divider. Dropdown dapat ditutup lewat klik di luar, tombol `Escape`, atau setelah memilih menu; membuka dropdown avatar juga menutup dropdown aplikasi dan sebaliknya.
- Navbar hanya memiliki varian `light` dan `dark` yang dipilih oleh layout berdasarkan background halaman: landing/dashboard umum memakai `light`, sedangkan route `/pricetag/*` memakai `dark`. Surface navbar mengikuti warna background dengan transparansi dan `backdrop-blur`, tanpa shadow maupun border bawah; warna logo dan kontrol selalu dibuat kontras terhadap background. Preferensi `navbar_variant` milik user tidak mengoverride keputusan layout ini.
- Popup avatar, menu aplikasi, dan notifikasi memakai struktur visual bersama: panel rounded dengan padding internal, header ringkas, divider inset, serta item menu rounded. Ketiganya mengikuti varian navbar; surface/teks light digunakan pada navbar light dan surface gelap/teks putih digunakan pada navbar dark. Popup dapat ditutup melalui klik di luar atau tombol `Escape`.
- Popup notifikasi dark memakai warna judul putih eksplisit, metadata putih semi-transparan dengan kontras yang cukup, dan highlight unread biru transparan. Area daftar notifikasi menggunakan scrollbar custom tipis dengan thumb yang menyesuaikan varian light/dark, bukan tampilan scrollbar bawaan browser.
- Popup avatar menyediakan item aktif `Pengaturan` menuju `/profile`. Item `Profil Saya` tetap ditampilkan sebagai placeholder nonaktif berlabel `Segera` sampai route profil publik tersedia, sehingga tidak membuat tautan rusak atau menduplikasi tujuan pengaturan.

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
