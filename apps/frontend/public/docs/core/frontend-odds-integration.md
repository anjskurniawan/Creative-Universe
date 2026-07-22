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

## 6. Dashboard Designer

Dashboard Designer berada pada route `/odds` ketika user memiliki permission
`view-assigned-odds-tasks` dan tidak sedang memakai mode control/administrasi.
Title halaman memakai komponen global `HeaderTitle` dengan alignment kiri.

Main content Dashboard Designer terdiri dari card berikut:

| Card | Sumber data | Fungsi UI |
|---|---|---|
| Total Tugas Hari Ini | `tasks` dengan status `in_progress` | Menampilkan jumlah task aktif hari ini dan indikator perubahan performa. |
| Total Dalam Antrian | `tasks` dengan status `queued` | Menampilkan jumlah task yang masih dalam antrean. |
| Tugas Selesai | `tasks` dengan status `done` | Menampilkan jumlah task selesai pada periode berjalan. |
| Antrian Revisi | `tasks` dengan status `revision` | Menampilkan jumlah task revisi yang menunggu pengerjaan. |
| Request Terbaru | 5 task terbaru berdasarkan `created_at` | Menampilkan daftar request terbaru dalam panel scroll internal. |
| Calendar | tanggal lokal browser | Menampilkan hari, tanggal, bulan, dan tahun saat ini sebagai kartu tanggal. |
| Need Review Brief | `tasks` dengan status `spv_review` atau `client_review` | Menampilkan task yang menunggu review brief dalam panel scroll internal. |
| Notification | task aktif, maksimal 8 item | Menampilkan ringkasan update status task aktif. |
| Message | task aktif, maksimal 8 item | Menampilkan pintasan diskusi brief/task. |

Card `Score Kamu`, `Grafik Performa`, dan `Queue Jobs` tidak dirender pada
Dashboard Designer saat ini. Kode kalkulasi skor/performa boleh tetap ada
sementara untuk memudahkan pengembalian UI, tetapi card tersebut tidak dihitung
sebagai bagian dari main content aktif.

### 6.1 ODDS Task Card

Task card ODDS adalah komponen list task yang dipakai untuk menampilkan satu
task dalam bentuk card horizontal. Dokumentasi visualnya terbaca di route
`/docs?section=components/odds-task-card`.

Task card disiapkan dalam tiga view:

| View | Target pengguna | Catatan UI |
|---|---|---|
| Admin | Root, Admin, SPV, Manajer | Menonjolkan pengawasan status, overdue, dan akses operasional. |
| Client | Requester/client | Menonjolkan progress, detail brief, dan action review dari sisi requester. |
| Designer | Assigned designer | Menonjolkan antrean kerja, detail brief, chat task, start task, deadline, dan status pengerjaan. |

View Designer saat ini digunakan pada menu Dashboard Designer `Semua Tugas`.
View Admin dan Client disiapkan sebagai kontrak dokumentasi/library agar
implementasi berikutnya tetap memakai anatomy card yang sama.

## 7. Quality gate

- Test ODDS mencakup pemisahan permission skip, payload list, larangan review ulang, dan deadline extension.
- TypeScript dan ESLint file ODDS wajib lulus.
- Production build dan regression backend penuh wajib lulus.
- Dokumen ini disinkronkan ke `/docs` sebagai **ODDS Integration**.

## 8. Batas F17

F17 menyelesaikan workflow ODDS. Konsolidasi halaman Messages, inbox, dan seluruh adapter Core Chat dilanjutkan pada F18 agar ownership Core tidak tercampur kembali ke Sub-App ODDS.
