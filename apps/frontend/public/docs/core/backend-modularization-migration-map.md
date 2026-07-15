# Backend Modularization Migration Map

## 1. Prinsip eksekusi

- Refactor dilakukan incremental, bukan rewrite.
- Data production dan data lokal dipertahankan.
- Endpoint lama tetap aktif selama compatibility window.
- Setiap batch harus dapat di-rollback secara terisolasi.
- Pemindahan namespace tidak boleh digabung dengan perubahan business rule.

## 2. Pemetaan domain saat ini

| Implementasi saat ini | Pemilik target | Catatan migrasi |
|---|---|---|
| Auth, User, Role, Profile, AppSetting | Core | Konsolidasikan tanpa mengubah kontrak terlebih dahulu |
| Conversation, Message, Notification | Core | Jadikan layanan bersama semua Sub-App |
| AssetLink dan upload umum | Core | Bedakan file service umum dari aturan file per Sub-App |
| HomeworkTask | KV Retail Task | Rename class, route, permission, dan tabel secara bertahap |
| CreativeReportAssessment/Group | Creative Report | Pindahkan ke namespace Sub-App sebelum fitur diperluas |
| Models/Services Odds | ODDS | Pertahankan business rule; rapikan HTTP boundary dan contract |
| Models/Services Pricetag | Generator / Pricetag | Pertahankan business rule; pindahkan sebagai generator di bawah Sub-App Generator |
| CreativeAiController/CAI GeminiService | Creative Artificial Intelligence (`cai`) | Terisolasi dan tetap eksperimen sampai domain aktif stabil |
| Design Assets frontend | Design Assets | Tetap eksperimen; backend baru dibuat jika scope bisnis disetujui |
| ChatController di `Api/V1` | Core | Selaraskan namespace dan response contract |

## 3. Urutan batch

### B0 - Baseline keamanan dan kualitas

- Backup environment lokal yang dibutuhkan.
- Lepaskan credential dari tracking Git.
- Tetapkan `composer test` sebagai perintah test backend.
- Pastikan Pint dan seluruh test lulus.

### B1 - Registry Sub-App dan metadata permission

- Tambahkan registry aplikasi di Core.
- Tambahkan metadata alias permission tanpa mengganti key aktif secara mendadak.
- Tambahkan level hierarki role.
- Uji bahwa akses aplikasi dan akses fitur merupakan dua lapisan terpisah.

### B2 - Pecah route berdasarkan domain

**Status: COMPLETED — 2026-07-14**

- Buat `routes/api/*.php`.
- Pindahkan deklarasi route tanpa mengubah URI atau middleware.
- Bandingkan `route:list` sebelum dan sesudah.

Hasil implementasi: `routes/api.php` hanya menjadi loader untuk `core.php`,
`kv-retail.php`, `creative-report.php`, `odds.php`, `generator.php`, `cai.php`,
dan `design-assets.php`. Snapshot berisi 148 route; hasil akhir berisi 146 route.
Satu-satunya selisih adalah dua alias `/pricetag-categories/*` yang sengaja
diarsipkan karena tidak memiliki consumer aktif.

Keputusan cutover:

- alias `/api/v1/pricetag-categories/*` dihapus pada B2 karena tidak lagi memiliki consumer aktif;
- `/api/v1/homework-tasks/*` tetap aktif sampai B3 karena masih menjadi kontrak berjalan KV Retail Task;
- `/api/v1/pricetag/*` tetap aktif sampai B6 karena masih menjadi kontrak berjalan Generator/Pricetag;
- B3 dan B6 memakai atomic cutover: route, frontend consumer, test, dan dokumentasi berpindah sekaligus ke URI kanonis tanpa compatibility window;
- setelah atomic cutover tervalidasi, deklarasi route lama dipindahkan ke `backup`, bukan disimpan dalam struktur aktif.

### B3 - Modularisasi KV Retail Task

**Status: COMPLETED — 2026-07-14**

