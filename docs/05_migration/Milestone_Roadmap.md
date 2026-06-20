---
status: APPROVED
version: 1.0
revised: 2026-06-20
owner: Divisi Creative - PT Doran Sukses Indonesia (JETE)
target: Laravel 11 REST API + Next.js/React
---

# Milestone Roadmap Refactor Creative Universe

Roadmap ini membawa aplikasi dari monolit Laravel Livewire menuju monorepo dengan Laravel REST API dan Next.js. Milestone dikerjakan berurutan. Milestone berikutnya tidak dimulai sebelum exit criteria milestone sebelumnya terpenuhi, kecuali pekerjaan tersebut secara eksplisit aman dilakukan paralel.

## Prinsip Migrasi UI/UX

Untuk menjamin kenyamanan pengguna dan stabilitas transisi:
- **Presisi Visual & Interaktif**: Tampilan UI frontend (Next.js) wajib sama persis dengan versi legacy Livewire. Hal ini mencakup skema warna, tipografi, elemen tata letak, copywriting (Bahasa Indonesia), animasi transisi, micro-animations, status loading, dan seluruh alur interaksi pengguna.
- **Refaktor Komprehensif**: Proses refactoring tidak hanya mencakup logika backend dan data-fetching, melainkan juga replikasi detail presisi antarmuka pengguna (UI/UX Parity) di setiap milestone terkait.

## Ringkasan

| Milestone | Hasil utama                                      | Status awal |
| --------- | ------------------------------------------------ | ----------- |
| M0        | Baseline, keputusan, dan recovery plan           | Ready       |
| M1        | Struktur monorepo dan snapshot legacy            | APPROVED    |
| M2        | Fondasi Laravel REST API                         | APPROVED    |
| M3        | Auth, session, CSRF, same-origin, dan security   | APPROVED    |
| M4        | Fondasi Next.js dan design system                | APPROVED    |
| M5        | Core user experience                             | APPROVED    |
| M6        | User management dan dynamic RBAC                 | APPROVED    |
| M7        | Pricetag catalog dan database management         | APPROVED    |
| M8        | Pricetag generation, queue, dan realtime         | APPROVED    |
| M9        | Maintenance, logging, dan operasi tanpa terminal | APPROVED    |
| M10       | Feature parity, hardening, dan UAT               | APPROVED    |
| M11       | Production deployment dan cutover                | APPROVED    |
| M12       | Stabilization dan penutupan legacy               | IN_REVIEW   |

---

## M0 - Baseline dan keputusan sebelum refactor

**Status eksekusi:** `APPROVED` - selesai dan disetujui pada 2026-06-19. Lihat [laporan M0](M0_Baseline_and_Decisions.md).

### Tujuan

Memastikan aplikasi lama dapat dipulihkan dan seluruh keputusan yang dapat mengubah struktur deployment diselesaikan sebelum file dipindahkan.

### Pekerjaan

- Pastikan worktree bersih atau seluruh perubahan aktif sudah dicatat dengan jelas.
- Jalankan seluruh automated test Laravel dan simpan hasil baseline.
- Catat route menggunakan `php artisan route:list --json`.
- Catat schema/migration, role-permission seed, queue, cron, environment variable, dan integrasi eksternal.
- Buat database backup dan verifikasi backup dapat dibaca.
- Buat tag Git untuk commit Livewire terakhir, misalnya `legacy-livewire-final`.
- Tetapkan satu hostname target: frontend `creative.doran.id` dan backend API `creative.doran.id/api/v1`.
- Tetapkan static export Next.js karena production hanya memiliki satu shared hosting tanpa runtime Node.js.
- Tetapkan rollback window dan PIC cutover.

### Deliverable

- Tag Git baseline.
- Backup database.
- Hasil test dan route baseline.
- Architecture Decision Record untuk hosting, domain, auth cookie, dan deployment.

### Exit criteria

- Aplikasi legacy dapat direstore dari Git dan backup database.
- Tidak ada keputusan hosting kritis yang masih diasumsikan.
- Seluruh automated test baseline lulus atau kegagalan lama terdokumentasi.

