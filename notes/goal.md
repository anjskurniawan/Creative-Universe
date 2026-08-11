# React Spectrum S2 Components yang Belum Ada

Daftar ini membandingkan dokumentasi component React Spectrum S2 yang terpasang di `.agents/skills/react-spectrum-s2/references/components` dengan folder `apps/frontend/src/components/spectrum`.

## Belum tersedia di `components/spectrum`

- Breadcrumbs
- ButtonGroup
- CardView
- Checkbox
- CheckboxGroup
- ColorArea
- ColorField
- ColorSlider
- ColorSwatch
- ColorSwatchPicker
- ColorWheel
- ContextualHelp
- DateField
- DatePicker
- DateRangePicker
- Dialog
- Disclosure
- Divider
- DropZone
- Form
- IllustratedMessage
- Image
- LabeledValue
- Link
- LinkButton
- ListView
- Menu
- Meter
- NumberField
- Picker
- Popover
- ProgressBar
- ProgressCircle
- Provider
- RadioGroup
- RangeCalendar
- RangeSlider
- SearchField
- SegmentedControl
- SelectBoxGroup
- Skeleton
- Slider
- StatusLight
- Switch
- TableView
- Tabs
- TagGroup
- TextArea
- TimeField
- ToggleButton
- ToggleButtonGroup
- Tooltip
- TreeView

## Catatan

- `Settings/SettingTitle` sudah ada, tetapi merupakan component internal aplikasi, bukan component S2 langsung.
- `icons` dan `illustrations` tersedia di dokumentasi S2, tetapi dikategorikan sebagai katalog asset, bukan wrapper component di `components/spectrum`.
- `Provider` sudah digunakan langsung dari `@react-spectrum/s2/Provider` di layout, tetapi belum memiliki wrapper di `components/spectrum`.
- Daftar ini adalah backlog kandidat, bukan instruksi untuk membuat semuanya sekaligus. Buat wrapper hanya ketika component dibutuhkan oleh fitur aplikasi, Developer Library, atau pola penggunaan yang berulang.

## Panduan Skill `spectrum-component`

Skill `spectrum-component` digunakan untuk membuat component React Spectrum S2 baru secara lengkap.

### Input yang dibutuhkan

Instruksi sebaiknya berisi:

- Nama component PascalCase, misalnya `Dialog`.
- Referensi component React Spectrum S2.
- API/props yang harus didukung.
- Variant, size, state, dan behavior.
- Child component atau collection yang diperlukan.
- Kebutuhan accessibility.
- Apakah perlu controlled/uncontrolled state.
- Target penggunaan atau konteks fitur.

Contoh input yang baik:

> Buat component Spectrum S2 `Dialog` berdasarkan dokumentasi resmi React Spectrum. Gunakan wrapper `@react-spectrum/s2/Dialog`, dukung heading, content, button group, close behavior, controlled state, accessibility, Storybook, dan Developer Library.

### Output yang dihasilkan

Skill ini tidak hanya membuat satu file wrapper. Output lengkapnya meliputi:

- `Component/Component.tsx`
- `Component/Component.stories.tsx`
- `Component/Component.docs.mdx`
- `Component/index.ts`
- Wrapper `.spectrum-component`
- Props dan ref forwarding
- Export subcomponent dan type resmi
- Storybook stories dan dokumentasi berbahasa Inggris
- Preview Developer Library
- Metadata catalog
- Registry preview
- Child component registration
- Entry pada `notes/component_functions.md`
- Version awal `0.0`
- History component
- Validasi TypeScript
- ESLint
- Storybook build
- Vitest Storybook bila tersedia
- `git diff --check`
- Work log pada `notes/logs/agent-work-log.md`

### Batas penggunaannya

Skill ini cocok untuk:

- Membuat component Spectrum baru.
- Menambahkan component yang belum ada di `components/spectrum`.
- Membuat wrapper resmi yang siap masuk Developer Library.

Skill ini tidak digunakan untuk:

- Mengubah component Universe.
- Migrasi component lama.
- Update catalog component yang sudah ada.
- Membuat component duplicate.
- Membuat component tanpa API atau kebutuhan yang jelas.

Jadi, input harus spesifik, sedangkan outputnya adalah satu paket component lengkap yang siap digunakan, didokumentasikan, dikatalogkan, dan divalidasi.

## Goal Eksekusi: Melengkapi Seluruh React Spectrum S2 Components

### Tujuan utama

Lengkapi seluruh component React Spectrum S2 yang belum tersedia di apps/frontend/src/components/spectrum.

Gunakan skill spectrum-component untuk setiap component baru. Pengerjaan wajib dilakukan satu per satu dan berurutan sesuai daftar backlog di bawah ini, mulai dari Breadcrumbs sampai TreeView.

