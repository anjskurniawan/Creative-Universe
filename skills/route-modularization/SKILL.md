---
name: route-modularization
description: Standarisasi struktur rute aplikasi dengan memisahkan tampilan halaman ke dalam berkas layout.tsx lokal yang menggunakan rangkaian Container, Workspace, dan Content.
---

# Route Modularization Skill

Skill ini memandu agen AI dalam merestrukturisasi rute halaman Next.js di repositori Creative Universe agar menggunakan standarisasi layout global melalui berkas `layout.tsx` lokal.

---

## 1. Rute Pengecualian Eksplisit (Explicit Exceptions)

Standarisasi tata letak `layout.tsx` lokal yang menggunakan rangkaian `Container → Workspace → Content` **TIDAK berlaku** untuk rute-rute khusus berikut yang memerlukan tata letak visual kustom secara eksplisit:

1. **Halaman Landing Utama (`/`):** Memerlukan tampilan canvas 3D & interaksi GSAP layar penuh tanpa sidebar/navbar.
2. **Halaman Otentikasi (`/login`, `/forgot-password`):** Memerlukan tata letak kartu otentikasi minimalis layar penuh.
3. **Halaman Error (`/forbidden` / 403):** Memerlukan tampilan kartu galat penolakan akses layar penuh.
4. **Developer Sandbox (`/developer/*`):** Menggunakan layout testing tersendiri yang terpisah dari skema menu samping produksi.
5. **Halaman Dokumentasi (`/docs`):** Menggunakan sistem navigasi dokumen sidebar ganda khusus (tetap menggunakan `Navbar` atas tapi tidak membungkus halaman dalam `Container` default).

---

## 2. Pendekatan Standar (Local `layout.tsx` Wrapper)

Setiap rute/fitur utama (misal: `/creative-report`, `/creative-ai`, `/odds`) harus mengikuti pola tata letak berikut:

1. **Buat file `layout.tsx` di dalam folder rute:**
   * Contoh: `apps/frontend/src/app/my-route/layout.tsx`
2. **Gunakan struktur layout wajib:**
   * `Container` dari `@/components/layout/container` menjadi wrapper paling luar.
   * `Container` harus merender `Workspace` melalui API `contentProps` yang tersedia.
   * `Workspace` harus merender `Content` sebagai area konten utama.
   * `children` harus diteruskan sampai ke `Content` melalui `Container`.
3. **Jangan membuat shell layout paralel:**
   * Jangan membungkus route dengan `CoreShell`, `SubAppShell`, `Navbar`, `Sidebar`, atau shell custom lain jika layout baru sudah menggunakan `Container`.
   * Jika route sebelumnya memakai shell tersebut, rombak route itu agar shell lama dilepas dari jalur render dan kebutuhan layout dikonfigurasi pada `layout.tsx` baru.
4. **Kontrol sidebar secara eksplisit:**
   * Jika route membutuhkan sidebar, definisikan `menuItems` yang relevan dengan route tersebut.
   * Jika route tidak membutuhkan sidebar, gunakan kemampuan `Workspace` untuk menyembunyikannya; jangan mengirim menu Core yang tidak relevan.

---

## 3. Kerangka Template `layout.tsx` Standar

Gunakan template di bawah ini sebagai acuan saat membuat berkas `layout.tsx` baru untuk suatu rute:

```tsx
"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Container from "@/components/layout/container";

export default function FeatureLayout({ children }: { children: ReactNode }) {
  const [viewport] = useState<"Mobile" | "Desktop">("Desktop");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Definisikan menu samping (sidebar menu items) khusus fitur
  const menuItems = [
    { label: "Dashboard", href: "/my-route", icon: "dashboard" },
    { label: "Settings", href: "/my-route/settings", icon: "settings" },
  ];

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-[linear-gradient(135deg,#00cbd2_0%,#0077bf_45%,#000675_100%)]">
      <Container
        viewport={viewport}
        menuTitle="Nama Fitur"
        menuItems={menuItems}
        contentProps={{ sidebarExpanded, onToggleSidebarExpanded: () => setSidebarExpanded((c) => !c) }}
      >
        {children}
      </Container>
    </div>
  );
}
```

---

## 4. Alur Refaktorisasi Halaman (`page.tsx`)

Setelah membuat `layout.tsx` lokal:
1. **Bersihkan `page.tsx`:**
   * Hapus komponen layout pembungkus (seperti `Container` atau wrapper layout luar lainnya) dari file `page.tsx`.
   * Kembalikan kode halaman yang murni berfokus pada konten dan fungsi fiturnya saja.
