# Frontend Audit Report

**Status:** ACTIVE
**Phase:** F1 completed
**Verified:** 2026-07-15
**Scope:** `apps/frontend` dan kontrak aktif `apps/backend`

## 1. Tujuan

Audit ini mengidentifikasi ketidaksesuaian struktur, fungsi, route, authorization, realtime, file, dan deployment sebelum frontend dipindahkan ke arsitektur modular. Tahap F1 tidak menghapus atau memindahkan route aktif.

## 2. Ringkasan eksekutif

Frontend masih dapat dirapikan bertahap tanpa dibangun ulang, tetapi pemindahan folder saja tidak cukup. Ada consumer frontend yang belum sepenuhnya mengikuti kontrak backend baru dan beberapa fungsi sensitif masih berada pada boundary yang salah.

Prioritas pembenahan:

1. Perbaiki kontrak fungsi yang dapat menyebabkan upload atau download gagal.
2. Terapkan application access dan permission guard sebelum memindahkan tampilan.
3. Pisahkan Core dan Sub-App secara fisik.
4. Pecah page monolitik menjadi feature module setelah kontrak API stabil.
5. Bersihkan halaman demo dan aset obsolete setelah klasifikasi disetujui.

## 3. Baseline terukur

| Area | Kondisi awal |
|---|---:|
| Source TypeScript, TSX, dan CSS | 105 file |
| App Router page | 36 |
| App Router layout | 5 |
| Page dalam `(dashboard)` | 23 |
| File komponen | 55 |
| Consumer `apiFetch` | 25 file |
| Call site `apiFetch` terdeteksi | 123 |
| Template endpoint unik terdeteksi | 83 |
| Consumer Echo/Pusher | 6 file |
| File source di atas 500 baris | 21 |
| File source di atas 1.000 baris | 4 |
| File source di atas 2.000 baris | 1 |
| Static asset non-dokumentasi | 28 file, sekitar 9,5 MB |
| Frontend automated test | 0 |

Quality baseline:

- TypeScript lulus.
- Production build lulus dan menghasilkan 39 static pages.
- ESLint gagal dengan 10 error dan 17 warning.
- Next.js memperingatkan rewrites tidak berlaku pada `output: export`.

## 4. Temuan prioritas kritis

### F1-C01 — Temporary upload KV Retail membaca kontrak lama

`file-upload-dropzone.tsx` memakai `XMLHttpRequest` dan mengambil `response.path`. Backend baru mengembalikan envelope:

```json
{
  "success": true,
  "data": {
    "path": "...",
    "original_name": "..."
  }
}
```

Akibatnya `tempPath` berpotensi menjadi `undefined` dan task dibuat tanpa file sementara yang sudah diunggah.

Solusi: buat upload client Core yang memahami envelope, progress, CSRF, validation error, retry, dan cancellation. Hilangkan parsing respons manual dari komponen.

### F1-C02 — Download Pricetag bergantung pada rewrite static export

History Pricetag memakai link relatif `/api/v1/generator/pricetag/batches/{id}/download`. Next.js `output: export` tidak menerapkan rewrites di hosting cPanel.

Solusi: bentuk URL melalui API host terpusat atau lakukan authenticated blob download melalui API client. Jangan bergantung pada route frontend untuk meneruskan file backend.

### F1-C03 — Credential Pusher masih dikelola dari Profile

Profile masih membaca, menampilkan, dan mengirim `pusher_app_id`, `pusher_app_key`, `pusher_app_secret`, serta `pusher_app_cluster` melalui settings user.

Solusi: hapus seluruh field Pusher dari Profile. Secret hanya berada di environment backend. Frontend hanya menerima `NEXT_PUBLIC_PUSHER_KEY` dan `NEXT_PUBLIC_PUSHER_CLUSTER` saat build.

### F1-C04 — Application access belum menjadi guard frontend

`RouteGuard` hanya memeriksa autentikasi dan onboarding. Navbar serta application menu masih hardcoded dan belum difilter berdasarkan registry aplikasi atau akses user. Direct URL masih dapat mencoba membuka Sub-App yang tidak diberikan kepada user.

Backend sudah memiliki `applications` dan permission metadata, tetapi belum ada route Core aktif untuk mengirim katalog aplikasi yang dapat diakses user.

Solusi: sediakan kontrak Core untuk accessible applications, lalu gunakan satu application guard untuk menu, route, dashboard card, dan direct navigation. Backend tetap menjadi otoritas akhir.

## 5. Temuan prioritas tinggi

### F1-H01 — Boundary folder tidak sesuai arsitektur

Sub-App berikut masih berada di `src/app/(dashboard)`:

- `creative-ai`
- `design-assets`
- `generator/pricetag`
- `odds`

`(dashboard)` juga mencampur halaman Core, halaman demo, component inventory, dan Sub-App.

Solusi target:

```text
src/
├── app/
│   ├── (auth)/
│   ├── (core)/
│   ├── kv-retail/
│   ├── creative-report/
│   ├── odds/
│   ├── generator/pricetag/
│   ├── creative-ai/
│   ├── design-assets/
│   └── docs/
├── core/
├── features/
└── shared/
```

### F1-H02 — Route Creative Report tidak sama dengan application registry

Frontend aktif memakai `/creative-report`, sedangkan registry backend dan Application Catalog masih menulis `/creative-reports`. Berdasarkan keputusan frontend terbaru, URL kanonis yang dipakai adalah `/creative-report`; registry dan katalog perlu disinkronkan sebelum guard berbasis registry diaktifkan.

### F1-H03 — Dashboard layout masih memeriksa route Pricetag lama

Layout `(dashboard)` memeriksa `pathname.startsWith("/pricetag")`, sedangkan route aktif adalah `/generator/pricetag`. Akibatnya mode full-width dan dark page dapat tidak diterapkan sesuai maksud awal.

Solusi: pindahkan layout ke boundary Generator dan hilangkan percabangan route Sub-App dari layout Core.

### F1-H04 — Permission frontend belum sepenuhnya sinkron

Frontend menggunakan `manage-settings`, tetapi permission tersebut tidak ditemukan pada registry metadata atau route authorization backend aktif. Permission ODDS juga tersebar sebagai string langsung di page/layout.

Solusi: gunakan metadata permission Core, konstanta per domain, dan alias UI. Jangan menampilkan key teknis sebagai label utama.

### F1-H05 — Legacy bearer token masih tersisa pada upload

Upload dropzone masih membaca `localStorage.getItem("token")`, sedangkan autentikasi utama menggunakan cookie Sanctum dan CSRF.

Solusi: hapus jalur bearer token lama setelah upload client baru terverifikasi.

### F1-H06 — Echo/Pusher memiliki implementasi authorization ganda

Echo menetapkan `authEndpoint` sekaligus custom `authorizer`, menggunakan `/broadcasting/auth/` dengan trailing slash, dan memakai tipe `any`. Hal ini memperbesar risiko perbedaan CSRF, error handling, atau callback saat reconnect.

Solusi: pilih satu authorizer terpusat, gunakan URL kanonis `/broadcasting/auth`, tipe yang eksplisit, lifecycle reconnect, deduplication, dan cleanup listener.

### F1-H07 — Creative Report detail bergantung pada session storage

Navigasi menyimpan user ID ke `sessionStorage` walaupun query `?user=` juga tersedia. Direct navigation dan refresh menjadi bergantung pada dua sumber state.

Solusi: query URL menjadi sumber identitas halaman; session storage hanya boleh menjadi cache non-otoritatif atau dihapus.

### F1-H08 — Page terlalu monolitik

Contoh terbesar:

- Generator Pricetag sekitar 2.498 baris.
- ODDS index sekitar 1.552 baris.
- Profile sekitar 1.352 baris.
- Creative AI sekitar 1.110 baris.
- KV Retail index sekitar 974 baris.

Solusi: page App Router hanya menjadi composition root. API, type, hook, validation, state, dan komponen domain dipindahkan ke `features/<app>`.

### F1-H09 — Tidak ada automated test frontend

Belum ditemukan file test atau spec frontend. Perubahan kontrak saat modularisasi berisiko lolos dari TypeScript tetapi gagal saat runtime.

Solusi: mulai dari contract test API client, auth guard, permission guard, upload, download, dan event mapper; lanjutkan ke E2E alur utama.

## 6. Temuan prioritas menengah

### F1-M01 — Pagination backend memiliki beberapa bentuk

Sebagian endpoint menaruh metadata pagination pada `meta` envelope, sebagian mengembalikan object paginator di dalam `data`. Frontend memiliki beberapa tipe pagination dan normalizer lokal.

Solusi: normalisasi pada API client/domain adapter, bukan pada page.

### F1-M02 — Navigation aplikasi hardcoded dan tidak lengkap

Navbar hanya menampilkan KV Retail dan ODDS. Generator, Creative Report, Creative AI, dan Design Assets tidak berasal dari registry. Dashboard juga menampilkan Generator tanpa application access filter.

### F1-M03 — Role dipakai langsung untuk beberapa fitur

KV Retail Option dan Performance memeriksa nama role `Root`, `Manajer`, atau `SPV` secara langsung. Beberapa tempat juga mengakomodasi `root` huruf kecil.

Solusi: gunakan permission/capability sebagai guard fitur; role hierarchy tetap menjadi kebijakan backend.

### F1-M04 — Settings memakai wrapper route ke page monolitik

Beberapa route `/settings/*` hanya mengekspor ulang page Profile atau Roles. Ini mempertahankan satu komponen besar dengan state dan tab bercampur.