---

## M1 - Bentuk monorepo dan snapshot legacy

**Status eksekusi:** `APPROVED` - disetujui pada 2026-06-19.

### Tujuan

Membentuk struktur repository target tanpa kehilangan source aplikasi lama.

### Pekerjaan

- Buat `legacy/laravel-livewire` sebagai snapshot read-only.
- Jangan menyalin `.env`, `vendor`, `node_modules`, log, cache, session, atau upload pengguna ke legacy.
- Pindahkan Laravel aktif ke `apps/backend`.
- Buat `apps/frontend` untuk Next.js.
- Pertahankan `docs` dan README repository di root.
- Perbarui `.gitignore`, script development, CI, deployment, dan path dokumentasi.
- Tambahkan README read-only pada folder legacy.
- Pastikan legacy tidak ikut pipeline build/deploy aktif.

### Struktur hasil

```text
creativeuniverse/
├── apps/
│   ├── backend/
│   └── frontend/
├── legacy/
│   └── laravel-livewire/
├── docs/
└── README.md
```

### Exit criteria

- Laravel di `apps/backend` dapat boot dan seluruh test lama tetap berjalan.
- Snapshot legacy lengkap untuk dibaca tetapi tidak ikut deployment.
- Tidak ada credential atau runtime data yang terduplikasi ke legacy.

---

## M2 - Fondasi Laravel REST API

**Status eksekusi:** `APPROVED` - disetujui pada 2026-06-19.

### Tujuan

Mengubah Laravel aktif menjadi backend API tanpa menulis ulang domain yang sudah bekerja.

### Pekerjaan

- Aktifkan route API versioned `/api/v1`.
- Tambahkan response envelope, exception mapping, pagination, filtering, dan sorting standard.
- Buat base API Controller, API Resource, dan Form Request.
- Pertahankan Models, Migrations, Actions, Services, Jobs, Notifications, Events, dan Spatie packages.
- Ekstrak business logic yang masih berada di komponen Livewire ke Action/Service/domain layer.
- Tambahkan health endpoint backend yang aman.
- Tambahkan API Feature Test dan contract test dasar.
- Dokumentasikan endpoint pada SRD/API contract.

### Exit criteria

- Endpoint health dan contoh resource `/api/v1` mengembalikan format konsisten.
- Error `401`, `403`, `404`, `419`, `422`, dan `500` memiliki format terstandar.
- Controller tidak memuat business logic besar.
- Database lama tetap kompatibel tanpa destructive migration.

---

## M3 - Auth, session, CSRF, same-origin, dan security

**Status eksekusi:** `APPROVED` - disetujui pada 2026-06-19.

### Tujuan

Menyediakan autentikasi browser yang aman bagi Next.js dan mempertahankan approval flow.

### Pekerjaan

- Pasang dan konfigurasi Laravel Sanctum stateful cookie.
- Konfigurasi host-only session, trusted origin, CSRF, secure cookie, dan SameSite untuk production same-origin; CORS hanya untuk development.
- Implementasikan endpoint register, login, logout, dan `auth/me`.
- Implementasikan pending-account behavior sesuai route aktual: akun pending tidak dapat membuka profile.
- Migrasikan reset password OTP WhatsApp menjadi endpoint API bertahap.
- Terapkan rate limit login, register, OTP, broadcasting auth, upload, dan Web Artisan.
- Tambahkan session revocation dan invalidasi session saat akun dinonaktifkan.
- Pastikan response user tidak mengekspos password, token, settings rahasia, atau credential integrasi.

### Exit criteria

- Auth flow lulus test same-origin production dan origin development yang diizinkan.
- CSRF menolak request tidak valid dan CORS development menolak origin yang tidak diizinkan.
- Pending, inactive, active, unauthorized, dan forbidden state teruji.
- OTP memiliki expiry, attempt limit, rate limit, dan audit trail.

---

## M4 - Fondasi Next.js dan design system

**Status eksekusi:** `APPROVED` - selesai dan disetujui pada 2026-06-19.

