---
title: "KV Retail Task: Referensi Teknis dan Fungsional"
status: current
owner: KV Retail
updated: 2026-07-19
---

# KV Retail Task: Referensi Teknis dan Fungsional

Dokumen ini adalah referensi kanonis untuk implementasi KV Retail Task yang aktif saat ini. Dokumen migrasi lama tetap berfungsi sebagai riwayat keputusan, tetapi kontrak dan perilaku yang tercantum di sini mengacu pada kode runtime sekarang.

## 1. Ruang lingkup

KV Retail Task adalah sub-app untuk mengelola workflow task Key Visual retail, dari pembuatan hingga pengiriman email. Boundary kanonisnya:

| Layer | Lokasi / nilai kanonis |
| --- | --- |
| Frontend route | `/kv-retail` |
| API prefix | `/api/v1/kv-retail` |
| Backend module | `apps/backend/app/SubApps/KvRetail` |
| Frontend feature | `apps/frontend/src/features/kv-retail` |
| Database prefix | `kv_retail_*` |
| App guard | `app:kv-retail` |
| Auth | Sanctum cookie session |
| Realtime transport | Pusher Channels |

Route page di `apps/frontend/src/app/kv-retail` hanya menjadi composition boundary. Logika task berada di feature KV Retail dan komponen bersama.

## 2. Route dan halaman

| Route | Tujuan | Implementasi utama |
| --- | --- | --- |
| `/kv-retail` | Hari ini / seluruh daftar task yang dapat dilihat user | `TaskPage` dengan scope `all` |
| `/kv-retail/unfinished` | Task yang belum `Done` | `TaskPage` dengan scope `unfinished` |
| `/kv-retail/month` | Task yang diberikan pada bulan berjalan | `TaskPage` dengan scope `current-month` |
| `/kv-retail/performance` | Report performa desktop dan mobile | `app/kv-retail/performance/page.tsx` |
| `/kv-retail/option` | Pengaturan content/CMS KV Retail | `app/kv-retail/option/page.tsx` |
| `/kv-retail/print?task={id}` | Preview task untuk tab baru / ekspor | `app/kv-retail/print/page.tsx` |

Label navigasi yang harus konsisten di desktop dan mobile adalah **Hari ini**, **Belum selesai**, **Bulan ini**, **Report**, dan **Pengaturan**.

## 3. Akses dan otorisasi

Semua endpoint berada di dalam middleware `auth:sanctum` dan `app:kv-retail`. Permission berikut menentukan aksi:

| Permission | Aksi |
| --- | --- |
| `kv-retail.tasks.view` | Membaca task dan saran Creative Agent per task |
| `kv-retail.tasks.create` | Membuat task, temporary upload, membaca/generate laporan Creative Agent performance |
| `kv-retail.tasks.update-status` | Mengubah status, judul, file, dan generate saran Creative Agent per task |
| `kv-retail.tasks.delete` | Menghapus task |
| `kv-retail.settings.manage` | Membaca opsi assignee dan mengelola CMS Pengaturan |

Selain permission, task detail menggunakan scope berikut:

- **Root, Manajer, SPV** dapat membaca semua task.
- User lain hanya membaca task yang terhubung melalui pivot `kv_retail_task_user`.
- Pembaruan status/file hanya boleh dilakukan oleh Root/Manajer/SPV atau assignee.
- Perubahan judul dan penghapusan hanya boleh dilakukan Root/Manajer/SPV atau creator task, sesuai endpoint.
- Root tidak muncul sebagai pilihan assignee operasional.

## 4. Data model

### 4.1 Tabel

| Tabel | Fungsi |
| --- | --- |
| `kv_retail_tasks` | Entitas task utama |
| `kv_retail_task_user` | Pivot many-to-many task dan user |

Riwayat migrasi awal masih bernama `homework_*`; migrasi `2026_07_14_180000_rename_homework_tasks_to_kv_retail_tasks.php` menetapkan nama tabel sekarang.

### 4.2 Field task utama

