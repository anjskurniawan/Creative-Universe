# Komponen Navbar

Navbar adalah komponen navigasi utama yang tampil di seluruh halaman dashboard Creative Universe.

---

## Props

Komponen ini tidak menerima props eksternal. Semua data (user, notifikasi) diambil dari `AuthContext` dan API internal.

## Fitur

- **Branding** — Logo dan nama aplikasi di sisi kiri.
- **Notifikasi** — Bell icon dengan badge counter real-time via Pusher.
- **User menu** — Dropdown dengan info profil dan tombol logout.
- **Dark mode toggle** — Tombol switch tema terang/gelap.

## Penggunaan

```tsx
// Komponen ini sudah di-include otomatis oleh DashboardLayout.
// Tidak perlu diimport manual di setiap halaman.
import Navbar from '@/components/navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
```

## Dependensi Internal

- `useAuth()` — untuk data user aktif
- `MessageBell` — sub-komponen notifikasi
- `lucide-react` — ikon navigasi

---

> Komponen ini bersifat **read-only** dari sisi props. Modifikasi perilaku dilakukan melalui context atau state global.
