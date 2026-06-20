---
status: IN_REVIEW
version: 1.0
revised: 2026-06-19
owner: Divisi Creative - PT Doran Sukses Indonesia (JETE)
milestone: M5
---

# M5 - Core User Experience

## Status

Implementasi dan automated verification selesai. Milestone berada pada `IN_REVIEW` dan tidak boleh diubah menjadi `APPROVED`, serta M6 tidak boleh dimulai, sebelum pemilik melakukan review.

## Audit kondisi awal

Saat pekerjaan dilanjutkan, landing page, alur auth/OTP, pending approval, dashboard shell, dan pencabutan session sudah tersedia. Bagian berikut masih belum lengkap:

- perubahan profil, password, dan avatar belum memiliki API/UI lengkap;
- dashboard masih memakai data shell, belum mengambil statistik backend;
- notification bell masih memakai badge contoh dan belum memiliki API read/read-all;
- client realtime masih berupa mock, bukan Laravel Echo/Pusher;
- response `auth/me` masih berisiko mengirim setting internal yang tidak diperlukan frontend.

## Hasil implementasi

### Backend Laravel

- Menambahkan API dashboard yang membatasi statistik sensitif dan activity terbaru hanya untuk Root.
- Menambahkan API profile untuk membaca/mengubah profil, mengganti password, dan upload avatar maksimal 2 MB.
- Mempertahankan API active session dan memastikan user hanya dapat mencabut session miliknya.
- Menambahkan API notification list, read one, dan read all.
- Menambahkan API Resource untuk user dan notification agar field sensitif/credential internal tidak masuk response.
- Mengeluarkan password dan settings dari activity log user.
- Mengamankan `/broadcasting/auth` dengan `web` dan `auth:sanctum` serta menguji kepemilikan private user channel.
- Mengisolasi broadcast driver pada test agar test tidak menghubungi layanan Pusher eksternal.

Route M5 aktif:

```text
GET    /api/v1/dashboard
GET    /api/v1/profile
PATCH  /api/v1/profile
PUT    /api/v1/profile/password
POST   /api/v1/profile/avatar
GET    /api/v1/profile/sessions
DELETE /api/v1/profile/sessions/{session}
GET    /api/v1/notifications
PATCH  /api/v1/notifications/{notification}/read
PATCH  /api/v1/notifications/read-all
```

### Frontend Next.js

- Dashboard mengambil statistik aktual dan menampilkan bagian Root secara kondisional.
- Profile menyediakan form data diri, perubahan password, upload avatar, dan active session revoke.
- Notification bell mengambil notification aktual, mendukung read one/read all, serta refetch melalui private Echo channel.
- Auth provider dan API client memakai tipe data aman serta menangani guest bootstrap tanpa redirect yang keliru.
- Frontend tetap kompatibel dengan `output: 'export'`; tidak ada SSR, Server Action, Route Handler, atau runtime Node.js production yang ditambahkan.
- Menambahkan contoh environment untuk API relatif dan public Pusher key/cluster. Pusher secret tidak digunakan frontend.

## Hasil verifikasi

| Pemeriksaan | Hasil |
|---|---|
| Backend full test suite | 93 passed, 7 skipped, 320 assertions |
| Frontend ESLint | Lulus tanpa error |
| Frontend production build | Lulus; 19 halaman dihasilkan secara statis |
| Route API | 20 route terdaftar pada `/api/v1` |
| Private channel authorization | Lulus untuk owner dan ditolak untuk user lain |
| Scoped Laravel Pint | Lulus untuk seluruh file PHP yang diubah pada M5 |

Tujuh test yang dilewati adalah test bawaan/legacy untuk email verification dan default password reset yang memang tidak dipakai oleh flow OTP WhatsApp aplikasi ini.

## Review manual yang diperlukan

- Uji profile, password, avatar, session revoke, dan notification bell dari browser dengan beberapa ukuran layar.
- Uji satu notification realtime menggunakan kredensial Pusher environment target. Automated test telah memverifikasi authorization channel, tetapi koneksi live ke layanan eksternal belum dapat dibuktikan tanpa kredensial tersebut.
- Pastikan artifact `apps/frontend/out` dapat disajikan bersama Laravel pada staging same-origin sebelum approval.

## Deviasi dan pekerjaan di luar scope M5

- `DELETE /api/v1/profile` dan `PATCH /api/v1/profile/settings` masih tercatat sebagai kontrak target backend tetapi belum menjadi route aktif. Keduanya tidak termasuk implementation plan M5 yang dilanjutkan pada sesi ini.
- `npm install` melaporkan dua dependency vulnerability tingkat moderate. Audit dan keputusan upgrade perlu dilakukan sebelum production hardening/M10 agar perubahan dependency tidak memperlebar scope review M5.
- Route user management, RBAC, Pricetag, maintenance, serta deployment/cutover tetap mengikuti M6-M11 dan belum dimulai dari pekerjaan ini.

## Keputusan review

Pemilik dapat memilih salah satu hasil berikut:

- `APPROVED`: M5 ditutup dan pekerjaan boleh berlanjut ke M6.
- `CHANGES_REQUESTED`: catat temuan pada dokumen ini dan pertahankan status M5 sebagai `IN_REVIEW` sampai perbaikan diverifikasi.