| Field | Bentuk | Keterangan |
| --- | --- | --- |
| `task_given_date` | date | Tanggal task diberikan; dasar filter bulan Report |
| `task_name` | string | Judul task; dapat diedit oleh pihak berwenang |
| `pic_vendor` | enum string | Saat ini `Mireco` atau `Fushion` |
| `deadline_date` | date | Deadline task; dasar evaluasi keterlambatan email |
| `status` | string | Status workflow aktif |
| `task_timestamps` | JSON object | Timestamp tiap tahap workflow |
| `delay_reasons` | JSON object | Alasan keterlambatan tahap dan waktu pencatatannya |
| `support_file_path` | JSON array | Maksimum tiga file referensi |
| `draft_file_path` | JSON array | Maksimum tiga file draft |
| `file_link` | nullable string | Link file/hasil eksternal |
| `created_by` | nullable user id | Creator task |
| `legacy_source`, `legacy_id` | nullable | Referensi migrasi data lama |

Model `KvRetailTask` me-cast file path, timestamp, dan delay reason sebagai array. Respons API menambahkan `timing_evaluation` secara otomatis.

## 5. Workflow status dan timestamp

Urutan workflow kanonis:

| Urutan | Status | Key timestamp | Arti |
| --- | --- | --- | --- |
| 0 | `0` | - | Belum dimulai |
| 1 | `ACC Draft` | `ACC Draft` | Draft telah di-ACC |
| 2 | `Progress Design` | `Progress` | Proses desain berjalan |
| 3 | `Approval Design` | `Approve` | Desain menunggu/sedang approval |
| 4 | `Kirim Email` | `Email` | Email penyelesaian dikirim |
| 5 | `Done` | `Email` tetap menjadi bukti pengiriman | Task selesai |

Format timestamp yang digunakan UI adalah `dd/MM/yyyy HH:mm`, contoh `19/07/2026 14:30`. Service backend juga menerima nilai tanggal yang dapat diparse Carbon.

### 5.1 Aturan keterlambatan dan bottleneck

`KvRetailTaskTimingService` adalah satu-satunya sumber evaluasi backend. Nilainya dikembalikan sebagai:

```json
{
  "bottleneck": true,
  "late": false,
  "violations": {
    "ACC Draft": { "label": "ACC Draft", "late": false },
    "Progress Design": { "label": "Progress Design", "late": true },
    "Approval Design": { "label": "Approval Design", "late": false },
    "Kirim Email": { "label": "Kirim Email", "late": false }
  }
}
```

Aturan aktual:

| Evaluasi | Kondisi terlambat |
| --- | --- |
| ACC Draft | Timestamp `ACC Draft` lebih dari 1 hari setelah `task_given_date` |
| Progress Design | Timestamp `Progress` lebih dari 1 hari setelah `ACC Draft` |
| Approval Design | Timestamp `Approve` minimal 2 hari setelah `Progress` |
| Kirim Email | Timestamp `Email` melewati tanggal deadline |
| Task terlambat | Jika `Email` ada: email melewati deadline. Jika belum ada: tanggal sekarang telah melewati deadline |
| Bottleneck | Ada pelanggaran pada ACC Draft, Progress Design, atau Approval Design; **Kirim Email bukan bottleneck** |

Perbandingan email dan deadline dilakukan pada level tanggal. Email pada tanggal deadline masih tepat waktu; email pada hari berikutnya terlambat.

### 5.2 Alasan keterlambatan

Saat berpindah ke `Progress Design`, `Approval Design`, atau `Kirim Email`, backend memeriksa tahap sebelumnya. Jika tahap sebelumnya sudah melanggar batas waktunya, `delay_reason` wajib dikirim. Nilainya disimpan ke:

```json
{
  "ACC Draft": {
    "reason": "Menunggu revisi materi dari vendor.",
    "recorded_at": "2026-07-19T14:30:00+07:00"
  }
}
```

## 6. API

Seluruh respons mengikuti envelope API aplikasi; data utama berada di `data`.

| Method & path | Permission | Fungsi |
| --- | --- | --- |
| `GET /kv-retail/tasks` | view | Daftar task sesuai scope user |
| `POST /kv-retail/tasks` | create | Membuat task, memindahkan temporary upload, sync assignee |
| `PATCH /kv-retail/tasks/{id}/title` | update-status | Mengubah judul |
| `PATCH /kv-retail/tasks/{id}/status` | update-status | Mengubah status, timestamp, link, dan alasan delay |
| `POST /kv-retail/tasks/{id}/files` | update-status | Upload support/draft file per slot indeks 0-2 |
| `DELETE /kv-retail/tasks/{id}` | delete | Menghapus task |
| `GET /kv-retail/assignees` | create atau settings-manage | Daftar user yang dapat di-assign, tanpa Root |
| `POST /kv-retail/uploads` | create | Temporary upload untuk form create |
| `GET /kv-retail/tasks/{id}/creative-agent` | view | Mengambil saran per task dan status freshness |
| `POST /kv-retail/tasks/{id}/creative-agent/generate` | update-status | Generate saran per task jika hash berubah |
| `GET /kv-retail/performance/creative-agent` | create | Mengambil laporan Creative Agent agregat; memvalidasi source hash saat dibaca |
| `POST /kv-retail/performance/ai-report` | create | Endpoint generation report lama/manual; pertahankan untuk kompatibilitas |

