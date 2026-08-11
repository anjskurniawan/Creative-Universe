# Todo Migrasi Settings Account ke Spectrum

## Hasil analisis `settings/account`

Folder tersebut memiliki 6 route:

- `/account`
- `/account/profile`
- `/account/appearance`
- `/account/notifications`
- `/account/privacy`
- `/account/applications`

Page route-nya hanya sebagai wrapper. Implementasi utama berada di:

- `account-profile-settings.tsx`
- `account-appearance-settings.tsx`
- `account-notifications-settings.tsx`
- `account-privacy-settings.tsx`
- `account-applications-settings.tsx`

### Kondisi saat ini

Area content masih dominan menggunakan:

- Native `<input>`
- Native `<select>`
- Native `<button>`
- Native `<label>`
- Tailwind CSS
- `MaterialIcon`
- Alert custom berbasis `<div>` atau `<p>`

Yang sudah memakai Spectrum hanya:

- `Avatar` pada halaman Profile.

### Rekomendasi migrasi

| Halaman | Komponen Spectrum yang cocok | Kompleksitas |
|---|---|---|
| Appearance | `ComboBox`, `Switch`, `Button`, `Toast` | Rendah |
| Privacy | `Switch`, `Button`, `Toast` | Rendah |
| Applications | `Card`, `Text`, icon Spectrum | Rendah |
| Notifications | `Switch`, `TextField`, `Button`, `Toast` | Sedang |
| Profile | `TextField`, `Button`, `Avatar`, `Toast` | Tinggi |

Halaman Profile paling berisiko karena memiliki fitur crop avatar interaktif, upload file, pointer drag, zoom, dan canvas. Logic tersebut harus dipertahankan saat field-nya diganti ke Spectrum.

### Struktur yang disarankan

Setiap halaman mengikuti pola seperti `workflow`:

- Form content utama di kolom `2/3`.
- Kolom kanan `1/3` untuk InlineAlert kontekstual.
- Input memakai component Spectrum.
- Submit memakai Spectrum Button.
- Alert hasil simpan memakai Spectrum Toast.
- InlineAlert muncul ketika field sedang fokus.
- Provider Spectrum tetap menggunakan konfigurasi global yang sudah tersedia.

### Urutan pengerjaan

- [x] Migrasikan Appearance.
- [x] Migrasikan Privacy.
- [x] Migrasikan Applications.
- [x] Migrasikan Notifications.
- [x] Migrasikan Profile tanpa mengubah logic crop avatar.
- [x] Validasi payload API dan permission setiap halaman.
- [x] Jalankan ESLint, TypeScript, dan `git diff --check`.
- [x] Lakukan validasi visual pada seluruh route account.
