---
title: "KV Retail Performance Components"
status: LOCKED
revised: 2026-07-19
owner: KV Retail
---

# KV Retail Performance Components

Dokumen ini adalah kontrak komponen untuk desktop KV Retail. Komponen saat ini berada di feature KV Retail; komponen belum dipromosikan menjadi design-system global. Kontrak visualnya terkunci sebagai acuan reuse bila style diadopsi ke aplikasi lain.

## Composition map

| Komponen | Level | Tanggung jawab | Source |
| --- | --- | --- | --- |
| `TaskPage` | Page composition | shell bersama untuk Hari ini, Belum selesai, dan Bulan ini; membedakan hanya scope data serta route aktif | `features/kv-retail/components/task-page.tsx` |
| `OptionPage` | Page composition | shell bersama untuk Pengaturan KV Retail dengan form CMS existing | `app/kv-retail/option/page.tsx` |
| `PerformanceNavbar` | Organism | breadcrumb, utility action, dropdown aplikasi/pesan/notifikasi/akun | `features/kv-retail/components/performance-navbar.tsx` |
| `PerformanceSidebar` | Organism | navigasi performance, theme development toggle, collapse state | `features/kv-retail/components/performance-sidebar.tsx` |
| `PerformanceContentTitle` | Molecule | title route, period dropdown, export action | `features/kv-retail/components/performance-content-title.tsx` |
| `PerformanceMetricCard` | Molecule | satu KPI dan detail perbandingan bulan lalu | `features/kv-retail/components/performance-metric-card.tsx` |
| `PerformanceChartIndicators` | Organism | diagram, completion, distribution, bottleneck, prioritas | `features/kv-retail/components/performance-chart-indicators.tsx` |
| `PerformanceSideSummary` | Organism | total, rating, Creative Agent, salin ringkasan | `features/kv-retail/components/performance-side-summary.tsx` |
| `KV_RETAIL_PERFORMANCE_PAGE` | Configuration | title/breadcrumb terpusat | `features/kv-retail/performance-page-config.ts` |

## Theme contract

Seluruh komponen visual menerima union yang sama:

```ts
type PerformanceTheme = "light" | "dark" | "retro";
```

Status saat ini: type tersebut masih ditulis inline pada masing-masing komponen. Ketika mulai dipakai lintas feature, ekstrak type dan token ke module design-system tunggal. Jangan lakukan ekstraksi tersebut sebelum ada instruksi implementasi lintas aplikasi.

## `PerformanceMetricCard`

### API

```tsx
<PerformanceMetricCard
  theme="light"
  label="Total task"
  value={12}
  previous={9}
  increase={33}
  unit="task"
  icon="assignment"
  decimals={0}
/>
```

| Prop | Keterangan |
| --- | --- |
| `label` | Nama KPI singkat. |
| `value` | Nilai periode aktif. |
| `previous` | Nilai periode pembanding; dipakai oleh detail popover. |
| `increase` | Persentase perubahan, positif/negatif/0. |
| `unit` | Satuan tampilan; default `task`. |
| `icon` | Nama Material Symbol. |
| `decimals` | Presisi format angka. |
| `theme` | `light`, `dark`, atau `retro`. |

### Perilaku

- Tombol tiga titik membuka/menutup popover nilai bulan lalu serta perubahan.
- Indikator naik menggunakan aksen tema; turun merah; stagnan abu-abu.
- Popover harus dapat ditutup ulang melalui tombol yang sama dan dapat diakses keyboard.

## `PerformanceChartIndicators`

### Data contract

```ts
type Comparison = { label: string; current: number; previous: number };
type Stage = { label: string; total: number };
type PriorityAction = {
  id: number;
  title: string;
  reason: string;
  deadline: string;
  givenAt: string;
  emailAt: string;
  status: string;
  icon: string;
};
```

### Perilaku interaktif