### 6.1 Mutasi status

Payload minimal:

```json
{ "status": "Progress Design" }
```

Payload dengan timestamp/alasan:

```json
{
  "status": "Approval Design",
  "task_timestamps": {
    "ACC Draft": "17/07/2026 10:00",
    "Progress": "18/07/2026 13:00"
  },
  "delay_reason": "Menunggu materi final."
}
```

Endpoint mengembalikan task tersimpan beserta `users` dan `timing_evaluation`. Respons ini adalah sumber kebenaran pertama bagi UI pengirim.

## 7. Realtime Pusher

### 7.1 Transport dan autentikasi

- Transport tunggal adalah **Pusher Channels**.
- Frontend memakai `pusher-js` melalui Core Echo client `src/core/realtime/client.ts` dengan `broadcaster: "pusher"`.
- Laravel hanya publisher backend ke Pusher; tidak menggunakan Reverb.
- Private channel diotorisasi melalui `POST {API_HOST}/broadcasting/auth` menggunakan cookie Sanctum dan CSRF token.
- Konfigurasi harus memiliki `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`, serta server-side Pusher app id/key/secret/cluster.

### 7.2 Channel dan event

Setiap user mendengarkan private channel:

```
App.Models.Core.User.{userId}
```

| Event Pusher | Payload | Pemicu |
| --- | --- | --- |
| `.kv-retail.task.assigned` | `{ task }` | Task baru dibuat dan assignee disinkronkan |
| `.kv-retail.task.updated` | `{ task }` | Status, judul, atau file berubah |
| `.kv-retail.task.deleted` | `{ task_id }` | Task dihapus |

Audience event mencakup assignee dan administrator yang berhak melihat daftar global: Root, Manajer, dan SPV. Dengan begitu semua halaman KV Retail milik audience yang berhak menerima data terbaru tanpa polling.

### 7.3 Strategi anti-bounce

`useKvRetailTasks` menyatukan tiga sumber state: optimistic update, respons PATCH, dan event Pusher.

1. Satu task memiliki pending token sehingga klik status berulang ditolak selama request berjalan.
2. UI menerapkan optimistic update terlebih dahulu.
3. Respons PATCH hanya di-merge bila belum ada versi event yang lebih baru.
4. Event Pusher selalu di-merge ke task yang sama.
5. Jika request gagal, rollback hanya dilakukan bila tidak ada versi lebih baru.

Hasilnya: respons HTTP lama tidak dapat menimpa event Pusher terbaru. Untuk dua user yang menyimpan task bersamaan, backend tetap menerapkan data yang tersimpan paling akhir; UI tidak boleh kembali ke snapshot lama.

## 8. Creative Agent

### 8.1 Saran per task

Card print/preview per task dapat memanggil saran Creative Agent. Data yang digunakan hanya ringkasan aman: status, deadline, flag terlambat, flag bottleneck, tahap aktif/selesai, dan pelanggaran tahap. Prompt meminta tepat tiga bullet tindakan spesifik task tanpa rekomendasi terhadap orang atau tim.

Cache disimpan per task selama 31 hari dengan source hash. Saran dianggap current hanya bila hash cache sama dengan hash data task sekarang. Tombol generate tidak mengirim ulang request Groq bila data ringkas belum berubah.

### 8.2 Laporan agregat Report

Creative Agent pada halaman Report menggunakan task dengan `task_given_date` di bulan berjalan. Data agregat mencakup:

- periode;
- total task, selesai, tepat waktu, terlambat, dalam proses;
- jumlah bottleneck per tahap;
- maksimal tiga task prioritas dengan isu ringkas.

