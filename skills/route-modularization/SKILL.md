---
name: route-modularization
description: Standarisasi struktur rute aplikasi dengan memisahkan tampilan halaman ke dalam berkas layout.tsx lokal yang membungkus komponen Container utama.
---

# Route Modularization Skill

Skill ini memandu agen AI dalam merestrukturisasi rute halaman Next.js di repositori Creative Universe agar menggunakan standarisasi layout global melalui berkas `layout.tsx` lokal.

---

## 1. Rute Pengecualian Eksplisit (Explicit Exceptions)

Standarisasi tata letak `layout.tsx` lokal yang menggunakan komponen `Container` utama **TIDAK berlaku** untuk rute-rute khusus berikut yang memerlukan tata letak visual kustom secara eksplisit:

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
2. **Bungkus halaman menggunakan komponen `Container`:**
   * Gunakan komponen `Container` dari `@/components/layout/container` di dalam `layout.tsx` tersebut.
3. **Posisikan area konten (`children`):**
   * Teruskan parameter `children` ke dalam `Container` agar semua sub-halaman di bawah rute tersebut otomatis memiliki layout yang sama.

---

## 3. Kerangka Template `layout.tsx` Standar

Gunakan template di bawah ini sebagai acuan saat membuat berkas `layout.tsx` baru untuk suatu rute:

```tsx
"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/container";

export default function FeatureLayout({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = useState<"Mobile" | "Desktop">("Mobile");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarTheme, setSidebarTheme] = useState<"light" | "dark" | "retro">("light");

  useEffect(() => {
    const syncViewport = () => setViewport(window.innerWidth >= 1024 ? "Desktop" : "Mobile");
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

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
        contentProps={{
          sidebarTheme,
          sidebarExpanded,
          onToggleSidebarTheme: () => setSidebarTheme((c) => c === "dark" ? "light" : "dark"),
          onToggleSidebarRetro: () => setSidebarTheme((c) => c === "retro" ? "light" : "retro"),
          onToggleSidebarExpanded: () => setSidebarExpanded((c) => !c),
        }}
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

## 5. Pembaruan Catatan Dokumentasi (Update Route Layouts Note)

Setiap kali suatu rute selesai dimodularisasikan atau disesuaikan tata letaknya:
1. **Buka file dokumentasi:**
   * [notes/route_layouts.md](file:///c:/laragon/www/creativeuniverse/notes/route_layouts.md)
2. **Perbarui status tata letak:**
   * Pindahkan rute tersebut dari daftar **"2. Rute yang BELUM Menggunakan"** ke dalam daftar **"1. Rute yang SUDAH Menggunakan"** beserta tautan berkas `layout.tsx` yang baru dibuat agar catatan pemetaan layout selalu akurat dan terbarui.