- Namespace domain menggunakan `SubApps/KvRetail` dengan model `KvRetailTask`, service `KvRetailTaskTimingService`, dan event bernama `KvRetailTask*`.
- HTTP boundary menggunakan `Api/KvRetail/TaskController`.
- Endpoint kanonis: `/api/v1/kv-retail/tasks`, `/api/v1/kv-retail/assignees`, `/api/v1/kv-retail/uploads`, dan `/api/v1/kv-retail/tasks/{task}/files`.
- Frontend kanonis menggunakan `/kv-retail` beserta child route-nya.
- Endpoint `/api/v1/homework-tasks/*`, `/api/v1/temp-upload`, dan page route `/task/*` dihentikan melalui atomic cutover tanpa compatibility alias.
- Migration rename mempertahankan data dari `homework_tasks` ke `kv_retail_tasks`, pivot ke `kv_retail_task_user`, dan foreign key pivot ke `kv_retail_task_id`.
- Migration historis yang masih memakai nama lama dipertahankan karena diperlukan untuk membangun database dari nol sebelum migration rename dijalankan.
- Verifikasi jumlah record, pivot, file path, timestamp, delay reason, dan ownership sebelum menghapus nama lama.

### B4 - Modularisasi Creative Report

**Status: COMPLETED — 2026-07-14**

- Model menggunakan namespace `SubApps/CreativeReport/Models` dengan nama `Assessment` dan `ReportGroup`; nama tabel tetap `creative_report_*` karena sudah kanonis.
- HTTP boundary menggunakan `Api/CreativeReport/AssessmentController` dan prefix kanonis tetap `/api/v1/creative-reports`.
- Validasi dipindahkan ke `IndexAssessmentRequest` dan `UpdateAssessmentRequest`.
- Representasi JSON dipindahkan ke `AssessmentResource`.
- Perubahan draft/completed dipindahkan ke `AssessmentService`.
- `AssessmentPolicy` mempertahankan akses operasional yang berlaku untuk Root, Manajer, dan SPV tanpa mengubah rumus penilaian.

### B5 - Modularisasi ODDS

**Status: COMPLETED — 2026-07-14**

- Seluruh tabel `odds_*` dipertahankan tanpa rename atau perubahan workflow.
- Model dan service dipindahkan ke namespace `SubApps/Odds`.
- Seluruh validasi mutation dipindahkan dari controller ke Form Request pada `Http/Requests/Odds`.
- `TaskResource` menjadi awal standardisasi response boundary dan `TaskPolicy` mengelola akses task berdasarkan record.
- `OddsTaskReader` mengekspos `OddsTaskSummary` sebagai kontrak baca publik tanpa membocorkan model internal.
- Belum ada sinkronisasi otomatis ke Creative Report; integrasi bisnis menunggu aturan tertulis dan persetujuan produk.

### B5.5 - Standardisasi Core File Storage

**Status: FOUNDATION ACTIVE — 2026-07-14**

- Production shared hosting cPanel menggunakan strategi local-first melalui disk Laravel.
- Implementasi tetap cloud-ready melalui konfigurasi disk S3-compatible.
- File fisik memakai ULID dan extension tervalidasi; nama asli hanya disimpan sebagai metadata serta nama unduhan.
- Metadata terpusat berada di tabel `stored_files`, termasuk context, visibility, MIME, ukuran, checksum SHA-256, dan uploader.
- Struktur path mengikuti `{application}/{context_type}/{context_id}/{category}/{ulid}.{extension}`.
- Avatar dan upload baru KV Retail memakai `FileStorageService`.
- File lama tetap dapat dibaca dan akan dimigrasikan bertahap setelah inventory serta checksum tervalidasi.
- Mayoritas file menggunakan visibility public; file sensitif dapat memilih private tanpa mengubah controller.

### B6 - Modularisasi Generator dan Pricetag

**Status: COMPLETED — 2026-07-14**

- Generator menjadi Sub-App induk dan Pricetag menjadi generator pertama di `App\SubApps\Generator\Pricetag`.
- API kanonis memakai `/api/v1/generator/pricetag/*`; route lama `/api/v1/pricetag/*` tidak dipertahankan.
- Web kanonis memakai `/generator/pricetag`, dengan child route `/catalog`, `/search`, dan `/history`.
- Tabel `pricetag_*` diubah menjadi `generator_pricetag_*` melalui migration reversible yang mempertahankan data.
- Model, event, job, service, controller, request, dan resource telah ditempatkan sesuai ownership Generator/Pricetag.
- Permission key lama tetap dipertahankan sebagai identifier internal agar hak akses yang sudah tersimpan tidak rusak; label UI dapat tetap ramah pengguna.
- Arsip ZIP sementara menggunakan storage private terstruktur dan nama fisik ULID; nama unduhan tetap deskriptif bagi pengguna.
- Cutover dilakukan secara atomik pada backend, frontend, test, dan dokumentasi tanpa compatibility alias.

