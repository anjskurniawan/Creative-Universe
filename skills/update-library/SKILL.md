---
name: update-library
description: Sinkronkan satu target React component ke Developer Library CreativeUniverse dengan mengaudit source terbaru, memperbarui metadata catalog, child component/dependency, preview visual, dan registry preview. Gunakan ketika pengguna meminta update library, menampilkan component yang belum ada di Visual Preview, atau memperbarui metadata component tertentu.
---

# Update Developer Library

Gunakan skill ini untuk memperbarui tepat satu target component pada Developer Library. Target dapat disebut melalui path source, nama component, nama file, atau route library. Workflow wajib menghasilkan component yang benar-benar muncul di Visual Preview, catalog yang sesuai source terbaru, metadata akurat, validasi, dan satu catatan melalui skill `/log`.

## Batas scope

- Kerjakan hanya satu target component dan file library yang diperlukan.
- Jangan melakukan sinkronisasi massal seluruh library.
- Jangan mengubah logic, styling, props, atau API source kecuali diminta eksplisit.
- Perubahan pada shared preview registry, tipe catalog, atau helper preview diperbolehkan jika diperlukan untuk target; catat alasannya.
- Pertahankan perubahan worktree yang tidak berkaitan.
- Jika target ambigu setelah pencarian source/catalog, hentikan sebelum mengubah metadata.

## Lokasi utama

- Source: `apps/frontend/src/components/<category>/<component>.tsx`
- Catalog: `apps/frontend/src/app/developer/library/data/<category>/library.data.ts`
- Registry: `apps/frontend/src/app/developer/library/previews/index.tsx`
- Preview: `apps/frontend/src/app/developer/library/previews/<category>/<component>.preview.tsx`
- Log: `notes/logs/agent-work-log.md`

## Workflow wajib

### 1. Muat konteks

1. Baca `skills/log/SKILL.md` dan ikuti aturan logging.
2. Baca entri log terbaru yang relevan dengan target, preview, catalog, atau blocker.
3. Baca `skills/component-management/SKILL.md` untuk pekerjaan component/catalog/preview.
4. Baca `skills/frontend-styling/SKILL.md` jika preview dibuat atau styling preview disentuh.
5. Periksa `git status` dan diff target sebelum mengubah file.

### 2. Resolusi dan audit target

Tentukan nama export utama, path source, kategori catalog, entry catalog, entry `PREVIEW_REGISTRY`, dan preview khusus yang sudah ada. Jika ada beberapa export, gunakan component utama yang benar-benar dirender; jangan memakai helper, type, atau export `Page` sebagai nama catalog.

Baca source target secara utuh. Catat fungsi nyata, props, state, variant, import child component, kebutuhan client directive, browser API, auth, API, database, upload, serta ukuran/layout preview. Jangan menebak metadata dari nama file saja.

### 3. Sinkronisasi metadata

Perbarui entry yang sama jika sudah ada; jangan membuat duplicate entry. Pastikan metadata berikut akurat:

- `name`: export component utama.
- `file`: path relatif kategori dengan separator `/`.
- `description`: fungsi nyata, singkat, dan tidak generik.
- `tags`: domain, interaction, visual role, dan fitur relevan.
- `childComponents`: dependency component yang relevan untuk navigasi library.

Gunakan `childComponents` untuk dependency component, bukan `children` yang merupakan struktur folder. Setiap child wajib memiliki `name`, `category`, dan `file` yang cocok dengan catalog. Jangan memasukkan utility, type-only module, hook, API, atau dependency eksternal sebagai child.

### 4. Preview visual

Pilih strategi:

1. Preview nyata dengan fixture lokal jika component aman dirender tanpa auth/API/database.
2. Preview nyata dengan toolbar state jika component memiliki variant atau interaction yang aman disimulasikan.
3. `DefaultPreviewPlaceholder` hanya sebagai status `Terblokir` atau `Selesai sebagian` setelah seluruh opsi fixture/adapter lokal yang aman sudah dicoba dan memang tidak mungkin dilakukan tanpa mengubah kontrak source atau memanggil service nyata. Placeholder bukan hasil selesai.

