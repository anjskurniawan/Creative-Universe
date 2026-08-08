# Frontend Canonical URLs

**Status:** ACTIVE
**Phase:** F5 completed
**Verified:** 2026-07-15

## 1. Tujuan

F5 menetapkan satu URL frontend kanonis untuk Core dan setiap Sub-App. URL halaman dibedakan dengan tegas dari prefix REST API agar nama resource plural pada API tidak mengubah alamat aplikasi yang dilihat pengguna.

## 2. URL kanonis

| Boundary | URL frontend | Prefix API |
|---|---|---|
| Portal publik | `/` | - |
| Core Dashboard | `/dashboard` | `/api/v1` |
| Profile | `/profile` | `/api/v1/profile` |
| Settings | `/settings` | beberapa endpoint Core |
| Documentation | `/docs` | - |
| KV Retail Task | `/kv-retail` | `/api/v1/kv-retail` |
| Creative Report | `/creative-report` | `/api/v1/creative-reports` |
| ODDS | `/odds` | `/api/v1/odds` |
| Generator | `/generator` | `/api/v1/generator` |
| Pricetag Generator | `/generator/pricetag` | `/api/v1/generator/pricetag` |
| Creative AI | `/creative-ai` | `/api/v1/cai` |
| Design Assets | `/design-assets` | `/api/v1/design-assets` |

## 3. Registry frontend

Konstanta dan pembentuk URL internal berada di `apps/frontend/src/core/navigation/routes.ts`. Komponen navigasi baru wajib memakai registry tersebut. Query parameter detail yang masih diperlukan static export dibentuk melalui helper terpusat.

## 4. Creative Report

URL halaman Creative Report ditetapkan sebagai `/creative-report`. Registry backend dan Application Catalog telah diselaraskan. Prefix API tetap `/api/v1/creative-reports` karena merupakan koleksi REST, bukan URL halaman.

## 5. Static export dan detail entity

Deployment cPanel memakai `output: 'export'`. Entity ID yang tidak diketahui saat build belum dapat menggunakan dynamic segment App Router tanpa daftar `generateStaticParams`. Route detail aktif berikut dipertahankan sementara:

- `/creative-report/detail?user={id}`.
- `/odds/detail?id={id}`.
- `/messages?conversation={id}`.

Perubahan menjadi segment dinamis hanya dilakukan setelah strategi hosting atau static generation entity diputuskan.

## 6. Kandidat cleanup F6

F5 tidak membuat compatibility alias. Audit source aktif tidak menemukan page route lama `/task`, `/pricetag` top-level, `/ai-agent`, `/assets-design`, atau `/creative-reports`. Referensi API `/creative-reports` tetap valid dan tidak boleh dipindahkan ke backup.

## 7. Acceptance F5

- URL top-level Core dan Sub-App memiliki satu bentuk kanonis.
- Metadata Creative Report sama antara frontend, backend registry, dan katalog.
- API prefix tidak disamakan secara keliru dengan page route.
- Registry URL frontend tersedia pada boundary Core.
- Tidak ada page route legacy aktif.
- TypeScript, lint terkait, backend registry test, dan production build lulus.
- Dokumen dapat dibaca melalui `/docs`.
