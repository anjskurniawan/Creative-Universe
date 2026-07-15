# Frontend Refactor Baseline

**Status:** ACTIVE
**Phase:** F0 completed
**Verified:** 2026-07-15

## Tujuan

Dokumen ini mencatat kondisi frontend sebelum modularisasi dan sinkronisasi menyeluruh dengan backend baru. Baseline digunakan untuk membandingkan perubahan pada tahap F1 dan seterusnya.

## Snapshot pemulihan

- Lokasi: `backup/frontend/f0-2026-07-15-baseline`.
- Isi awal: 154 file, 11.095.044 byte.
- Tidak menyertakan `.env.local`, `node_modules`, `.next`, `out`, `.playwright-cli`, atau `tsconfig.tsbuildinfo`.
- Snapshot dibuat dari worktree aktif sehingga mencakup pekerjaan backend B0-B9 yang telah memengaruhi frontend.

## Inventaris awal

| Area | Jumlah |
|---|---:|
| Source TypeScript, TSX, dan CSS | 105 file |
| Page App Router | 36 |
| Layout App Router | 5 |
| Page di route group `(dashboard)` | 23 |
| Page di route group `(auth)` | 2 |
| Page top-level KV Retail dan Creative Report | 7 |
| File komponen | 55 |
| File library | 7 |
| Consumer `apiFetch` | 25 file |
| Consumer `fetch` langsung | 3 file |
| Consumer Echo/Pusher | 6 file |

## Temuan struktur prioritas

Sub-App berikut masih berada secara fisik di bawah `src/app/(dashboard)` dan harus dipindahkan ke boundary aplikasinya sendiri:

- Creative AI.
- Design Assets.
- Generator / Pricetag.
- ODDS.

`(dashboard)` akan diganti menjadi `(core)` dan hanya boleh memiliki route Core seperti dashboard, profile, settings, users, roles, messages, dan maintenance. Playground serta component inventory harus diklasifikasikan kembali sebelum dipindahkan atau diamankan ke backup.

## Quality baseline

| Pemeriksaan | Hasil |
|---|---|
| TypeScript `npx tsc --noEmit --pretty false` | Lulus |
| Production build `npm run build` | Lulus, 39 static pages |
| ESLint `npm run lint` | Gagal, 10 error dan 17 warning |

Masalah lint terutama berada pada KV Retail Option, Task Card, Echo client, serta beberapa import dan state yang tidak digunakan. Error tersebut dicatat sebagai technical debt awal dan belum diubah pada F0 agar baseline tetap merepresentasikan kondisi sebelum refactor.

## Risiko deployment yang sudah diketahui

Next.js memperingatkan bahwa rewrites, redirects, dan headers tidak diterapkan pada `output: export`. Integrasi API, broadcasting authorization, serta download file harus menggunakan backend host yang eksplisit atau aturan web server cPanel; frontend tidak boleh bergantung pada Next.js rewrites ketika sudah diekspor statis.

## Gerbang tahap berikutnya

F1 melakukan audit frontend terperinci. Tidak boleh ada pemindahan route besar atau perubahan kontrak fungsi sebelum hasil audit mengklasifikasikan file menjadi aktif, perlu refactor, eksperimental, atau obsolete.
