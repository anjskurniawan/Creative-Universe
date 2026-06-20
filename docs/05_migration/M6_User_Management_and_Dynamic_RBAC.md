---
status: APPROVED
version: 1.0
revised: 2026-06-20
owner: Divisi Creative - PT Doran Sukses Indonesia (JETE)
milestone: M6
---

# M6 - User Management dan Dynamic RBAC

## Status

Temuan audit internal F-001 sampai F-006 telah ditindaklanjuti dan diverifikasi. Pemilik menyatakan M6 `APPROVED` pada 2026-06-20; milestone ditutup dan M7 boleh dimulai.

## Kondisi saat pekerjaan dilanjutkan

M6 terhenti di tengah implementasi backend. Controller, request, resource, action, route, dan draft test sudah tersedia, tetapi belum operasional:

- `RoleController` mengalami parse error karena deklarasi method `index()` hilang;
- test daftar role tidak mengirim request dan masih menulis debug file `scratch_trace.txt`;
- tiga halaman Next.js M6 masih berupa placeholder;
- belum ada endpoint options untuk role/permission sesuai capability pemanggil;
- audit dan session pengguna lain belum tersedia melalui API;
- approve/reject dapat dipanggil terhadap akun yang sudah tidak pending;
- roadmap masih mencatat M6 sebagai `Not started`.

## Hasil implementasi

### User management

- Daftar pengguna dengan pagination, pencarian nama/username/email, dan filter role.
- Daftar pending user diperbarui real-time melalui event Pusher `PendingUserRegistered`; tidak ada polling periodik.
- Approval dengan pemilihan role dan rejection melalui soft delete.
- Approval/rejection ditolak jika target tidak lagi berstatus pending.
- Pengelolaan nama, email, WhatsApp, status aktif, password admin, role, dan direct permission.
- Penonaktifan akun langsung menghapus seluruh session target.
- Root dapat melihat 10 aktivitas terakhir dan session target melalui endpoint khusus serta mencabut session tertentu.
- Manajer tidak memiliki scope audit bawahan: audit dan session pengguna lain sepenuhnya Root-only.
- Manajer tidak dapat membaca/mengubah Root atau memberikan role Root.
- Permission yang dapat dikelola Manajer harus masuk whitelist Root dan dimiliki Manajer tersebut.
- Direct permission target di luar kewenangan Manajer tidak ikut terhapus saat update.
- Seluruh mutasi penting dicatat ke activity log dan permission cache dibersihkan setelah perubahan RBAC.

### Dynamic role management

- Daftar role beserta permission, jumlah total user, dan jumlah user aktif.
- Membuat role dinamis dengan nama unik dan permission pilihan.
- Mengubah permission role. Nama role yang sudah ada tetap read-only sesuai perilaku legacy.
- Menghapus role non-protected yang tidak memiliki user aktif.
- Tujuh role inti dilindungi: Root, Manajer, Supervisor, Designer, Client, Retail Admin, dan Retail Staff.
- Operasi create/update/delete hanya tersedia bagi `manage-roles`.

### Frontend Next.js

- `/users`: tabel parity legacy, search/filter, status, role/direct permission badge, modal kelola akun, audit/session Root-only, dan konfigurasi whitelist Manajer.
- `/users/pending`: kartu registrasi, catatan pendaftaran, pemilihan role, approval, rejection dengan konfirmasi, pagination, dan listener private Pusher tanpa polling.
- `/roles`: tabel role/permission, protected badge, editor permission, pembuatan role, dan konfirmasi delete.
- Seluruh halaman menerapkan permission-aware UI tetapi backend tetap menjadi sumber keputusan authorization.
- Semua halaman tetap kompatibel dengan static export tanpa Server Action, Route Handler, SSR, atau runtime Node.js production.

## Route M6 aktif

```text
GET    /api/v1/users
GET    /api/v1/users/options
GET    /api/v1/users/pending
GET    /api/v1/users/{user}
PATCH  /api/v1/users/{user}
GET    /api/v1/users/{user}/audit
GET    /api/v1/users/{user}/sessions
POST   /api/v1/users/{user}/approve
POST   /api/v1/users/{user}/reject
DELETE /api/v1/users/{user}/sessions/{session}
GET    /api/v1/users/whitelist-manager-permissions
POST   /api/v1/users/whitelist-manager-permissions
GET    /api/v1/roles
POST   /api/v1/roles
PATCH  /api/v1/roles/{role}
DELETE /api/v1/roles/{role}
GET    /api/v1/permissions
```