2. **Verifikasi Rute Bertingkat (Nested Routes):**
   * Pastikan sub-halaman di dalam rute tersebut (misal `/my-route/settings`) dirender dengan benar di dalam kerangka layout baru.
3. **Pemeriksaan TypeScript:**
   * Jalankan `npx tsc --noEmit` di `apps/frontend` untuk memvalidasi tidak ada import terputus.

---

## 5. Alur Kerja Detail Refaktor Route

Ikuti langkah berikut secara berurutan untuk setiap route yang dimodularisasikan.

### Langkah 1 — Inspeksi route dan jalur render

1. Baca `page.tsx` target secara utuh.
2. Cari parent `layout.tsx`, route group layout, `CoreShell`, `SubAppShell`, `Navbar`, `Sidebar`, `Container`, dan wrapper layout lain yang membungkus route.
3. Catat komponen UI inline, state, handler, API call, serta batas visual halaman.
4. Tentukan apakah sidebar diperlukan dan menu apa yang benar-benar relevan untuk route tersebut.

### Langkah 2 — Tetapkan baseline layout baru

Sebelum mengubah kode, tetapkan struktur target berikut:

```text
layout.tsx
└── Container
    └── Workspace
        ├── Navbar
        ├── Sidebar atau tanpa Sidebar sesuai kebutuhan route
        ├── Menu
        └── Content
            └── children
```

Jika API `Container` mengenkapsulasi `Workspace` dan `Content`, pastikan konfigurasi `contentProps` benar-benar meneruskan `children` sampai ke `Content`.

### Langkah 3 — Buat layout route baru

1. Buat `layout.tsx` di folder route.
2. Gunakan `Container` sebagai wrapper layout baru.
3. Konfigurasikan `Workspace` melalui props yang tersedia pada `Container`.
4. Konfigurasikan `Content` melalui `contentProps`.
5. Tentukan wrapper visual baru secara eksplisit; jangan menyalin wrapper shell lama secara otomatis.
6. Atur `menuItems` hanya jika sidebar relevan.
7. Gunakan opsi hide sidebar jika route tidak memerlukan sidebar.

### Langkah 4 — Lepaskan shell lama

1. Keluarkan route target dari `CoreShell`, `SubAppShell`, atau shell custom lama.
2. Pastikan route tidak menerima Navbar, Sidebar, Content, padding, atau background ganda dari parent lama.
3. Jangan membiarkan shell lama berjalan paralel dengan `layout.tsx` baru.

### Langkah 5 — Ekstrak component inline

1. Identifikasi blok JSX mandiri di `page.tsx`.
2. Pindahkan blok tersebut ke `src/components/<feature-name>/`.
3. Pindahkan type, props, dan helper yang hanya dibutuhkan component tersebut.
4. Pertahankan styling, struktur JSX, nama props, dan logic tanpa perubahan.
5. Ganti blok inline di `page.tsx` dengan component hasil ekstraksi.
6. Jadikan `page.tsx` hanya sebagai entry point konten route.

### Langkah 6 — Samakan konfigurasi route sejenis

Bandingkan layout baru dengan route pembanding yang memakai sistem layout sama. Pastikan wrapper, ukuran, padding, background, shadow, sidebar, dan Content konsisten. Perbedaan harus berasal dari kebutuhan route, bukan dari sisa implementasi lama.

### Langkah 7 — Verifikasi struktural dan runtime

Sebelum selesai, periksa:

1. Struktur `Container → Workspace → Content`.
2. Tidak ada shell lama yang membungkus route secara paralel.
3. Sidebar dan `menuItems` sesuai kebutuhan route.
4. Wrapper baru konsisten dengan route pembanding.
5. `page.tsx` hanya menangani konten/entry point, bukan layout global.
6. Browser/live route bila tersedia.

---

## 6. Pembaruan Catatan Dokumentasi (Update Route Layouts Note)

Setiap kali suatu rute selesai dimodularisasikan atau disesuaikan tata letaknya:
1. **Buka file dokumentasi:**
   * [notes/route_layouts.md](file:///c:/laragon/www/creativeuniverse/notes/route_layouts.md)
2. **Perbarui status tata letak:**
   * Pindahkan rute tersebut dari daftar **"2. Rute yang BELUM Menggunakan"** ke dalam daftar **"1. Rute yang SUDAH Menggunakan"** beserta tautan berkas `layout.tsx` yang baru dibuat agar catatan pemetaan layout selalu akurat dan terbarui.