- Bar diagram dapat dipilih untuk memperlihatkan nilai `current vs previous` pada label.
- Stage bottleneck dapat dipilih/dibatalkan dan diberi outline aksen.
- Task prioritas dapat dipilih/dibatalkan; detail ringkas tetap dapat dibaca pada tinggi card terbatas.
- Density detail prioritas memakai `ResizeObserver`: basic mulai tinggi 145px, full mulai 250px. Card tidak menambah page scroll.

### Reuse rules

- Input data wajib sudah dihitung oleh feature owner; komponen tidak menghitung deadline/bottleneck dari raw task.
- Jangan mengganti status telat/bottleneck lewat presentational component.
- Jika dipakai pada halaman lain, gunakan source data dan rute milik halaman tersebut; jangan import query KV Retail ke design system.

## `PerformanceSideSummary`

| Prop | Keterangan |
| --- | --- |
| `totalTasks` | Total task periode aktif. |
| `rating` | `GOOD`, `FAIR`, `POOR`, atau `NO DATA`. |
| `creativeAgentContent` | Ringkasan teks dari Creative Agent. |
| `theme` | Theme visual aktif. |

Perilaku: tombol **Salin** menyalin ringkasan Creative Agent ke clipboard. Tombol disabled saat ringkasan belum tersedia. Jangan mengirim raw task data dari komponen ini.

## `PerformanceNavbar`

### Dropdown contract

- Dropdown aplikasi, periode, pesan, notifikasi, dan akun memakai token dropdown tema yang sama.
- Menu akun mengadopsi isi navbar global: summary user, Profile, Dashboard, Settings, Help Center, Sign Out.
- Pesan dan notifikasi memakai `panelClassName` scoped (`cu-performance-bell-*`) agar warna internalnya selaras tanpa mengubah menu global halaman lain.
- Klik di luar menutup dropdown aplikasi dan akun. Komponen pesan/notifikasi menangani outside-click sendiri.

## Title dan KPI desktop

`PerformanceContentTitle` adalah acuan visual title untuk dashboard desktop KV Retail. Bila sebuah route memakai title lain tetapi masih berada dalam shell yang sama, pertahankan typography title, gutter `m-4`, dan urutan konten berikut:

```text
Title (+ subtitle opsional)
KPI/card ringkasan lebar penuh
Filter/control route
Konten yang dapat di-scroll secara internal
```

KPI tidak ditempatkan sejajar dengan title. Ini adalah default reusable agar title tetap mudah dipindai dan group KPI memakai seluruh lebar main content.

Saat pola ini dipakai pada halaman task, tema Light mempertahankan surface yang sudah disetujui. Theme Dark dan Retro wajib mengubah seluruh toolbar (KPI, pencarian, filter, sort, dropdown, dan primary action) sebagai satu unit: gunakan token Dark/Retro yang sama, bukan kartu putih atau border Light yang tersisa.

## `TaskCard` theme contract

`TaskCard` menerima `theme="light" | "dark" | "retro"`. Light adalah tampilan default yang sudah disetujui. Dark dan Retro harus menerapkan token ke card shell, date panel, title, label file, badge countdown, vendor/deadline, stage button, progress bar, serta action button. Shell wajib meng-clip isi ke radiusnya agar pojok kanan card tidak menjadi runcing. Props tema hanya mengubah presentasi; logic status, deadline, upload, dan akses tidak boleh berubah.

### Desktop sempit

