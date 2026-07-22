# ODDS Feature

- Nama resmi: One Dashboard Design System.
- Page route: `/odds`.
- API prefix: `/api/v1/odds`.
- Status: active.
- Ownership: intake, brief, queue, workflow, review, revision, escalation, reporting, ranking, dan konfigurasi ODDS.

Chat menggunakan public contract Core; ODDS tidak memiliki implementasi chat global sendiri.

## Workspace Layout

ODDS memakai shell Sub-App dan komponen global `SideMenu`; tidak ada sidebar
khusus/legacy ODDS. Data menu ODDS tetap dibentuk dari permission dan badge
task yang sama, lalu dipasok ke `SideMenu`. Desktop memakai varian `Expand` dan
mobile memakai `Collaps`, agar perilaku navigasinya konsisten dengan Sub-App
lain. Route ODDS tidak merender navbar global; `SideMenu` adalah navigasi utama
workspace ODDS. Inbox Core tidak ditampilkan di menu ODDS agar navigasi hanya
memuat fungsi milik ODDS. Wrapper ODDS memakai padding sidebar 16 px yang
simetris agar panel dan seluruh tombol menu memiliki jarak kiri/kanan seimbang.

### Dashboard Designer Cards

Dashboard Designer aktif untuk user dengan `view-assigned-odds-tasks` tanpa
mode control. Main content aktif berisi card:

- Total Tugas Hari Ini
- Total Dalam Antrian
- Tugas Selesai
- Antrian Revisi
- Request Terbaru
- Calendar
- Need Review Brief
- Notification
- Message

Card `Score Kamu`, `Grafik Performa`, dan `Queue Jobs` sedang tidak dirender.
Inventory lengkap dan sumber data tiap card dicatat di
`docs/05_migration/Frontend_ODDS_Integration.md` dan terbaca di route
`/docs?section=components/odds-designer-dashboard-cards` melalui menu
`Design System > ODDS > Designer Dashboard Cards`.

### ODDS Task Card

Task card ODDS terdokumentasi sebagai komponen library di
`/docs?section=components/odds-task-card`. Komponen ini disiapkan untuk 3 view:
`Admin`, `Client`, dan `Designer`. View Designer dipakai pada menu Dashboard
Designer `Semua Tugas`; view Admin dan Client menjadi kontrak library untuk
implementasi berikutnya.

## Request Creation

`/odds/new` adalah satu form request, bukan wizard. Semua informasi kategori,
designer, detail brief, referensi, dan ringkasan submit tampil bersamaan.
Designer direkomendasikan otomatis dan tetap dapat diganti user. Deadline boleh
kosong agar SLA kategori digunakan. Referensi bersifat opsional: user dapat
mengunggah file publik, mengisi link, atau mengirim request tanpa lampiran.
File diunggah terlebih dahulu ke storage ODDS dan dipindahkan ke konteks task
ketika request berhasil dibuat.

Public API module: `api/index.ts`. Module ini juga menjadi tempat DTO ODDS sementara sampai types dipisahkan pada F24.
