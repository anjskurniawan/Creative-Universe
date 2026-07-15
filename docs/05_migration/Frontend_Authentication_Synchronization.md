# Frontend Authentication Synchronization

**Status:** ACTIVE
**Phase:** F9 completed
**Verified:** 2026-07-15

## 1. Tujuan

F9 menyelaraskan lifecycle autentikasi Next.js dengan session cookie Laravel Sanctum: bootstrap session, login, logout, session expiry, password reset OTP WhatsApp, onboarding, serta redirect setelah autentikasi.

## 2. Core Auth boundary

Contract auth berada di:

```text
apps/frontend/src/core/auth/
├── api.ts
├── redirects.ts
├── types.ts
└── index.ts
```

`AuthUser` mengikuti `UserProfileResource` backend dan hanya memuat setting yang diizinkan backend. Page Auth tidak memanggil endpoint secara langsung.

## 3. Session lifecycle

1. `AuthProvider` memanggil `GET /api/v1/auth/me` satu kali saat bootstrap.
2. Response sukses menetapkan user terautentikasi.
3. Response `401` menetapkan state guest tanpa redirect dari bootstrap.
4. Request aktif lain yang menerima `401` mengirim event `creative-universe:auth-session-expired`.
5. Provider membersihkan user sebelum API client menuju `/login?redirect={current-path}`.
6. Ini mencegah RouteGuard membaca user lama dan mengarahkan pengguna kembali dari Login.

Tidak ada token auth yang disimpan di local storage. Sumber autentikasi adalah cookie session Laravel.

## 4. Login dan logout

- Login mengambil CSRF cookie, kemudian mengirim username/password ke `/auth/login`.
- Response login sudah mengandung profil `AuthUser`; frontend tidak lagi memanggil `/auth/me` untuk kedua kalinya.
- Invalid credential `422` tetap masuk ke `ValidationError` per field.
- Logout memanggil backend untuk invalidate session, kemudian selalu membersihkan state browser.
- Redirect logout memakai URL kanonis `/login`.

## 5. Redirect pascaautentikasi

`resolveAuthenticatedRoute()` digunakan bersama oleh Login dan RouteGuard dengan urutan:

1. User belum onboarding → `/onboarding`.
2. Redirect internal yang diminta dan aman.
3. Preferensi `settings.redirect_to` yang aman.
4. Root → `/dashboard`.
5. User lain → `/`.

Redirect eksternal, protocol-relative, guest route, dan `/onboarding` untuk user yang sudah onboarding ditolak. RouteGuard juga mengeluarkan user yang sudah onboarding dari halaman onboarding.

## 6. Password reset OTP

`authApi.passwordReset` menangani:

- request OTP dengan `login` berupa email atau username;
- verifikasi OTP enam digit;
- pengiriman ulang OTP;
- reset password dengan `password_confirmation`.

Seluruh langkah menggunakan session yang sama dan cookie CSRF. Frontend tidak menyimpan OTP atau email reset ke local storage/session storage.

## 7. Onboarding

`authApi.onboarding` memiliki DTO kanonis untuk division, position, dan payload submit. Setelah submit berhasil, frontend refresh user dan baru mengarahkan ke dashboard. Aturan Creative serta single occupancy Manajer/SPV tetap menjadi tanggung jawab backend.

## 8. Error dan keamanan

- `401`: session expired/guest.
- `419`: refresh CSRF satu kali oleh Core API client.
- `422`: field validation.
- Open redirect dicegah oleh `safeInternalRedirect`.
- Cookie session tidak dibaca atau dimanipulasi frontend.
- Logout lokal tetap dilakukan jika backend tidak dapat dijangkau.

## 9. Acceptance F9

- Page Auth memakai `core/auth`, bukan endpoint inline.
- Login tidak melakukan request profil ganda.
- State user dibersihkan saat session expired.
- Login dan RouteGuard memakai resolver redirect yang sama.
- OTP dan onboarding sesuai payload backend.
- Backend Auth/OTP/Onboarding test lulus.
- TypeScript, lint auth tanpa error, dan production build lulus.
- Dokumentasi tersedia melalui `/docs`.