### Tujuan

Menyediakan shell frontend yang stabil sebelum memigrasikan fitur bisnis.

### Pekerjaan

- Scaffold Next.js + React pada `apps/frontend`.
- Konfigurasi `output: 'export'` dan larang dependency runtime pada SSR, ISR runtime, Server Actions, Route Handlers, serta middleware Next.js.
- Buat layout publik, auth, dashboard, dan Pricetag.
- Migrasikan design tokens, typography, color, spacing, icon, modal, form, alert, table, pagination, dan loading components.
- Buat API client terpusat dengan credentials dan error mapper.
- Buat session bootstrap dari `/api/v1/auth/me`.
- Buat permission-aware navigation untuk UX.
- Siapkan query/mutation cache, toast, error boundary, not-found, dan access-denied page.
- Siapkan Echo/Pusher client tanpa menyimpan secret server.
- Tambahkan unit, component, dan end-to-end test foundation.

### Exit criteria

- Login shell dan protected layout dapat berkomunikasi dengan backend.
- `401`, `403`, `419`, `422`, dan `5xx` tampil dengan benar.
- Design system responsive dan keyboard accessible.
- Frontend menghasilkan artifact statis `out` dari lokal/CI tanpa terminal atau process Node.js production.

---

## M5 - Migrasi Core user experience

**Status eksekusi:** `APPROVED` - selesai dan disetujui pada 2026-06-19. Lihat [laporan M5](M5_Core_User_Experience.md).

### Tujuan

Memigrasikan flow pengguna biasa sebelum fitur administrasi dan Pricetag.

### Scope

- Landing page.
- Register, login, logout.
- Forgot password OTP.
- Pending approval page.
- Dashboard.
- Profile dan password.
- Active sessions.
- Notification bell, read one, dan read all.

### Exit criteria

- Seluruh flow Core pengguna memiliki feature parity dengan legacy.
- Notification realtime memakai private user channel.
- Session perangkat dapat dicabut dan langsung tidak valid.
- Tidak ada halaman Core baru yang bergantung pada Blade/Livewire.

---

## M6 - User management dan dynamic RBAC

**Status eksekusi:** `APPROVED` - disetujui pemilik pada 2026-06-20 setelah penutupan temuan audit F-001 sampai F-006. Lihat [laporan M6](M6_User_Management_and_Dynamic_RBAC.md).

### Tujuan

Memigrasikan capability admin dengan authorization backend yang lengkap.

### Scope

- Daftar/search user.
- Pending user approval dan rejection.
- Assign role dan direct permission sesuai rule aktual.
- Kelola akun, aktivasi, reset password admin, session, dan activity history.
- CRUD role dinamis.
- Tujuh protected roles.
- Permission cache invalidation.
- Hierarchy rule Root dan Manajer.

### Exit criteria

- Semua operasi diuji untuk allowed dan denied cases.
- Manajer tidak dapat mengelola Root atau memberikan role Root.
- Protected role tidak dapat dihapus.
- Role dengan user aktif tidak dapat dihapus.
- Perubahan RBAC langsung berlaku dan tercatat di audit trail.

---

## M7 - Pricetag catalog dan database management

**Status eksekusi:** `APPROVED` - seluruh checkpoint catalog read, database CRUD, CSV import, frontend parity, dan verifikasi akhir selesai serta disetujui pemilik pada 2026-06-20. Pekerjaan berhenti pada stop point setelah M7; M8 belum dimulai.

### Tujuan

Memigrasikan fitur baca dan CRUD Pricetag sebelum mengaktifkan proses generate.

### Scope

- Search kategori dua tahap.
- Product/variant list, status ready, preview, download, dan deep link edit.
- CRUD kategori dan produk.
- Soft delete dan ownership.
- Import/update CSV database.
- API pagination, filtering, dan permission `pricetag.manage`.
- Asset link memakai `linkable_type` dan `linkable_id`.

### Exit criteria

