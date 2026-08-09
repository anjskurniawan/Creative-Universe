---
name: spectrum-component
description: Membuat component React Spectrum S2 baru di apps/frontend/src/components/spectrum dengan nama component dan file PascalCase, lengkap dengan wrapper style otomatis, Storybook stories/docs berbahasa Inggris, preview Developer Library, metadata, validasi, dan pencatatan wajib melalui skill log. Gunakan ketika pengguna memberikan instruksi lengkap atau referensi React Spectrum untuk membuat component Spectrum baru.
---

# Spectrum Component

Gunakan skill ini ketika pengguna meminta component khusus Spectrum berdasarkan instruksi, attachment, dokumentasi React Spectrum S2, atau source package. Skill ini hanya membuat component baru di kategori `spectrum`; jangan menggunakannya untuk component Universe, migrasi component lama, atau sinkronisasi library tanpa pembuatan component baru.

## Aturan utama

- Source component harus berada di folder component-nya sendiri, misalnya `apps/frontend/src/components/spectrum/ActionBar/`.
- Setiap component wajib memakai struktur `<Component>/<Component>.tsx`, `<Component>/<Component>.stories.tsx`, `<Component>/<Component>.docs.mdx` bila docs custom diperlukan, dan `<Component>/index.ts` sebagai public barrel.
- Nama component, folder, dan file utama wajib PascalCase: `ActionBar/ActionBar.tsx`, `ActionButton/ActionButton.tsx`, `Calendar/Calendar.tsx`; jangan membuat file kebab-case untuk component baru melalui skill ini.
- Nama export utama harus sama dengan nama file dan nama component.
- Pertahankan API, props, perilaku, dan struktur React Spectrum S2 yang diminta. Jangan mengganti component menjadi component Universe atau menambahkan styling custom yang meniru Spectrum.
- Import source resmi dari package `@react-spectrum/s2/<Component>` dan dependency resmi lain yang memang diperlukan. Jangan menyisakan import ke folder library eksternal, path absolut, atau source repository reference.
- Wrapper harus memakai `.spectrum-component` agar baseline style, font, token, dan color scheme Spectrum aktif otomatis tanpa Provider tambahan dari pemakai.
- Jangan mengubah `globals.css`, Storybook global theme, dependency, atau konfigurasi bersama kecuali validasi membuktikan perubahan tersebut memang diperlukan.
- Jangan memanggil API nyata, auth, database, upload, atau service production dari stories dan Developer Library preview.

## Workflow wajib

### 1. Muat konteks dan instruksi

1. Baca `skills/log/SKILL.md` sebelum mengubah file dan baca entri log terbaru yang relevan.
2. Baca `skills/component-management/SKILL.md` untuk aturan component/catalog/preview.
3. Baca `skills/frontend-styling/SKILL.md` untuk batas styling dan token.
4. Baca seluruh instruksi pengguna, attachment, API table, contoh, dan source reference. Jangan hanya mengambil nama component.
5. Periksa `git status` dan diff target. Pertahankan perubahan pengguna atau agent lain yang tidak terkait.
6. Audit apakah nama component, file PascalCase, story, docs, catalog, dan preview sudah ada. Jika component sudah ada, jangan membuat duplicate; laporkan dan gunakan alur update yang sesuai.

### 2. Audit source React Spectrum

Identifikasi export utama, subcomponent yang perlu diekspor, props, generic type, ref/event type, controlled/uncontrolled state, variant, accessibility requirement, child component resmi, kebutuhan `"use client"`, import package valid, dan keamanan fixture lokal.

Jika instruksi menyebut source package lokal, gunakan hanya sebagai referensi audit. Hasil akhir tidak boleh mengarah ke path lokal tersebut.

### 3. Buat source component

Buat folder dan file utama PascalCase, misalnya `apps/frontend/src/components/spectrum/ActionBar/ActionBar.tsx`:

1. Tambahkan `"use client"` bila component memakai ref, event, state, atau API browser.
2. Import component dan type dari subpath package S2 yang sesuai.
3. Re-export subcomponent/type yang secara resmi diperlukan oleh pola penggunaan component.
4. Bungkus component utama dengan `<div className="spectrum-component">` dan teruskan seluruh props/ref ke component S2.
5. Jangan menyalin source internal React Spectrum ke project kecuali pengguna secara eksplisit memintanya; wrapper package adalah default.
6. Jangan menambah props custom yang tidak diminta. Jika adapter diperlukan, dokumentasikan keputusan tersebut di log.

### 4. Buat Storybook