### Sumber referensi

Untuk setiap component, gunakan referensi asli React Spectrum S2 yang sesuai di:

`.agents/skills/react-spectrum-s2/references/components/<Component>.md`

Baca dokumentasi component secara lengkap sebelum membuat wrapper, termasuk API, props, subcomponent, slot, collection behavior, state, accessibility, dan contoh penggunaannya.

### Gate wajib kesesuaian dependency React Spectrum S2

Dokumentasi lokal bukan sumber kebenaran tunggal. Sebelum membuat, mengubah, atau menyatakan component selesai, cocokkan component terhadap dependency yang benar-benar terpasang di `apps/frontend/node_modules/@react-spectrum/s2`.

Untuk setiap target, audit dan simpan bukti berikut:

- Versi aktual `@react-spectrum/s2` dari `apps/frontend/package.json` dan lockfile.
- Subpath import yang benar-benar tersedia.
- Export runtime, export type, props, ref type, subcomponent, dan generic yang benar-benar tersedia.
- Perbedaan antara dokumentasi lokal, source package, declaration/type file, dan hasil TypeScript.
- Apakah component merupakan public API S2 yang tersedia atau hanya nama yang ada di dokumentasi tetapi belum tersedia di dependency.

Aturan keputusan:

- Wrapper resmi hanya boleh memakai import langsung dari subpath `@react-spectrum/s2/<Component>` yang terbukti tersedia.
- Jangan membuat import, export, props, child component, type, atau behavior yang tidak ada pada dependency aktual.
- Jangan menganggap build Storybook, mock, alias, fixture, atau TypeScript yang lolos sebagai bukti bahwa component tersebut adalah API resmi S2.
- Jika subpath tidak tersedia, tandai component sebagai `Terblokir` dan catat subpath yang hilang serta bukti pemeriksaannya.
- Adapter kompatibilitas hanya boleh dibuat jika pengguna memintanya secara eksplisit. Adapter wajib dibedakan dari wrapper resmi, menjelaskan primitive S2 yang dipakai, dan tidak boleh dihitung sebagai component resmi yang selesai.
- Jika dependency berbeda dari dokumentasi lokal, ikuti dependency aktual dan catat perbedaannya; jangan menebak atau menyalin API dari versi lain.
- Goal tidak boleh dinyatakan selesai apabila masih ada target berupa adapter, placeholder, mock, alias, atau wrapper dengan API rekaan.

### Audit ulang component yang sudah dibuat

Sebelum audit akhir, ulangi pemeriksaan untuk seluruh component yang sudah ada, bukan hanya component baru. Audit satu per satu dan hasilkan daftar yang memuat:

- Nama component, path source, dan subpath package yang digunakan.
- Status export/type/ref/child API: `Sesuai`, `Berbeda`, atau `Tidak tersedia`.
- Status props dan behavior terhadap dependency aktual.
- Status stories, docs, preview, metadata, registry, dan component functions.
- Status TypeScript, ESLint, Vitest, Storybook build, dan diff check.
- Warning, error, API rekaan, adapter, placeholder, atau item yang terlewat.

Hasil audit valid hanya jika setiap klaim dapat ditelusuri ke source/declaration package, file project, atau output command. Ringkasan angka tanpa daftar component dan bukti per item tidak cukup.

### Urutan component yang wajib dibuat

1. Breadcrumbs
2. ButtonGroup
3. CardView
4. Checkbox
5. CheckboxGroup
6. ColorArea
7. ColorField
8. ColorSlider
9. ColorSwatch
10. ColorSwatchPicker
11. ColorWheel
12. ContextualHelp
13. DateField
14. DatePicker
15. DateRangePicker
16. Dialog
17. Disclosure
18. Divider
19. DropZone
20. Form
21. IllustratedMessage
22. Image
23. LabeledValue
24. Link
25. LinkButton
26. ListView
27. Menu
28. Meter
29. NumberField
30. Picker
31. Popover
32. ProgressBar
33. ProgressCircle
34. Provider
35. RadioGroup
36. RangeCalendar
37. RangeSlider
38. SearchField
39. SegmentedControl
40. SelectBoxGroup
41. Skeleton
42. Slider
43. StatusLight
44. Switch
45. TableView
46. Tabs
47. TagGroup
48. TextArea
49. TimeField
50. ToggleButton
51. ToggleButtonGroup
52. Tooltip
53. TreeView

### Aturan implementasi setiap component

Untuk setiap component:

