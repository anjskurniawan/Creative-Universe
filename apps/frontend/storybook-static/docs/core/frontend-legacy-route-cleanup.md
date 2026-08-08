# Frontend Legacy Route Cleanup

**Status:** ACTIVE
**Phase:** F6 completed
**Verified:** 2026-07-15

## 1. Tujuan

F6 membersihkan page route, compatibility page, alias, redirect, dan static deployment artifact yang memakai URL frontend lama. Kontrak API aktif tidak diklasifikasikan sebagai route halaman dan tidak ikut dibersihkan.

## 2. Hasil audit source

Source aktif `apps/frontend/src/app` tidak lagi mendefinisikan:

- `/task/*`.
- `/pricetag/*` sebagai top-level page route.
- `/ai-agent`.
- `/assets-design`.
- `/creative-reports` sebagai page route.

Tidak ditemukan redirect atau compatibility page menuju URL tersebut. Next.js rewrites pada `next.config.ts` adalah proxy development untuk API, CSRF, dan broadcasting; itu bukan alias page route dan tetap dipertahankan.

## 3. Artifact yang dipindahkan

Audit deployment lama menemukan:

| Lokasi lama | Jumlah file | Keterangan |
|---|---:|---|
| `apps/backend/public/task` | 44 | Static page `/task/*` dan consumer `/homework-tasks` lama |
| `apps/backend/public/pricetag` | 40 | Static page `/pricetag/*` lama |

Keduanya dipindahkan tanpa dihapus ke:

```text
backup/frontend/f6-obsolete-public-routes
```

Folder tersebut tidak boleh dipublikasikan kembali.

## 4. Kontrak yang tetap valid

Pola berikut bukan route frontend lama dan tetap dipertahankan:

- `/api/v1/kv-retail/tasks/*`.
- `/api/v1/odds/tasks/*`.
- `/api/v1/generator/pricetag/*`.
- `/api/v1/creative-reports/*`.
- nama komponen KV Retail yang masih memakai istilah generik `Task`.

Rename komponen dan event lama `homework-task.*` bukan bagian cleanup route. Keduanya ditangani pada migrasi KV Retail dan modularisasi feature agar perubahan fungsi realtime tetap atomik.

## 5. Generated deployment artifact

`apps/backend/public/_next` masih dapat memuat chunk dari deployment terdahulu. Chunk tidak dihapus satu per satu karena relasinya dengan HTML dan build manifest harus konsisten. Pada quality gate deployment, public frontend artifact harus diganti secara atomik dari `apps/frontend/out` sesuai runbook cPanel.

Dokumentasi historis milestone yang menyebut URL lama tetap boleh disimpan karena diberi konteks historis. Dokumentasi yang menjadi sumber aktif tidak boleh mempromosikan URL tersebut sebagai kontrak berjalan.

## 6. Acceptance F6

- Tidak ada page route atau compatibility alias lama dalam source aktif.
- Static folder `/task` dan `/pricetag` tidak lagi berada di backend public.
- Seluruh artifact dipindahkan ke backup, bukan dihapus.
- Prefix API aktif tidak ikut dipindahkan.
- 39 static pages tetap berhasil dibangun.
- Dokumen cleanup tersedia melalui `/docs`.