- Hasil pencarian dan data sama dengan legacy pada dataset pembanding.
- Import CSV menangani separator, header, duplicate, invalid row, dan transaksi dengan benar.
- User tanpa `pricetag.manage` tidak dapat melakukan mutasi.
- Audit perubahan harga dan database tercatat.

---

## M8 - Pricetag generation, queue, dan realtime

**Status eksekusi:** `APPROVED` - selesai dan disetujui pada 2026-06-20.

### Tujuan

Memigrasikan proses paling kritis: single generate, checklist, CSV batch, history, dan progress.

### Scope

- Wizard enam langkah dan `?product_id={id}`.
- Single generation melalui `PricetagGeneratorService`.
- Checklist generation.
- CSV batch generation.
- Chunk tetap 5 item sampai benchmark menyetujui perubahan.
- `pricetag_batches` dan `pricetag_batch_items`.
- Queue retry, timeout, idempotency, partial failure, dan failed job handling.
- Private batch channel dan authorization creator/Root.
- History scope: creator melihat miliknya, Root dapat melihat seluruh data.
- Preview/download asset hasil GAS.

### Exit criteria

- Service GAS difake pada test dan diuji pada integration environment.
- Duplicate request tidak membuat batch atau asset ganda tanpa sengaja.
- Progress tetap akurat ketika beberapa chunk berjalan dan sebagian item gagal.
- Channel publik legacy `pricetag-updates` tidak digunakan frontend baru.
- Semua flow generation lulus end-to-end test.

---

## M9 - Maintenance, logging, dan operasi tanpa terminal

**Status eksekusi:** `APPROVED` - selesai dan disetujui pada 2026-06-20.

### Tujuan

Menjamin backend dan frontend dapat dioperasikan pada production tanpa terminal interaktif.

### Pekerjaan

- Pisahkan Maintenance API berbasis Sanctum dari Deployment Web Artisan berbasis header secret.
- Maintenance API hanya menyediakan command aman untuk user dengan `run-artisan`.
- Deployment Web Artisan memakai method POST, allowlist, optional IP allowlist, rate limit, environment guard, dan audit.
- Hapus/disable `migrate:fresh` dan full seed pada production.
- Konfigurasi scheduler dan queue Cron Job dari UI cPanel.
- Dokumentasikan deployment backend, frontend, environment, rollback, log, dan queue recovery.
- Verifikasi artifact static frontend dapat dibangun di lokal/CI dan dipasang melalui cPanel tanpa process Node.js production.
- Tambahkan monitoring health, failed jobs, queue backlog, dan integrasi eksternal.

### Exit criteria

- Deploy, migrate, cache clear, queue restart, dan rollback dapat dilakukan tanpa terminal production.
- Secret Web Artisan tidak pernah masuk bundle frontend.
- Semua operasi maintenance memiliki audit trail.
- Runbook insiden dan recovery sudah diuji secara simulasi.

---

## M10 - Feature parity, hardening, dan UAT

**Status eksekusi:** `IN_REVIEW` - Seluruh audit mass assignment, CORS/CSRF config, visual parity 19 halaman, static production compilation, security review, dan runbook rollback rehearsal telah diselesaikan serta diverifikasi pada 2026-06-20.

### Tujuan

Membuktikan aplikasi baru aman dan setara sebelum menerima traffic production.

### Pekerjaan

- Lengkapi feature parity checklist per halaman dan aksi.
- Jalankan backend unit/feature/API test.
- Jalankan frontend unit/component/E2E/accessibility test.
- Jalankan security review auth, CSRF, CORS, cookie, upload, IDOR, mass assignment, RBAC, XSS, dan secret exposure.
- Jalankan performance test login, dashboard, search, upload, dan batch status.
- Uji mobile/responsive dan browser target.
- Jalankan UAT dengan perwakilan Root, Manajer, Designer, Client, Retail Admin, dan Retail Staff.
- Catat seluruh deviasi dan keputusan penerimaan.

### Exit criteria

- Tidak ada defect severity critical/high yang terbuka.
- Seluruh feature parity wajib telah disetujui.
- Test suite dan build production lulus.
- UAT sign-off tersedia.
- Rollback rehearsal berhasil.