- Gunakan nama PascalCase yang sama untuk nama component, folder, dan file.
- Buat folder apps/frontend/src/components/spectrum/<Component>/.
- Buat <Component>.tsx, <Component>.stories.tsx, <Component>.docs.mdx, dan index.ts.
- Import source resmi dari `@react-spectrum/s2/<Component>` hanya setelah subpath dan export-nya terbukti tersedia pada dependency aktual.
- Gunakan wrapper .spectrum-component.
- Teruskan seluruh props dan ref ke component S2.
- Pertahankan API dan behavior React Spectrum S2.
- Jangan menambahkan styling custom yang menggantikan styling Spectrum.
- Jangan membuat duplicate jika component sudah ada atau sudah terdaftar.
- Gunakan "use client" jika dibutuhkan oleh ref, event, state, atau API browser.

### Subcomponent dan child component

Jika dokumentasi S2 menyediakan subcomponent resmi, wrapper wajib mengekspor subcomponent dan type yang diperlukan oleh consumer.

Subcomponent yang benar-benar menjadi bagian API harus:

- Diekspor dari index.ts atau file wrapper sesuai kebutuhan.
- Didokumentasikan dalam Storybook.
- Digunakan pada preview jika relevan.
- Didaftarkan sebagai childComponents di Developer Library jika dapat digunakan atau dinavigasi secara terpisah.

### Storybook dan dokumentasi

Setiap component wajib memiliki stories dan docs berbahasa Inggris yang mencakup, jika didukung API:

- Basic usage.
- Variant, size, dan density.
- Disabled, invalid, pending, loading, atau state boundary.
- Controlled dan uncontrolled state.
- Event utama dengan callback lokal.
- Child component atau collection integration.
- Accessibility.
- Internationalization jika relevan.
- QA Spectrum Light/Dark.
- API table yang sesuai dengan API aktual.

### Developer Library

Setiap component wajib disinkronkan ke Developer Library dengan:

- Metadata pada apps/frontend/src/app/developer/library/data/spectrum/library.data.ts.
- Preview nyata pada apps/frontend/src/app/developer/library/previews/spectrum/<Component>.preview.tsx.
- Export pada previews/spectrum/index.tsx.
- Tepat satu registry entry pada previews/index.tsx dengan key spectrum/<Component>.
- Entry fungsi pada notes/component_functions.md.
- Version awal 0.0 dan history component.

Preview wajib mengimpor dan merender component asli dari @/components/spectrum/<Component> menggunakan fixture lokal yang deterministik, compact, dan tidak memanggil service nyata.

### Validasi

Setelah setiap component selesai, jalankan dari apps/frontend:

- npx tsc --noEmit --pretty false
- ESLint untuk seluruh file terkait.
- npm run build-storybook -- --quiet
- npx vitest --project storybook --run --reporter=verbose jika project mendukung.
- git diff --check -- <semua file yang diubah>

Selain gate teknis tersebut, jalankan audit dependency untuk component yang sedang dikerjakan dan seluruh component yang sudah dibuat. Pada audit final, cocokkan ulang package export/subpath dengan source wrapper; jangan hanya memeriksa keberadaan folder atau keberhasilan build.

Jika Vitest gagal karena executable Playwright belum terpasang, pasang Chromium dengan npx playwright install chromium, lalu ulangi test.

Jangan menghapus test, addon, konfigurasi, atau dependency hanya untuk menyembunyikan error.

### Aturan pengerjaan dan pelaporan

- Selesaikan component dalam urutan yang ditentukan.
- Setelah satu component selesai dan tervalidasi, lanjut ke component berikutnya.
- Jangan melewati component tanpa mencatat blocker yang jelas.
- Pertahankan perubahan pengguna atau agent lain yang tidak terkait.
- Jangan mengubah globals.css, theme global Storybook, dependency, atau konfigurasi bersama kecuali validasi membuktikan perubahan tersebut diperlukan.
- Jangan memanggil API nyata, auth, database, upload, atau production service dari stories maupun preview.
- Setelah setiap component atau batch kerja, tambahkan satu entry terbaru ke notes/logs/agent-work-log.md.
- Laporkan file source, stories/docs, catalog, preview, registry, child component, version/history, validasi, status visual/browser, blocker, dan tindak lanjut.

### Definisi selesai

Goal dianggap selesai hanya jika seluruh 53 component pada daftar memiliki wrapper resmi yang benar-benar didukung dependency React Spectrum S2 aktual, stories, docs, Developer Library metadata, preview, registry, child component registration yang relevan, version/history, dan seluruh validasi yang diwajibkan. Component yang tidak tersedia pada dependency, hanya berupa adapter, placeholder, mock, alias, atau API rekaan tidak dihitung sebagai selesai; component tersebut harus dicatat sebagai blocker dengan bukti per item.