`KvRetailCreativeAgentService` menggunakan cache laporan dan source hash global. Job `GenerateKvRetailCreativeAgentReport` tetap dijadwalkan saat task/pivot berubah. Endpoint `GET /performance/creative-agent` juga memvalidasi hash saat dibaca agar laporan tidak hanya bergantung pada worker queue yang aktif. Jika data ringkas tidak berubah, tidak ada request Groq baru.

Output Creative Agent hanya rekomendasi kumpulan task; tidak boleh berisi data mentah, evaluasi anggota/tim, pembagian beban kerja, atau chain-of-thought.

## 9. Report: sumber data dan indikator

Halaman Report membaca `GET /kv-retail/tasks`, lalu memfilter bulan berdasarkan `task_given_date`. Semua indikator menggunakan `timing_evaluation` backend bila tersedia dan fallback tanggal deadline di frontend hanya untuk kompatibilitas data lama.

| Bagian | Perhitungan |
| --- | --- |
| Total task | Jumlah task bulan berjalan |
| Selesai tepat waktu | `status === Done` dan tidak terlambat |
| Terlambat | `timing_evaluation.late === true` atau deadline telah lewat ketika email belum ada |
| Bottleneck | Ada violation terlambat pada tiga tahap non-email |
| Rata-rata selesai | Rata-rata hari dari `task_given_date` ke timestamp `Email`, hanya task Done dengan timestamp valid |
| Diagram performa | Perbandingan total task, tepat waktu, terlambat, bottleneck terhadap bulan lalu |
| Detail bottleneck | Jumlah pelanggaran per ACC Draft, Progress Design, Approval Design |
| Prioritas tindakan | Maksimal tiga task bulan ini yang terlambat atau bottleneck; berisi status dan tanggal aktual |
| Creative Agent | Cache/rekomendasi agregat bulan berjalan |

KPI dan Report menerima event Pusher yang sama dengan daftar task. Event `updated` dan `assigned` melakukan merge task; event `deleted` menghapus task dari state. Karena itu indikator berubah langsung tanpa reload.

## 10. UI dan komponen frontend

### 10.1 Desktop

Desktop menggunakan shell navbar, sidebar, dan content title bersama. Komponen Report terdapat di `features/kv-retail/components`:

| Komponen | Tanggung jawab |
| --- | --- |
| `TaskPage` | Composition daftar Hari ini/Belum selesai/Bulan ini |
| `PerformanceNavbar` | Navbar, utility dropdown, menu compact mobile |
| `PerformanceSidebar` | Navigasi Report, theme control sementara, collapse state |
| `PerformanceContentTitle` | Title, period, export |
| `PerformanceMetricCard` | KPI dan perubahan dibanding bulan lalu |
| `PerformanceChartIndicators` | Diagram, completion, distribusi, bottleneck, prioritas |
| `PerformanceSideSummary` | Total/rating/Creative Agent di sisi kanan desktop |
| `TaskCard` | Card task desktop dan mutasi workflow |
| `TaskPrintPreview` | Layout khusus tab print/download PNG |

State sidebar expand/collapse disimpan local storage dengan key `kv-retail.desktop-sidebar-expanded` agar tidak berubah saat pindah route.

### 10.2 Mobile

Mobile memakai `PerformanceNavbar` mode `compact`:

- hamburger menggantikan logo;
- breadcrumb serta back/next disembunyikan;
- menu hamburger berupa wheel scroll-snap teks;
- item pivot aktif membuka route setelah user berhenti scroll;
- task list memiliki area scroll tersendiri, scroll bar disembunyikan, dengan fade tipis sebagai indikator konten lanjutan;
- detail task memakai komponen final `TaskCardMobile` dan tetap memiliki token Light/Dark/Retro.

Pada mobile Report, section header tetap diam; hanya content area yang scroll. KPI, diagram, summary, bottleneck, Creative Agent, dan carousel prioritas semuanya menggunakan state task yang sama.

### 10.3 Print preview dan PNG task

Tombol preview pada task membuka `/kv-retail/print?task={id}` di tab baru. Halaman ini mengambil task dari daftar task yang berwenang dilihat user, lalu menampilkan layout fixed `403 × 632 px` yang mengikuti desain print KV Retail.

Fungsi yang tersedia:

| Kontrol | Perilaku |
| --- | --- |
| **Unduh PNG** | Mengubah node preview menjadi PNG melalui `html-to-image` (`toBlob`), rasio piksel 2, lalu download otomatis dengan nama task yang disanitasi |
| **Generate Agent** | Memanggil endpoint saran Creative Agent per task dan memperbarui tiga bullet saran pada preview |