## Hasil verifikasi

| Pemeriksaan | Hasil |
|---|---|
| Backend full test suite | 124 passed, 7 skipped, 509 assertions |
| Targeted Auth/User/Pusher event | 28 passed, 126 assertions |
| Frontend ESLint | Lulus tanpa error atau warning |
| Frontend production build | Lulus; 19 halaman static export |
| API route discovery | Lulus; route GET audit dan GET sessions tercantum dan mengarah ke `UserController` |
| Scoped Laravel Pint | Lulus untuk file PHP M6 |
| Browser QA desktop (1280×720) | Lulus untuk `/users`, modal audit, whitelist Manajer, `/users/pending`, `/roles`, serta modal create/edit/delete role |
| Browser QA mobile (390×844) | Lulus; tidak ada overflow halaman, tabel memakai scroll horizontal terisolasi, modal dan aksi utama tetap dapat digunakan |
| Frontend route audit | Lulus; 16 route aplikasi merespons HTTP 200 dan RouteGuard menangani pathname dengan atau tanpa trailing slash |
| Backend API route audit | Lulus; 36 route `/api/v1` tetap aktif, health check 200, dan `auth/me` tanpa sesi mengembalikan 401 |
| Tailwind CSS cascade audit | Lulus; base reset dan komponen custom ditempatkan pada `@layer`, sehingga utility layout tidak lagi tertimpa dan landing page kembali setara dengan Blade legacy |

Tujuh test yang dilewati tetap merupakan test legacy email verification dan default password reset. Flow penggantinya tercakup eksplisit oleh `AuthApiTest::test_user_registration_creates_pending_account`, skenario approve/reject pada `UserApiTest`, serta lima skenario request, verify, invalid OTP, reset berhasil, dan reset tanpa verifikasi pada `OtpPasswordApiTest`. Registrasi juga memverifikasi dispatch `PendingUserRegistered`.

## Penutupan temuan audit internal

| ID | Status | Bukti penyelesaian |
|---|---|---|
| F-001 | Selesai | `setInterval` dan refetch periodik dihapus. Frontend subscribe `private-admin.notifications`/`.PendingUserRegistered`; event diterima pada browser aktual dan baris pending muncul tanpa reload. |
| F-002 | Selesai | Scope diputuskan Root-only. Manajer tidak dapat membaca audit/session bawahan maupun Root; route dan controller memiliki guard Root, diverifikasi test 403. |
| F-003 | Selesai | UAT 2026-06-20 memakai MySQL lokal dan HTTP backend aktual dengan akun Manajer aktif: edit Root 403, assign Root 403, permission di luar whitelist 403, update yang sah 200 dan `run-artisan` tetap tersimpan. UI aktual menandai Root sebagai `Protected`. |
| F-004 | Selesai | `GET /api/v1/users/{user}/audit` dan `GET /api/v1/users/{user}/sessions` diimplementasikan, terdaftar pada route list, dan diuji Root 200/Manajer 403. |
| F-005 | Selesai | Coverage approval dan OTP WhatsApp dipetakan ke suite pengganti di atas. |
| F-006 | Selesai | Konfigurasi, versi, cluster, channel, dan event Pusher dicatat pada SRD Core, backend, dan frontend. |

## Review manual yang diperlukan

- Login sebagai Root dan verifikasi `/users`, `/users/pending`, dan `/roles` pada desktop serta mobile.
- Login sebagai Manajer dan pastikan user Root tidak dapat dikelola, role Root tidak muncul, dan direct permission dibatasi whitelist.
- Verifikasi modal kelola akun, reset password, deactivation, session revoke, approval, rejection, pembuatan role, perubahan permission, dan delete role.
- Pastikan perubahan permission langsung memengaruhi navigasi setelah session/user di-refresh.

Pemeriksaan browser lama berbasis mock tetap menjadi bukti layout/interaction. Audit ulang 2026-06-20 menambahkan UAT Manajer dengan frontend ter-deploy, API Laravel, session Sanctum, dan MySQL lokal aktual. Realtime Pusher juga diuji end-to-end dengan browser tetap terbuka di `/users/pending`, registrasi melalui REST API, dan kemunculan akun baru tanpa reload atau polling.

## Keputusan review

Keputusan pemilik pada 2026-06-20: `APPROVED`. M6 ditutup setelah penutupan F-001 sampai F-006 dan M7 diizinkan dimulai.