Aturan:

- Render source component asli; jangan menyalin markup component ke preview.
- Gunakan fixture lokal deterministik.
- Jangan memanggil API nyata, auth session, database, mutation, upload, atau service production.
- Pastikan preview tidak terpotong dan container mengikuti kebutuhan component.
- Gunakan UI reusable dan token styling project.
- Untuk helper internal yang tidak bermakna dirender mandiri, gunakan placeholder dan catat alasannya.

Target preview dianggap belum selesai jika registry masih menunjuk ke `DefaultPreviewPlaceholder`. Dalam kondisi tersebut:

- Cari fixture lokal, wrapper preview, mock callback, dan adapter context yang dapat membuat source component dirender tanpa API nyata.
- Untuk hook runtime, jangan memanggil API production; gunakan provider/adapter lokal hanya jika kontrak component memang mendukungnya.
- Jika source tidak memiliki injection point, laporkan blocker dan jangan menyatakan update library selesai.
- Preview nyata wajib mengimport dan merender source component target, bukan screenshot atau duplikasi markup.

### 5. Registry

- Pastikan `PREVIEW_REGISTRY[targetName]` ada tepat satu kali.
- Pastikan import preview dan export kategori tidak duplicate atau putus.
- Preview khusus harus memiliki file, export kategori, dan registry entry.
- Placeholder harus memakai `DefaultPreviewPlaceholder componentName="..."`.
- Registry target tidak boleh berhenti pada placeholder untuk status `Selesai`; key harus menunjuk ke preview nyata yang merender target.
- Jangan mengubah component lain kecuali diperlukan untuk import/registry target.

### 6. Validasi

Jalankan dari `apps/frontend`:

```powershell
npx tsc --noEmit
npx eslint <file-source-target> <file-catalog> <file-preview-yang-berubah> <file-registry-yang-berubah>
git diff --check -- <file-yang-berubah>
```

Audit juga bahwa target source terdaftar tepat satu kali, path memakai `/`, registry target tepat satu kali, child route valid, metadata tidak kosong, preview imports tidak putus, dan registry target bukan placeholder untuk status `Selesai`. Verifikasi browser tidak wajib dan jangan dijalankan otomatis karena mengonsumsi token/waktu; cukup lakukan validasi source, registry, TypeScript, ESLint, dan diff.

### 7. Logging wajib

Setelah selesai atau terblokir, tambahkan tepat satu entry terbaru di `notes/logs/agent-work-log.md` mengikuti format skill `/log`. Sertakan timestamp, Agent/Model, target, metadata, preview/registry, child component, validasi teknis, validasi visual/live, blocker, dan tindak lanjut. Setelah log berhasil ditulis, gunakan kalimat persis: `Berhasil di catat di notes logs`.

## Kondisi khusus

- Jika target sudah memiliki preview, audit dan perbarui preview tersebut; jangan membuat preview kedua.
- Jika metadata masih akurat, jangan mengubahnya tanpa alasan.
- Jika target belum terdaftar dan preview belum aman, tambahkan catalog tetapi status pekerjaan harus `Selesai sebagian` atau `Terblokir`; jangan melaporkan target sudah selesai.
- Jika target sudah memakai placeholder, pekerjaan harus memprioritaskan penggantian placeholder menjadi preview nyata sebelum metadata dianggap selesai. Browser tetap tidak perlu dibuka untuk menyelesaikan workflow.
- Jalankan browser/screenshot hanya jika pengguna memintanya secara eksplisit atau ada blocker yang tidak dapat dibuktikan melalui source dan validasi teknis.
- Jika validasi gagal karena error lama/unrelated, bedakan dari error akibat perubahan dan catat buktinya.
- Jika pengguna mengatakan `salah`, `kembalikan`, `rollback`, atau maksud koreksi, ikuti protokol rollback skill `/log` sebelum perubahan baru.

## Output akhir

Laporkan target, file catalog/preview/registry, metadata dan child yang disinkronkan, hasil TypeScript/ESLint/diff check/visual, blocker, lalu kalimat wajib `Berhasil di catat di notes logs`.
