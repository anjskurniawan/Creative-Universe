# Component Catalog V1

## Tujuan

Catalog V1 digunakan untuk menampilkan component secara terstruktur melalui tree katalog dan playground interaktif.

## Struktur Folder

```text
v1/
├─ catalog/                         # Source component yang ditampilkan
│  └─ title.tsx
├─ components/                      # Infrastruktur catalog dan playground
│  ├─ catalog-sidebar.tsx
│  ├─ interactive-playground.tsx
│  ├─ menu-list.tsx
│  └─ playground-area.tsx
├─ data/                            # Struktur tree katalog
│  └─ catalog-items.ts
├─ previews/                        # Preview masing-masing component
│  └─ title-preview.tsx
├─ page.tsx
└─ README.md
```

## SOP Menambahkan Component

1. Buat source component di `catalog/`.
2. Gunakan nama file kebab-case dan nama component yang profesional.
3. Buat file preview terpisah di `previews/`.
4. Render source component melalui `InteractivePlayground` di file preview.
5. Tambahkan item ke tree di `data/catalog-items.ts`.
6. Hubungkan item tree ke preview di `components/playground-area.tsx`.
7. Gunakan `componentPath` yang menunjuk ke file source di `catalog/` agar tab Code menampilkan source aktual.

## Aturan PlaygroundArea

`playground-area.tsx` hanya menangani layout dan pemilihan preview berdasarkan `activeItem`. Jangan menaruh detail JSX preview component di file ini.

Setiap component baru harus memiliki file preview sendiri, misalnya:

```text
catalog/back-button.tsx
previews/back-button-preview.tsx
```

## Aturan Preview

File preview bertanggung jawab atas:

- Component yang dirender.
- `componentName`.
- `componentPath`.
- Contoh penggunaan pada fallback code.
- Breadcrumb dari tree katalog.
- Controls khusus component jika diperlukan.

Controls harus menggunakan label yang menjelaskan prop atau isi sebenarnya. Hindari label generik `Children`. Jika component memiliki beberapa isi atau prop, buat control terpisah, misalnya `Label`, `Title text`, `Icon`, `Variant`, atau `Disabled`. Control tidak dibatasi pada text; gunakan input yang sesuai seperti checkbox, select, color picker, atau control component lainnya.

## Verifikasi

Setelah perubahan, jalankan dari folder `apps/frontend`:

```powershell
npx prettier --write src/app/component/v1
npx tsc --noEmit --pretty false
git diff --check
```