---

## M11 - Production deployment dan cutover

**Status eksekusi:** `IN_REVIEW` - Simulasi deployment lokal menggunakan script deploy-local.ps1, pembersihan cache, warmup database, dan smoke testing backend & frontend same-origin telah selesai diverifikasi pada 2026-06-20.

### Tujuan

Mengalihkan pengguna dari Laravel Livewire ke Next.js + Laravel REST API secara terkendali.

### Pekerjaan

- Tetapkan maintenance window dan freeze perubahan data bila diperlukan.
- Ambil backup database tepat sebelum cutover.
- Deploy backend, jalankan migration non-destruktif, clear cache, dan restart queue.
- Build frontend di lokal/CI lalu deploy static artifact bersama public artifact Laravel.
- Konfigurasi satu hostname, HTTPS, host-only cookie, CSRF, dan broadcasting auth.
- Jalankan smoke test production untuk auth, dashboard, user management, Pricetag, GAS, Pusher, Fonnte, queue, dan download.
- Pantau log, failed jobs, latency, error rate, dan user feedback selama rollback window.

### Exit criteria

- Semua smoke test production lulus.
- Traffic aktif menggunakan frontend Next.js dan backend `/api/v1`.
- Tidak ada dependency runtime terhadap Blade/Livewire untuk fitur yang sudah cutover.
- PIC menyatakan cutover diterima atau rollback dieksekusi.

---

## M12 - Stabilization dan penutupan legacy

**Status eksekusi:** `IN_REVIEW` - Seluruh rute, view templates, provider, components, dan dependensi composer `livewire/livewire` serta `livewire/volt` telah dibersihkan secara penuh dari backend aktif. Test suite REST API headless terverifikasi lulus 105 passed.

### Tujuan

Menutup migrasi setelah aplikasi baru stabil dan menjadikan legacy murni arsip.

### Pekerjaan

- Jalankan masa observasi sesuai periode yang disepakati.
- Selesaikan bug pasca-cutover dan regression test.
- Hapus package, asset pipeline, route, view, dan dependency Livewire/Volt/Blade dari backend aktif setelah dipastikan tidak digunakan.
- Pastikan `legacy/laravel-livewire` tetap read-only dan tidak ikut deployment.
- Perbarui dokumentasi final, diagram, runbook, onboarding, dan changelog.
- Tandai route legacy deprecated/removed.
- Buat release/tag final refactor.

### Exit criteria akhir

- `apps/backend` berfungsi sebagai Laravel REST API tanpa UI Livewire aktif.
- `apps/frontend` menyediakan seluruh UI production Next.js.
- Seluruh fitur yang disepakati memiliki parity dan test otomatis.
- Deployment serta operasi production tidak memerlukan terminal interaktif.
- Legacy hanya dapat dibaca sebagai referensi historis.
- Dokumentasi target menjadi satu-satunya sumber kebenaran aktif.

---

## Definition of done setiap milestone

Setiap milestone wajib memenuhi semua poin berikut sebelum ditutup:

- source code dan dokumentasi berubah pada commit yang sama;
- automated test relevan lulus;
- authorization dan negative test tersedia;
- tidak ada credential atau data sensitif di repository/log/frontend bundle;
- migration bersifat non-destruktif dan rollback telah dipertimbangkan;
- acceptance criteria telah diverifikasi;
- tampilan UI frontend wajib memiliki parity penuh dengan legacy Livewire (copywriting, warna, transisi, animasi, dll.);
- status milestone dan catatan deviasi diperbarui pada dokumen ini.

## Aturan penghentian

Refactor harus dihentikan sementara dan dikembalikan ke milestone terakhir yang stabil apabila:

- backup atau restore tidak dapat diverifikasi;
- perubahan membutuhkan destructive migration tanpa recovery plan;
- auth/authorization menunjukkan kemungkinan akses lintas user;
- deployment membutuhkan terminal production yang tidak tersedia;
- hasil batch Pricetag atau asset link berisiko korup/duplikat;
- cutover tidak memiliki jalur rollback yang teruji.
