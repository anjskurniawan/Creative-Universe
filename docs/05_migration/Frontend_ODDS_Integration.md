# Frontend ODDS Integration

**Status:** ACTIVE  
**Phase:** F17 completed  
**Verified:** 2026-07-15

## 1. Tujuan

F17 melengkapi kontrak frontend One Dashboard Design System (ODDS) terhadap backend modular tanpa mengubah lifecycle bisnis yang telah disetujui. Route halaman tetap `/odds`, detail static-export tetap `/odds/detail?id={taskId}`, dan API tetap berada pada `/api/v1/odds`.

## 2. Ownership kontrak

- Seluruh request workflow ODDS dimiliki `src/features/odds/api`.
- Page dan komponen ODDS tidak memanggil API client generik secara langsung.
- Chat task tetap kontrak Core Chat meskipun digunakan pada detail ODDS.
- Reassign mempertahankan satu task room, mengganti participant desainer, dan menjaga SPV/Manajer sebagai pembaca history.
- Pusher tetap provider realtime resmi; F17 tidak membuat client realtime kedua.

## 3. Workflow yang dilengkapi

| Workflow | Permission frontend/backend | Consumer |
|---|---|---|
| Mengajukan skip antrean | `request-odds-queue-skip` | Detail task desainer |
| Review skip antrean | `review-odds-queue-skip` | Workspace review SPV/Manajer |
| Memperpanjang deadline | `manage-odds-escalations` | Detail task SPV/Manajer |

Alias permission yang dilihat user adalah **Mengajukan Skip Antrean ODDS** dan **Meninjau Skip Antrean ODDS**. Key teknis tidak ditampilkan sebagai nama fitur UI.

## 4. Aturan keamanan skip antrean

Backend menjadi sumber kebenaran dan menolak:

- request dari user yang bukan assigned designer;
- request saat task tidak berada pada status antrean;
- lebih dari satu request pending untuk task yang sama;
- skip terhadap task yang bukan prioritas berikutnya;
- review oleh desainer;
- review ulang request yang sudah diputuskan.

`manage-odds-queue` tidak lagi dipakai sebagai permission mutation skip. Permission request dan review dipisahkan agar desainer tidak dapat menyetujui request-nya sendiri.

## 5. State UI

- Detail menampilkan status pending skip kepada assigned designer.
- Review pending skip berasal dari relasi `skip_requests` pada payload task list; frontend tidak merekonstruksi status sendiri.
- Mutation memakai adapter ODDS dan memuat ulang task dari backend setelah sukses.
- Aksi deadline memakai tanggal baru dan catatan opsional, lalu menampilkan deadline hasil backend.

## 6. Quality gate

- Test ODDS mencakup pemisahan permission skip, payload list, larangan review ulang, dan deadline extension.
- TypeScript dan ESLint file ODDS wajib lulus.
- Production build dan regression backend penuh wajib lulus.
- Dokumen ini disinkronkan ke `/docs` sebagai **ODDS Integration**.

## 7. Batas F17

F17 menyelesaikan workflow ODDS. Konsolidasi halaman Messages, inbox, dan seluruh adapter Core Chat dilanjutkan pada F18 agar ownership Core tidak tercampur kembali ke Sub-App ODDS.