Preview memuat saran yang sudah pernah dihasilkan saat halaman dibuka. Jika belum ada saran current, area Detail menunjukkan state belum tersedia sampai user memilih **Generate Agent**. Tahap tanpa timestamp pada task yang belum Done berwarna abu-abu; tahap aktif berwarna ungu dan tahap selesai berwarna hijau. Pelanggaran tahap berwarna merah.

### 10.3 Tema

Tiga tema aktif: `light`, `dark`, dan `retro`.

- **Light**: shell glass/panel biru, aksen sky blue.
- **Dark**: panel gelap, aksen hijau neon; seluruh text harus memenuhi kontras di atas background gelap.
- **Retro**: shell game-like dengan border gelap tebal dan block shadow.

Token visual dan batas implementasi telah dikunci di `docs/07_design_system/Pattern_KV_Retail_Performance_Themes.md`. Kontrak komponen desktop berada di `docs/07_design_system/Components_KV_Retail_Performance.md`.

## 11. Pengaturan CMS

Pengaturan KV Retail hanya boleh mengubah content, bukan sistem visual. Field content mencakup title per daftar task, empty state, teks form, teks overlay, dan label status. Warna, icon, spacing, serta token tema tidak boleh ditaruh sebagai CMS setting karena sudah menjadi kontrak design system.

## 12. Operasional dan troubleshooting

| Gejala | Cek pertama |
| --- | --- |
| Task tidak realtime | Browser memiliki `NEXT_PUBLIC_PUSHER_KEY`; request `/broadcasting/auth` sukses; server memiliki Pusher key/secret; channel private user terotorisasi |
| Task berubah lalu kembali | Cek request PATCH, payload event Pusher, dan merge state; jangan menambahkan refetch buta setelah PATCH |
| Report berbeda dari daftar | Bandingkan payload `GET /kv-retail/tasks`, filter `task_given_date`, status, `Email`, dan `timing_evaluation` |
| Creative Agent kosong | Cek permission create, endpoint Creative Agent, cache, source hash, konfigurasi Groq, dan log Laravel |
| Creative Agent tidak berubah | Pastikan data agregat bulan berjalan memang berubah; hash sengaja mencegah request ulang untuk data ringkas identik |
| Upload tidak tampil | Periksa storage path JSON, `FileStorageService`, slot file 0-2, dan event updated |

Jangan menganggap health check, lint, atau build sebagai verifikasi realtime. Untuk verifikasi runtime, buka dua sesi browser dengan user yang berhak, ubah satu task, lalu pastikan sesi lain menerima event Pusher dan Report berubah tanpa reload.

## 13. Validasi pengembangan

Jalankan dari folder yang sesuai:

```powershell
# apps/frontend
npx eslint src/features/kv-retail src/app/kv-retail
npx tsc --noEmit

# apps/backend
php artisan test --filter=KvRetail --stop-on-failure
```

Validasi browser dua sesi diperlukan untuk setiap perubahan pada channel, event name, authorizer, atau audience realtime.

## 14. File referensi utama

```text
apps/backend/routes/api/kv-retail.php
apps/backend/app/Http/Controllers/Api/KvRetail/TaskController.php
apps/backend/app/SubApps/KvRetail/Models/KvRetailTask.php
apps/backend/app/SubApps/KvRetail/Services/KvRetailTaskTimingService.php
apps/backend/app/SubApps/KvRetail/Services/KvRetailCreativeAgentService.php
apps/backend/app/SubApps/KvRetail/Events/KvRetailTaskAssigned.php
apps/backend/app/SubApps/KvRetail/Events/KvRetailTaskUpdated.php
apps/backend/app/SubApps/KvRetail/Events/KvRetailTaskDeleted.php
apps/frontend/src/features/kv-retail/api/index.ts
apps/frontend/src/features/kv-retail/hooks/use-kv-retail-tasks.ts
apps/frontend/src/features/kv-retail/components/task-page.tsx
apps/frontend/src/app/kv-retail/performance/page.tsx
apps/frontend/src/app/kv-retail/print/page.tsx
apps/frontend/src/features/kv-retail/components/task-print-preview.tsx
apps/frontend/src/core/realtime/client.ts
```
