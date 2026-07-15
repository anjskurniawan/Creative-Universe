# Frontend Module Boundaries

**Status:** ACTIVE
**Phase:** F3 completed
**Verified:** 2026-07-15

## 1. Tujuan

Dokumen ini menetapkan struktur folder final dan arah dependency frontend Creative Universe. Struktur mengikuti Next.js App Router: `app` hanya untuk routing dan composition, sedangkan implementasi Core, Sub-App, dan primitive lintas domain berada di luar `app`.

## 2. Struktur target

```text
apps/frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── onboarding/
│   ├── (core)/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── messages/
│   │   └── maintenance/
│   ├── kv-retail/
│   ├── creative-report/
│   ├── odds/
│   ├── generator/
│   │   └── pricetag/
│   ├── creative-ai/
│   ├── design-assets/
│   └── docs/
├── core/
│   ├── api/
│   ├── auth/
│   ├── applications/
│   ├── permissions/
│   ├── realtime/
│   ├── storage/
│   └── types/
├── features/
│   ├── kv-retail/
│   ├── creative-report/
│   ├── odds/
│   ├── generator/
│   │   └── pricetag/
│   ├── creative-ai/
│   └── design-assets/
└── shared/
    ├── components/
    ├── hooks/
    ├── layouts/
    ├── lib/
    ├── styles/
    ├── types/
    └── validation/
```

Folder internal dibuat ketika file pertama dimigrasikan agar tidak menghasilkan scaffold kosong tanpa ownership. README boundary yang dibuat pada F3 membuat setiap module root tetap eksplisit dan versionable.

## 3. Route ownership

| Boundary | Route | Ownership |
|---|---|---|
| Public | `/` dan `/forbidden` | landing dan system state |
| Auth | `/login`, `/forgot-password`, `/onboarding` | authentication lifecycle |
| Core | `/dashboard`, `/profile`, `/settings/*`, `/users`, `/roles`, `/messages`, `/maintenance` | layanan lintas aplikasi |
| Documentation | `/docs` | dokumentasi aktif |
| KV Retail | `/kv-retail/*` | KV Retail Task |
| Creative Report | `/creative-report/*` | Creative Report |
| ODDS | `/odds/*` | One Dashboard Design System |
| Generator | `/generator/pricetag/*` | Pricetag Generator |
| Creative AI | `/creative-ai` | CAI experimental |
| Design Assets | `/design-assets` | Design Assets experimental |

`/components` dan `/playground` belum diberi ownership production. Keduanya tetap di tempat lama sampai review internal-tool pada cleanup.

## 4. Dependency direction

```text
app -> features -> core -> shared
app -> core
app -> shared
features -> shared
```

Aturan wajib:

1. `app` boleh mengomposisikan Core, feature, dan shared primitive.
2. `features/<app>` hanya boleh mengimpor public contract `core` dan primitive `shared`.
3. Feature tidak boleh mengimpor internal feature lain.
4. `core` boleh mengimpor `shared`, tetapi tidak boleh mengimpor `features` atau `app`.
5. `shared` tidak boleh mengetahui route bisnis, endpoint, permission, atau model domain.
6. Integrasi antaraplikasi menggunakan contract Core, bukan relative import lintas feature.

## 5. Struktur internal feature

Setiap feature menggunakan folder berikut saat dibutuhkan:

| Folder | Isi |
|---|---|
| `api` | endpoint function dan response adapter domain |
| `components` | komponen yang hanya digunakan feature tersebut |
| `hooks` | orchestration state dan lifecycle domain |
| `types` | DTO dan view model domain |
| `validation` | schema dan mapping validation error |
| `utils` | fungsi murni khusus domain |
| `constants` | route, permission, status, dan event key domain |

Page tidak boleh menjadi tempat type catalog, API client, dan business state besar.

## 6. Aturan penamaan

- Folder dan file memakai `kebab-case`.
- React component dan type memakai `PascalCase`.
- Function, hook, serta variable memakai `camelCase`.
- Hook diawali `use`.
- Backend key tetap stabil: `kv-retail`, `creative-report`, `odds`, `generator`, `cai`, `design-assets`.
- Nama UI boleh memakai alias profesional, tetapi key teknis tidak diterjemahkan di dalam kode.
- Istilah lama `Homework`, `/task`, `/pricetag` top-level, `AI Agent`, dan `Assets Design` tidak boleh digunakan untuk file baru.

## 7. Aturan App Router

- Hanya `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, dan file convention relevan yang berada di route boundary.
- Route group `(auth)` dan `(core)` tidak menjadi bagian URL.
- Sub-App tidak ditempatkan di route group `(core)`.
- Folder tanpa `page.tsx` bukan route publik; karena itu destination boundary F3 aman dibuat sebelum pemindahan F4.
- Satu URL tidak boleh didefinisikan oleh dua route group berbeda.
- Top-level root layout tetap dipertahankan agar navigasi antaraplikasi tidak memicu full-page reload akibat multiple root layout.

## 8. Scaffold yang dibuat pada F3

Boundary versionable telah dibuat untuk:

- `src/core`.
- `src/features` beserta enam application boundary dan child `generator/pricetag`.
- `src/shared`.
- destination route group `src/app/(core)`.
- destination route ODDS, Generator, Creative AI, dan Design Assets.
- README route boundary KV Retail dan Creative Report.

Tidak ada `page.tsx`, layout, import, endpoint, atau URL yang diubah pada F3.

## 9. Strategi migrasi F4

1. Pindahkan route Core dari `(dashboard)` ke `(core)`.
2. Pindahkan ODDS, Generator, Creative AI, dan Design Assets ke route root masing-masing.
3. Biarkan URL tetap sama.
4. Pecah layout Core dan layout Sub-App.
5. Verifikasi 39 static pages sebelum dan sesudah pemindahan.
6. Pindahkan folder `(dashboard)` ke backup hanya setelah tidak memiliki route aktif.

## 10. Acceptance F3

- Boundary Core, Feature, Shared, dan destination App Router tersedia.
- Ownership dan dependency direction terdokumentasi.
- Tidak ada Sub-App baru yang diarahkan ke `(dashboard)` atau `(core)`.
- Tidak ada route publik duplikat.
- Struktur dapat dilihat melalui `/docs`.
- Build dan TypeScript tetap lulus tanpa perubahan fungsi.
