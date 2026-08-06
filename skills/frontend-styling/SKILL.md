---
name: frontend-styling
description: Menjamin konsistensi visual dan styling Tailwind CSS saat membuat komponen baru dengan memindai komponen primitives di src/components/ui/ sebagai baseline tokens (warna, rounded-xl, glassmorphism, shadow).
---

# Frontend Styling & Design Consistency Skill

Skill ini memandu agen AI untuk memindai, menganalisis, dan meniru token desain yang sudah ada pada komponen primitif di `src/components/ui/` sebelum menulis styling untuk komponen baru. Ini bertujuan untuk menjaga konsistensi visual di seluruh aplikasi.

---

## 1. Protokol Analisis Baseline (Pindai Sebelum Menulis)

Sebelum menambahkan atau menulis kelas Tailwind CSS untuk komponen baru:
1. **Analisis Komponen Primitif Sejenis:**
   * Buka dan baca komponen di [src/components/ui/](file:///c:/laragon/www/creativeuniverse/apps/frontend/src/components/ui/) (misal: `button-action.tsx`, `modal.tsx`, `stat-card.tsx`, `confirm-modal.tsx`).
2. **Ekstrak Token Desain Aktif:**
   * Catat kombinasi warna, border radius, bayangan (shadow), backdrop filter, dan transisi hover yang digunakan di komponen primitives tersebut.
3. **Terapkan ke Komponen Baru:**
   * Terapkan token yang sama persis agar komponen baru terasa menyatu dengan keseluruhan aplikasi.

---

## 2. Standar Token Desain Kreatif (Aesthetic Baseline)

Komponen primitif di Creative Universe memiliki standar styling Tailwind sebagai berikut:

* **Warna Tema Utama (Brand Colors):**
  * Ungu Aksentuasi: `#6d46eb` (Tailwind: `text-[#6d46eb]`, `bg-[#6d46eb]`, `border-[#ede9fe]`).
  * Biru Aksentuasi: `#00a4ff` (Tailwind: `text-[#00a4ff]`, `bg-[#00a4ff]`).
  * Dark Slate Text: `#3b4446` (Tailwind: `text-[#3b4446]`).
* **Sistem Tema Light vs Dark (Navbar & Components):**
  * Light Theme Glassmorphism: `bg-white/55 backdrop-blur-md border-b border-slate-100` (atau `bg-[#f3fbff]` / `bg-[#f8fafc]`).
  * Dark Theme: `bg-black/20 backdrop-blur-md border-white/10 text-slate-200`.
* **Border Radius (Sudut Membulat):**
  * Button / Card Kecil: `rounded-lg` (8px).
  * Card Utama / Dialog Modal: `rounded-xl` (12px) atau `rounded-2xl` (16px).
  * Panel Layout Utama: `rounded-[16px]`.
* **Bayangan (Soft Shadows):**
  * Bayangan Utama: `shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]` (untuk container/modal melayang).
  * Bayangan Ringan: `shadow-md` atau `shadow-sm`.
* **Interaktivitas & Efek Hover:**
  * Gunakan `transition-colors duration-200` atau `transition-transform`.
  * Efek Hover Light: `hover:bg-slate-100/50` atau `hover:border-[#bdb0f5]`.
  * Efek Hover Dark: `hover:bg-white/10`.

---

## 3. Integrasi Ikon Sistem

* Selalu gunakan komponen **`MaterialIcon`** dari `@/components/ui/material-icon` untuk ikon navigasi dan aksi:
  ```tsx
  import { MaterialIcon } from "@/components/ui/material-icon";
  
  // Contoh Penggunaan
  <MaterialIcon name="search" size="sm" className="text-slate-400" />
  ```
* Gunakan nama ikon standar dari Google Material Icons.

---

## 4. Alur Kerja Penerapan
1. Saat membuat komponen baru dengan skill `component-management`, picu skill `frontend-styling` ini secara bersamaan.
2. Bandingkan markup CSS Tailwind komponen baru Anda dengan berkas UI di `src/components/ui/`.
3. Lakukan penyesuaian jika ada ketidakselarasan warna, radius, atau shadow sebelum melakukan finalisasi.
