# Konvensi Penamaan dan Struktur Komponen UI
*Panduan Standar Penamaan Komponen React & Next.js di Creative Universe*

Dokumen ini mendefinisikan aturan baku untuk penamaan file, nama komponen, props, serta pengorganisasian folder komponen pada frontend Next.js (`apps/frontend/src/components`).

---

## 1. Aturan Penamaan File dan Folder

### A. Nama File (`kebab-case`)
Semua berkas komponen React wajib menggunakan format **`kebab-case.tsx`**.
- **Benar:** `primary-action-link.tsx`, `odds-task-chat.tsx`, `navbar-avatar.tsx`
- **Salah:** `PrimaryActionLink.tsx`, `primaryActionLink.tsx`, `odds_task_chat.tsx`

### B. Nama Folder (`kebab-case` atau Lowercase)
Folder pengelompokkan di dalam komponen wajib menggunakan format lowercase atau **`kebab-case`**.
- **Benar:** `ui/`, `navigation/`, `creative-report/`
- **Salah:** `UI/`, `Navigation/`, `CreativeReport/`

---

## 2. Aturan Penamaan Kode Program (TypeScript / React)

### A. Nama Fungsi Komponen (`PascalCase`)
Nama fungsi komponen React wajib menggunakan format **`PascalCase`** yang mencerminkan nama file-nya.
- **Benar:** 
  ```tsx
  // Di dalam file primary-action-link.tsx
  export function PrimaryActionLink() { ... }
  ```
- **Salah:**
  ```tsx
  export function primaryActionLink() { ... }
  export function Primary_Action_Link() { ... }
  ```

### B. Nama Interface / Type Props (`PascalCaseProps`)
Props dari komponen didefinisikan menggunakan interface atau type dengan format nama komponen ditambah suffix **`Props`**.
- **Benar:**
  ```tsx
  export interface PrimaryActionLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
  }
  ```
- **Salah:**
  ```tsx
  interface Props { ... }
  interface PrimaryActionLinkPropsType { ... }
  ```

---

## 3. Contoh Implementasi Standar

Berikut adalah struktur kode komponen standar yang patuh terhadap konvensi:

```tsx
// File: apps/frontend/src/components/ui/primary-action-link.tsx

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

// 1. Definisikan Props Interface dengan suffix Props
export interface PrimaryActionLinkProps {
  href: string;
  children: ReactNode;
  className?: string; // Opsional className untuk fleksibilitas styling
}

// 2. Export named function menggunakan PascalCase
// 3. Lakukan destructuring props langsung pada parameter fungsi
export function PrimaryActionLink({ 
  href, 
  children, 
  className = "" 
}: PrimaryActionLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center rounded-[36px] bg-white p-1 transition-transform hover:scale-[1.02] ${className}`}
    >
      <span className="py-2 pl-9 pr-4 text-base font-medium text-[#ba0dcb]">
        {children}
      </span>
    </Link>
  );
}
```

---

## 4. Pengorganisasian Folder Komponen

Komponen diatur berdasarkan tingkat kompleksitas dan domain bisnisnya di bawah direktori `apps/frontend/src/components/`:

| Direktori | Deskripsi | Contoh File |
| :--- | :--- | :--- |
| `components/ui/` | Komponen primitif, reusable, atomik tanpa ketergantungan domain bisnis khusus. | `material-icon.tsx`, `spinning-wheel.tsx` |
| `components/typography/` | Komponen untuk standarisasi teks dan heading. | `hero-heading.tsx` |
| `components/navigation/` | Komponen navigasi web utama. | `navbar.tsx`, `notification-bell.tsx` |
| `components/layout/` | Komponen pembungkus halaman (shell, sidebar wrapper, page transitions). | `task-desktop-page-transition.tsx` |
| `components/[sub-app]/` | Komponen khusus spesifik modul / Sub-App (ODDS, Creative Report, Pricetag). | `odds-task-chat.tsx` di `components/odds/` |

---

## 5. Praktik Terbaik Tambahan

1. **Named Exports:** Selalu gunakan *named export* (`export function Component()`) alih-alike *default export* (`export default Component`). Ini membantu auto-import pada IDE bekerja dengan lebih konsisten dan mempermudah refactoring.
2. **Destructuring Props:** Deklarasikan props dengan destructuring pada fungsi utama untuk memudahkan pembacaan dan penyediaan *default values*.
3. **Pemisahan Logika Kompleks:** Jika komponen memerlukan state management yang kompleks, pisahkan custom hooks ke berkas terpisah dengan prefix `use` (misal: `use-odds-timer.ts`).