Solusi: pecah halaman berdasarkan capability dan gunakan shared settings shell.

### F1-M05 — Local notification berjalan paralel dengan Core notification

Generator memakai local notification berbasis `localStorage`, sedangkan Core telah memiliki database notification dan Pusher.

Solusi: tentukan local notification hanya sebagai optimistic UI sementara; status persisten harus berasal dari Core notification.

### F1-M06 — Metadata aplikasi masih berorientasi Pricetag

Root layout mendeskripsikan Creative Universe sebagai aplikasi manajemen Pricetag dan administrasi, padahal sistem sudah menjadi portal multi-aplikasi.

### F1-M07 — Static asset memerlukan audit

`bg-test.jpg` sekitar 5 MB, `Login.mp4` sekitar 1,9 MB, dan local Material Symbols SVG tidak memiliki referensi source yang terdeteksi. Favicon SVG sendiri mendekati 1 MB.

Solusi: verifikasi kebutuhan visual, optimalkan aset aktif, lalu pindahkan aset tidak terpakai ke backup.

### F1-M08 — Error handling masih tersebar

Masih terdapat `alert`, `console.error`, `window.location.replace`, parsing XHR manual, dan forbidden UI lokal. Solusi harus disatukan melalui error mapper dan feedback component.

## 7. Klasifikasi route dan file

### 7.1 Aktif dan dipertahankan sebagai Core

- Landing `/`.
- Authentication, password recovery, dan onboarding.
- Dashboard.
- Profile, Settings, Users, Roles, Sessions, dan Activity Log.
- Messages dan Notifications.
- Maintenance khusus Root.
- Documentation dan Forbidden state.

Status: **RETAIN + REFACTOR + MOVE TO CORE/AUTH BOUNDARY**.

### 7.2 Aktif dan dipertahankan sebagai Sub-App

- KV Retail Task.
- Creative Report.
- ODDS.
- Generator / Pricetag.

Status: **RETAIN + REFACTOR + ISOLATE AS FEATURE MODULE**.

### 7.3 Eksperimental

- Creative AI: endpoint `/api/v1/cai/chat` aktif tetapi UI masih memiliki bagian coming soon.
- Design Assets: halaman visual coming soon dan belum memiliki endpoint aktif.

Status: **RETAIN AS EXPERIMENTAL + ISOLATE + RESTRICT ACCESS**.

### 7.4 Kandidat internal atau obsolete yang harus direview sebelum dipindahkan

- `/playground`: halaman demo onboarding dengan demo control.
- `/components`: component inventory/preview internal.
- Demo Billing & Licensing di Profile.
- `bg-test.jpg`, `Login.mp4`, dan local Material Symbols SVG yang tidak memiliki consumer source terdeteksi.
- Commented application menu lama di Navbar.

Status: **REVIEW; jangan dihapus pada F1**. Jika tidak dibutuhkan sebagai tool Root/internal, pindahkan ke `backup/frontend` pada tahap cleanup.

### 7.5 Generated artifact

- `public/docs/core/*.md` adalah hasil sinkronisasi dari folder `docs`.

Status: **GENERATED; sumber kebenaran tetap file pada root `docs`**.

## 8. Dependency audit

Seluruh dependency utama memiliki fungsi yang dapat diidentifikasi:

- Next.js, React, Tailwind, dan PostCSS untuk fondasi UI.
- Laravel Echo dan Pusher untuk realtime.
- GSAP untuk motion.
- Three.js untuk Design Assets eksperimental.
- ExcelJS untuk ekspor data.
- React Markdown, Remark GFM, Rehype Highlight, dan Highlight.js untuk Documentation.
- Lucide React dan Material Symbols masih berjalan sebagai dua sistem icon.

Belum ada dependency yang dihapus pada F1. Audit bundle dan keputusan konsolidasi icon dilakukan setelah pemilik komponen dipisahkan.

## 9. Urutan perbaikan berdasarkan hasil audit

1. F2 menyusun matriks page-action-endpoint-event-permission.
2. F3 menetapkan dan membuat boundary folder final.
3. F4 memisahkan route/layout tanpa mengubah URL kanonis.
4. F7-F13 memperbaiki API client, auth, application access, permission, dan Core.
5. F14-F22 memigrasikan fungsi per Sub-App, Pusher, upload, serta download.
6. F23-F31 memecah state, komponen, design system, dan menambahkan test.
7. F32 memindahkan kandidat obsolete yang sudah diputuskan ke backup.

## 10. Acceptance F1

- Struktur, route, API consumer, permission, Pusher, upload, download, dependency, dan aset telah diaudit.
- File telah diklasifikasikan tanpa penghapusan prematur.
- Temuan kritis memiliki arah solusi.
- Laporan tersedia pada route `/docs`.
- Tahap berikutnya tidak boleh langsung memindahkan seluruh folder sebelum matriks kontrak F2 selesai.