Card task menentukan mode ringkas berdasarkan lebar container nyata, bukan `window.innerWidth`, agar akurat pada preview perangkat dan setelah sidebar berubah lebar. Jika lebar card di bawah `1200px`, card masuk mode ringkas secara default. Header ringkas yang terkunci berurutan: **panel tanggal → judul task → grup countdown + status aktif (horizontal) → grup dua label file (vertikal) → chevron paling kanan**. Kedua grup metadata diberi gap eksplisit. Seluruh elemen header memakai `items-center`; container header dan padding harus identik pada state collapse maupun expand, sehingga membuka detail tidak menggeser cover. Countdown dan label file wajib memakai komponen/gaya desktop `TaskCardDetail` dan `TaskCardDetailStatus`, bukan chip alternatif. Vendor, assigned, status detail, riwayat progres, serta tindakan berada pada detail yang dibuka melalui chevron dengan `aria-expanded`. Pada ruang card yang lebih lebar, card tampil lengkap. Saat card ringkas dibuka, gunakan `TaskcardMobileLayoutCard` sebagai body detail agar struktur informasi sama dengan mobile; tetap operkan callback status, upload, tautan, dan hapus dari `TaskCard` agar tidak menciptakan jalur mutasi kedua. Setiap aksi yang membuka overlay harus terlebih dahulu menutup detail ringkas supaya overlay hanya menutup cover card.

Strip KPI, bar pencarian, Vendor, dan Urutkan selalu berada pada satu baris desktop. Tombol `+` berada di sisi kiri yang tidak ikut bergeser, sedangkan item KPI memiliki lebar minimum dan dapat di-scroll horizontal tanpa scrollbar. Bar pencarian menggunakan ruang fleksibel, sementara tombol Vendor dan Urutkan tetap satu baris serta menyembunyikan label teks ketika ruang sempit.

## CMS content contract

CMS Pengaturan KV Retail hanya mengelola content: title per halaman (`Hari ini`, `Belum selesai`, `Bulan ini`), empty state, teks form, teks overlay, dan teks status. Tidak ada field warna, icon, atau style visual; seluruh token visual mengikuti kontrak theme yang terkunci dalam dokumen ini.

`OptionPage` menampilkan skeleton loading shell sebelum permission dan setting selesai dimuat. Card CMS, tab, input, textarea, serta tombol simpan harus mengikuti token Light/Dark/Retro aktif; loading state menggunakan Light shell sebagai fallback awal agar halaman tidak menampilkan form atau flash warna yang belum siap.

Halaman Hari ini, Belum selesai, Bulan ini, dan Performa juga wajib menampilkan skeleton sederhana pada area data saat request awal berlangsung. Skeleton memakai surface tema aktif dan tidak boleh menggantikan data valid yang sudah tampil ketika refresh lanjutan.

State expand/collapse sidebar disimpan lokal pada key `kv-retail.desktop-sidebar-expanded` dan dipakai bersama oleh seluruh route desktop KV Retail. Perpindahan route tidak boleh mengubah lebar sidebar secara tiba-tiba.

## `PerformanceSidebar`

Navigasi menggunakan copy pendek: Hari ini, Belum selesai, Bulan ini, Performa, Pengaturan, Retro, Ciutkan, Bantuan.

Theme toggle merupakan temporary control. Contract target tercatat di `Pattern_KV_Retail_Performance_Themes.md`; jangan menjadikan sidebar sebagai persistence layer.

## Reuse checklist

Sebelum mengadopsi komponen ke aplikasi lain:

1. Project Owner menyetujui scope penerapan.
2. Theme source sudah ditentukan (preferensi akun, bukan state lokal).
3. Data adapter disiapkan oleh feature owner.
4. Semua dropdown mengikuti token tema target.
5. Tidak ada scroll halaman desktop pada viewport target.
6. Keyboard focus, `aria-expanded`, dan `aria-pressed` tetap tersedia.
7. Dokumentasi ini serta source implementation diperbarui dalam perubahan yang sama.

## Verification

Implementasi acuan saat ini tervalidasi dengan:

```powershell
cd apps/frontend
npx eslint src/app/kv-retail/performance/page.tsx src/features/kv-retail/components
npx tsc --noEmit
```

Browser regression untuk aplikasi lain belum dilakukan karena user secara eksplisit meminta dokumentasi dulu, tanpa rollout style global.