Buat file dengan nama PascalCase yang konsisten di folder component: `<Component>/<Component>.stories.tsx` dan `<Component>/<Component>.docs.mdx`.
Tambahkan `<Component>/index.ts` yang mengekspor public API component utama dan subcomponent yang memang perlu digunakan consumer.

Stories wajib mencakup, jika didukung API, penggunaan dasar, variant/size/density, disabled/invalid/pending, controlled dan uncontrolled state, event utama dengan callback lokal, child component atau collection integration, serta state boundary penting.

Docs wajib berbahasa Inggris dan mengikuti instruksi sumber. Minimal berisi purpose, basic usage dengan import project, seluruh contoh penting, controlled/uncontrolled behavior, state/variants/accessibility/internationalization/integration yang relevan, API table yang benar-benar ter-render, penjelasan props, Controls/Stories, dan QA Spectrum Light/Dark. Gunakan HTML table MDX bila Markdown table tampil mentah di Storybook.

Jangan menulis contoh kode yang mengarah ke path absolut. Pastikan code snippet lengkap dan tidak memiliki syntax palsu yang menyesatkan pemakai.

### 5. Sinkronkan Developer Library

Setiap component baru wajib memiliki metadata pada `apps/frontend/src/app/developer/library/data/spectrum/library.data.ts`, preview nyata pada `apps/frontend/src/app/developer/library/previews/spectrum/<Component>.preview.tsx`, export kategori pada `previews/spectrum/index.tsx`, entry tepat satu kali pada `previews/index.tsx` dengan key `spectrum/<Component>`, dan entry fungsi pada `notes/component_functions.md`.

Preview harus mengimport dan merender source asli dari `@/components/spectrum/<Component>`, memakai fixture lokal deterministik, compact, tidak terpotong, dan tidak menggandakan markup source. Jika membutuhkan collection/provider/context, buat adapter fixture lokal tanpa service nyata. Placeholder hanya boleh dipakai jika benar-benar tidak mungkin dan status harus `Selesai sebagian` atau `Terblokir`.

Metadata wajib memakai nama PascalCase, file PascalCase, deskripsi fungsi nyata, tags relevan, child component internal yang dapat dinavigasi, versi `0.0` untuk baseline, dan history Markdown. Jangan memasukkan package eksternal, type-only export, utility, atau hook sebagai `childComponents`.

### 6. Version dan history

- Component baru dimulai pada versi `0.0`.
- Hanya perubahan nyata pada source component yang menaikkan versi dan menambah history component.
- Perubahan docs, story, preview, registry, atau metadata saja tidak menaikkan versi source.
- Gunakan major untuk perubahan breaking/API/struktur besar dan minor untuk fitur, state, atau styling source.
- Jangan menghapus history lama.

### 7. Validasi

Jalankan dari `apps/frontend`: `npx tsc --noEmit --pretty false`, ESLint untuk semua file terkait, `npm run build-storybook -- --quiet`, dan `git diff --check -- <semua file yang diubah>`.

Untuk component tests yang didukung project, gunakan `npx vitest --project storybook --run --reporter=verbose`. Jika gagal karena executable Playwright belum terpasang, jalankan `npx playwright install chromium`, lalu ulangi test. Jangan menghapus `@storybook/addon-vitest` hanya untuk menyembunyikan error. Browser visual manual tidak dijalankan otomatis kecuali pengguna memintanya atau diperlukan untuk membuktikan blocker.

Audit akhir: tidak ada import path eksternal/local absolut, nama source/story/docs konsisten PascalCase, catalog tepat satu kali, registry tepat satu kali, preview bukan placeholder untuk status selesai, child route valid, dan tidak ada whitespace error.

### 8. Logging wajib

Setelah selesai, sebagian selesai, analisis, atau terblokir:

1. Tambahkan tepat satu entry terbaru ke `notes/logs/agent-work-log.md` mengikuti skill `/log`.
2. Catat source, stories, docs, preview, catalog, registry, child component, version/history, validasi, browser status, blocker, dan tindak lanjut.
3. Read-back log untuk memastikan entry berada paling atas dan field wajib terisi.
4. Setelah read-back berhasil, gunakan kalimat persis: `Berhasil di catat di notes logs`.

## Output akhir

Laporkan component dan file source PascalCase, stories/docs, catalog/preview/registry/child component, versi/history, hasil TypeScript/ESLint/Storybook/Vitest/diff check, status browser visual/manual, blocker, dan tindak lanjut. Jangan menampilkan seluruh source code kecuali pengguna memintanya.