### B7 - Aplikasi eksperimen

**Status: COMPLETED — 2026-07-15**

- Nama UI menggunakan Creative AI, sedangkan backend memakai key dan ownership namespace `cai`/`Cai`.
- Route web kanonis Creative AI adalah `/creative-ai`; endpoint kanonisnya `/api/v1/cai/chat`.
- `CreativeAiController`, `CreativeAiChatRequest`, dan CAI `GeminiService` telah ditempatkan sesuai ownership-nya.
- Assets Design telah diganti menjadi Design Assets dengan route web `/design-assets`; route API `/api/v1/design-assets` tetap berupa placeholder kosong.
- Creative AI dan Design Assets tetap berstatus `experimental` dalam application registry.
- Business rule dan akses Creative AI tidak diperluas; permission `access-core` dipertahankan sementara sampai rancangan permission eksperimen disetujui.
- Cutover URL dilakukan langsung tanpa compatibility alias.

### B8 - Standardisasi Core dan kontrak API

**Status: COMPLETED — 2026-07-15**

- Endpoint JSON memakai envelope `success`, `message`, `data`, serta `meta` atau `errors` bila diperlukan; download dan stream dikecualikan.
- Controller Chat dan Notification, event MessageSent, NotificationResource, serta listener auth activity telah ditempatkan pada namespace Core.
- Model `Conversation`, `Message`, `StoredFile`, dan `AssetLink` tetap menjadi model bersama milik Core.
- `ConversationPolicy`, `StoredFilePolicy`, dan `AssetLinkPolicy` menyediakan authorization berbasis record.
- Core mengakses konteks ODDS melalui `OddsTaskReader` dan `OddsConversationPresenter`, bukan query langsung dari controller ke model ODDS.
- Consumer frontend Chat telah diselaraskan dengan response envelope standar tanpa mengubah URL publik.
- Kontrak publik Core didokumentasikan pada `docs/03_backend_api/Core_Public_Contracts.md` dan tersedia pada webpage Documentation.

### B9 - Cleanup

**Status: COMPLETED — 2026-07-15**

- Controller Breeze/web yang tidak terdaftar dan konfigurasi Reverb dipindahkan ke `backup/b9-unused-backend`.
- Namespace dan direktori kosong lama telah dibersihkan; tidak ada compatibility alias route lama.
- Dependency `laravel/reverb`, `doctrine/dbal`, dan `laravel/breeze` telah dihapus beserta dependency transitif yang tidak lagi dibutuhkan.
- Guzzle dan PSR-7 diperbarui untuk menutup advisory yang memiliki patch kompatibel.
- Upgrade Laravel 11 ke Laravel 12 dicatat sebagai pekerjaan security terpisah karena merupakan major upgrade.
- API Route Map, ERD aktif, keputusan Pusher, dan runbook deployment cPanel telah diperbarui.

## 4. Strategi rename data KV Retail Task

Rename dilakukan dalam migration terpisah dari pemindahan namespace.

Urutan aman:

1. backup database dan catat jumlah record;
2. rename tabel utama dan pivot;
3. rename foreign key/index bila nama database mengharuskan;
4. perbarui `$table` model dan relasi;
5. jalankan migration pada salinan database;
6. bandingkan jumlah record dan relasi;
7. jalankan `composer test`;
8. baru jalankan pada target deployment yang disetujui.

Migration `down()` wajib mengembalikan nama tabel lama tanpa menghapus record.

## 5. Stop condition

Hentikan batch apabila:

- test baseline gagal;
- jumlah record berubah setelah rename;
- permission pengguna meluas tanpa persetujuan;
- endpoint lama hilang sebelum compatibility window selesai;
- sebuah keputusan integrasi lintas Sub-App belum memiliki business rule tertulis.
