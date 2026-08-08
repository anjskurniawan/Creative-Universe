# Frontend API Client Foundation

**Status:** ACTIVE
**Phase:** F7 completed
**Verified:** 2026-07-15

## 1. Tujuan

F7 menetapkan satu fondasi request untuk komunikasi Next.js dengan Laravel. Fondasi berada pada boundary Core dan tidak memiliki pengetahuan tentang domain KV Retail, Creative Report, ODDS, Generator, Creative AI, atau Design Assets.

## 2. Lokasi dan ownership

Implementasi kanonis:

```text
apps/frontend/src/core/api/client.ts
```

`src/lib/api.ts` hanya re-export sementara untuk consumer lama. Import tersebut dimigrasikan ke module domain pada F8 dan kemudian dapat dihentikan tanpa mengubah kontrak client.

## 3. Host dan static export

`NEXT_PUBLIC_API_URL` berisi origin backend tanpa `/api/v1` dan tanpa trailing slash.

- Production cPanel same-origin: kosong.
- Development lintas-origin: contoh `http://creativeuniverse.test`.
- API URL dibentuk oleh `resolveApiUrl()`.
- URL file/backend dibentuk oleh `resolveBackendUrl()` atau `resolveStorageUrl()`.

Frontend tidak bergantung pada Next.js rewrites saat static export production. Rewrites hanya membantu development server.

## 4. Request contract

`apiFetch()` menyediakan:

- cookie authentication dengan `credentials: include`;
- `Accept: application/json`;
- `Content-Type: application/json` hanya ketika request benar-benar memiliki body non-FormData;
- FormData tanpa menetapkan boundary secara manual;
- timeout default 30 detik;
- cancellation melalui `AbortSignal`;
- retry eksplisit hanya untuk `GET`/`HEAD`;
- status retry terbatas pada `408`, `425`, `429`, `502`, `503`, dan `504`;
- satu refresh dan retry CSRF pada `419`;
- response JSON, text, Blob, atau Response mentah;
- helper `apiBlob()` untuk authenticated file download.

Mutation tidak di-retry secara otomatis agar create/update/delete tidak dijalankan dua kali.

## 5. Response envelope

Envelope sukses Laravel:

```json
{
  "success": true,
  "message": "",
  "data": {},
  "meta": {}
}
```

Client mengembalikan `data` langsung. Jika `meta` tersedia, client mempertahankan bentuk `{ data, meta }` agar pagination consumer yang sudah aktif tetap kompatibel.

Response `204` dan `205` dikembalikan sebagai `null`. Binary response tidak dipaksa menjadi JSON.

## 6. Error contract

| Kondisi | Error frontend | Perilaku |
|---|---|---|
| `401` | `ApiError` | Redirect aman ke `/login?redirect=...`, kecuali opt-out |
| `403` | `ForbiddenError` | Pesan backend dipertahankan |
| `419` | retry CSRF sekali | Mutation tidak diulang lebih dari satu kali karena CSRF |
| `422` | `ValidationError` | Field errors dinormalisasi menjadi `Record<string, string[]>` |
| timeout | `RequestTimeoutError` | Status lokal `0` |
| cancellation | `RequestAbortedError` | Tidak diperlakukan sebagai response backend |
| network/server lain | `ApiError` | Status dan payload dipertahankan bila tersedia |

## 7. Keamanan CSRF dan session

Client hanya boleh membersihkan cookie `XSRF-TOKEN` yang dapat diakses browser. Cookie session tidak lagi dicantumkan dalam fungsi pembersihan client. Session dikelola Laravel dan cookie `HttpOnly` tidak boleh dimanipulasi JavaScript.

Upload XHR KV Retail tidak lagi membaca bearer token dari `localStorage`; autentikasi memakai cookie Sanctum. Migrasi envelope, progress, dan lifecycle upload secara penuh tetap dilakukan pada F22.

## 8. Batas tahap

- F8 memindahkan endpoint call menjadi API module per domain.
- F9 menyempurnakan lifecycle autentikasi menggunakan client ini.
- F15 menyatukan authorization Pusher; implementasi Echo ganda belum diubah pada F7.
- F22 menyelesaikan upload/download dan metadata file.
- F31 menambahkan automated contract test frontend.

## 9. Acceptance F7

- Satu API client kanonis tersedia pada Core.
- Host, envelope, error, CSRF, timeout, cancellation, safe retry, FormData, Blob, dan URL file memiliki contract eksplisit.
- Client tidak menghapus nama cookie session.
- Bearer token legacy di upload aktif dihapus.
- TypeScript dan lint API foundation lulus.
- Production build tetap menghasilkan 39 static pages.
- Dokumentasi tersedia melalui `/docs`.
