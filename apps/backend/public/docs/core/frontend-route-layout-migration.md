# Frontend Route and Layout Migration

**Status:** ACTIVE
**Phase:** F4 completed
**Verified:** 2026-07-15

## 1. Tujuan

F4 memindahkan seluruh route aktif keluar dari route group generik `(dashboard)` dan memberikan layout owner yang eksplisit kepada Core, internal tools, dan setiap Sub-App. URL pengguna dipertahankan.

## 2. Hasil pemindahan

### Authentication

```text
app/(auth)/
├── login/
├── forgot-password/
└── onboarding/
```

Login dan onboarding mempertahankan full-page UI. Forgot Password tetap menggunakan card shell Auth.

### Core

```text
app/(core)/
├── dashboard/
├── maintenance/
├── messages/
├── profile/
├── roles/
├── settings/
└── users/
```

Core memakai `src/core/layouts/core-shell.tsx`. Shell hanya mengetahui variasi layout Core untuk Messages, Settings/Profile, Users, dan default Core page.

### Internal tools

```text
app/(internal)/
├── components/
└── playground/
```

Kedua route tetap tersedia untuk review internal, tetapi tidak diklasifikasikan sebagai Core atau Sub-App. Keputusan mempertahankan atau memindahkan ke backup dilakukan pada cleanup.

### Sub-App

```text
app/
├── kv-retail/
├── creative-report/
├── odds/
├── generator/pricetag/
├── creative-ai/
└── design-assets/
```

Tidak ada Sub-App yang tersisa di route group Core atau Dashboard.

## 3. Layout ownership

| Boundary | Layout owner | Perilaku |
|---|---|---|
| Auth | `app/(auth)/layout.tsx` | full-page Login/Onboarding, card Forgot Password |
| Core | `core/layouts/core-shell.tsx` | navbar dan content shell Core |
| Internal | Core Shell | shell internal sementara |
| ODDS | `app/odds/layout.tsx` | navbar dan workspace sidebar ODDS |
| Generator | `app/generator/layout.tsx` | navbar dark dan background Generator |
| Pricetag | `app/generator/pricetag/layout.tsx` | navigation dan content panel Pricetag |
| Creative AI | `app/creative-ai/layout.tsx` | navbar dinamis mengikuti AI dark state |
| Design Assets | `app/design-assets/layout.tsx` | shell eksperimen light/full-width |
| KV Retail | route pages aktif | shell desktop/mobile KV Retail saat ini |
| Creative Report | route pages aktif | shell report saat ini |

`shared/layouts/sub-app-shell.tsx` hanya memiliki primitive shell generik dan tidak mengetahui route atau permission domain.

## 4. URL parity

URL berikut tidak berubah:

- `/login`, `/forgot-password`, `/onboarding`.
- `/dashboard`, `/maintenance`, `/messages`, `/profile`, `/roles`, `/settings/*`, `/users`.
- `/components`, `/playground`.
- `/kv-retail/*`, `/creative-report/*`, `/odds/*`.
- `/generator/pricetag/*`, `/creative-ai`, `/design-assets`.

Route group `(auth)`, `(core)`, dan `(internal)` tidak menjadi bagian URL.

## 5. Struktur obsolete

`apps/frontend/src/app/(dashboard)` sudah tidak ada pada source aktif. Catatan retirement dipindahkan ke:

```text
backup/frontend/f4-obsolete-route-group
```

Nama `(dashboard)` tidak boleh digunakan kembali sebagai parent Sub-App.

## 6. Cache route

Metadata `.next` lama masih mereferensikan source `(dashboard)` setelah file dipindahkan. Cache tersebut dihapus karena merupakan generated artifact, lalu route type dibuat ulang dengan `next typegen`. Source code tidak hilang.

## 7. Acceptance F4

- Tidak ada source code aktif yang mereferensikan route group `(dashboard)`.
- Authentication, Core, internal tools, dan Sub-App memiliki boundary route terpisah.
- Sub-App memiliki layout owner sendiri.
- URL tetap sama.
- TypeScript dan production build lulus.
- Route output tetap 39 static pages.
- Dokumentasi tersedia melalui `/docs`.
