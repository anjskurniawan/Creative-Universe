# Frontend Domain API Modules

**Status:** ACTIVE
**Phase:** F17 updated
**Verified:** 2026-07-15

## 1. Tujuan

F8 memisahkan ownership API consumer agar page tidak menjadi tempat permanen untuk daftar endpoint, request method, dan serialisasi payload. Seluruh module memakai Core API client dari F7.

## 2. Struktur module

| Domain | Public module | Export utama |
|---|---|---|
| Core | `src/core/api` | `coreApi`, `apiFetch`, error dan URL helper |
| KV Retail | `src/features/kv-retail/api` | `kvRetailApi` |
| Creative Report | `src/features/creative-report/api` | `creativeReportApi` |
| ODDS | `src/features/odds/api` | workflow API dan DTO ODDS |
| Generator Pricetag | `src/features/generator/pricetag/api` | `pricetagApi` |
| Creative AI / CAI | `src/features/creative-ai/api` | `creativeAiApi` |
| Design Assets | `src/features/design-assets/api` | status eksperimen tanpa request |

Nama module frontend mengikuti nama UI/domain, sedangkan prefix endpoint mempertahankan key backend yang stabil.

## 3. Pemindahan helper lama

File generik berikut sudah tidak berada di `src/lib`:

| Lokasi lama | Lokasi baru | Alasan |
|---|---|---|
| `src/lib/admin.ts` | `src/core/admin/index.ts` | DTO dan utility administrasi adalah Core |
| `src/lib/odds.ts` | `src/features/odds/api/index.ts` | Seluruh endpoint dan DTO dimiliki ODDS |
| `src/lib/pricetag.ts` | `src/features/generator/pricetag/types/index.ts` | DTO dan utility dimiliki Pricetag Generator |

Seluruh consumer aktif dari ketiga file telah memakai import boundary baru. Tidak dibuat re-export compatibility untuk nama lama.

## 4. Aturan dependency

1. Module domain boleh mengimpor `core/api` dan `shared`.
2. Module domain tidak boleh mengimpor internal module Sub-App lain.
3. Endpoint chat dan akun tetap dimiliki Core meskipun dipakai ODDS.
4. Prefix ditentukan di module domain, bukan disalin di komponen baru.
5. Method mutation dan serialisasi payload ditentukan oleh adapter domain.
6. Page menerima DTO/view model dan tidak mengurai response envelope sendiri.
7. Design Assets tidak boleh melakukan request sampai backend contract disetujui.

## 5. Strategi migrasi call site

F8 membentuk public module dan memindahkan helper yang sudah terkonsolidasi. Inline request pada page lama dicatat, tetapi dipindahkan bersama migrasi fungsi agar perubahan endpoint, DTO, state, permission, dan realtime tetap atomik:

- F9–F13: Auth dan Core.
- F14–F15: KV Retail.
- F16: Creative Report.
- F17: workflow ODDS selesai.
- F18: Core Chat selesai.
- F19: Generator Pricetag selesai melalui facade bertipe, termasuk import dan download terautentikasi.
- F20: aplikasi eksperimen selesai; CAI memiliki guard sendiri dan Design Assets tetap tanpa backend semu.

Strategi ini mencegah adapter kosmetik yang hanya mengganti lokasi string tanpa memperbaiki kontrak fungsi.

## 6. Status implementasi

- ODDS menggunakan module feature sebagai consumer aktif dan seluruh workflow backend telah memiliki adapter serta UI.
- Core Chat memiliki DTO, API, route helper, dan subscription `.message.sent` terpusat.
- Creative AI sudah memakai `creativeAiApi.chat()`.
- Core Admin dan Pricetag types sudah memakai ownership final.
- KV Retail, Creative Report, dan Pricetag memiliki facade API siap migrasi.
- Design Assets memiliki explicit no-backend contract.
- `src/lib/api.ts` masih menjadi re-export sementara Core client untuk inline consumer lama; penghapusannya mengikuti penyelesaian migrasi call site.

## 7. Acceptance F8

- Tujuh boundary API tersedia dan memiliki ownership eksplisit.
- Helper `admin`, `odds`, dan `pricetag` tidak lagi berada di folder generic `lib`.
- Import consumer lama telah diarahkan ke boundary baru.
- Tidak ada import aktif ke `@/lib/admin`, `@/lib/odds`, atau `@/lib/pricetag`.
- Creative AI menggunakan adapter CAI.
- Design Assets tidak memiliki request fiktif.
- TypeScript, lint module terkait, dan production build lulus.
- Dokumentasi tersedia melalui `/docs`.
