# Frontend Creative Report Integration

**Status:** ACTIVE  
**Phase:** F16 completed  
**Verified:** 2026-07-15

## 1. Tujuan

F16 menyelaraskan halaman Creative Report dengan boundary backend modular. Nama aplikasi resmi pada UI adalah **Creative Report**, route halaman kanonis adalah `/creative-report`, dan prefix API tetap `/api/v1/creative-reports` sebagai koleksi REST.

## 2. Kontrak akses

Akses aplikasi dan izin fitur merupakan dua lapisan terpisah:

| Lapisan | Kontrak |
|---|---|
| Akses sub-app | assignment aplikasi `creative-report` |
| Melihat laporan | `creative-report.assessments.view` |
| Mengubah/menyelesaikan penilaian | `creative-report.assessments.update` |

Alias permission untuk UI disimpan pada metadata backend, sehingga key teknis tetap stabil dan nama yang dilihat pengguna tetap mudah dipahami.

## 3. Boundary frontend

- DTO Creative Report berada di `src/features/creative-report/types.ts`.
- Seluruh request domain memakai `creativeReportApi` dari `src/features/creative-report/api`.
- Page tidak lagi memanggil API client generik secara langsung.
- Tombol input, edit, simpan, dan selesaikan hanya tampil jika user memiliki permission update.
- Penyimpanan satu grup dijalankan paralel per assessment; proses complete tetap dijalankan setelah draft assessment terkait tersimpan.

## 4. State dan URL kanonis

Detail user memakai URL sebagai satu-satunya sumber identitas dan periode:

```text
/creative-report/detail?user={userId}&month={YYYY-MM}
```

`sessionStorage` tidak lagi dipakai. Perubahan bulan memperbarui URL sehingga halaman dapat di-refresh, dibagikan, dan dibuka kembali tanpa state tersembunyi. Link dari daftar selalu membawa `user` dan `month`.

Daftar laporan membatalkan request lama ketika filter berubah dan memberi debounce 250 ms pada pencarian. Ini mencegah response lama menimpa filter terbaru.

## 5. Backend enforcement

- Route API dilindungi autentikasi dan middleware assignment `app:creative-report`.
- Policy assessment memeriksa permission fitur, bukan nama role.
- Role Root, Manajer, dan SPV memperoleh permission sesuai baseline organisasi saat seeder dijalankan.
- Test membuktikan bahwa assignment aplikasi tanpa permission update tetap read-only, sedangkan permission tanpa assignment aplikasi tetap ditolak.

## 6. Quality gate

- Contract test Creative Report wajib lulus.
- TypeScript `tsc --noEmit` wajib lulus.
- Build production frontend wajib lulus.
- Dokumen ini wajib tersedia melalui route `/docs` sebagai **Creative Report Integration**.

## 7. Catatan pemeliharaan

Integrasi antar sub-app di masa depan harus melalui kontrak service/event yang eksplisit. Creative Report tidak boleh membaca tabel milik sub-app lain secara langsung.
