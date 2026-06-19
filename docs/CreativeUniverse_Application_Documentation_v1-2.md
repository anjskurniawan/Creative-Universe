# Dokumentasi Teknis Master: Creative Universe v1.2

Dokumen ini merupakan panduan arsitektur, teknis, dan cetak biru kode utama untuk sistem **Creative Universe**, sebuah aplikasi hub berbasis web (Super-App) yang dikembangkan untuk divisi Creative PT. Doran Sukses Indonesia (JETE). Dokumen ini berfungsi sebagai referensi serah terima (handover) tingkat tinggi yang memetakan seluruh komponen sistem, logika bisnis, keamanan, alur kerja sub-aplikasi, kode file, detail fungsi, parameter, serta panduan pengembangan secara mandiri.

---

## 1. Arsitektur Global & Standardisasi Sistem

Creative Universe dirancang dengan arsitektur monolitik modular yang bersih. Sistem ini memisahkan logika bisnis inti (Core) dengan sub-aplikasi operasional secara struktural, namun tetap berbagi basis data dan sistem otentikasi yang sama.

### 1.1 Stack Teknologi Inti
Sistem dibangun di atas ekosistem Laravel modern dengan komponen sebagai berikut:
* **Framework Backend**: Laravel 11.x (PHP 8.2+)
* **Engine Frontend**: Livewire 3.x (termasuk Volt Single File Component untuk interaksi reaktif)
* **CSS Framework**: Tailwind CSS (dikompilasi secara lokal melalui Vite)
* **Interaktivitas Client**: AlpineJS (terintegrasi dengan Livewire)
* **Database**: MySQL 8.x atau MariaDB 10.x
* **Layanan Pihak Ketiga**: Pusher (Real-time Broadcasting) dan Fonnte (WhatsApp Gateway)

### 1.2 Struktur Folder dan Manajemen File
Demi menjaga kerapihan dan memudahkan pemeliharaan jangka panjang (arsip tingkat tinggi), struktur folder diatur secara modular:
* **Routing Modular**: Rute aplikasi tidak menumpuk di file `web.php` bawaan, melainkan dipisahkan ke dalam folder `routes/modules/`. File `web.php` hanya bertugas mengimpor rute-rute modul tersebut (misalnya `core.php` dan `pricetag.php`).
* **Namespace Terpisah**: Kode backend diorganisasikan di dalam namespace `App\Http\Controllers\Core` untuk sistem utama dan namespace terpisah seperti `App\Models\Pricetag` dan `App\Livewire\Pricetag` untuk sub-aplikasi.
* **Standardisasi Penamaan Database**: Setiap tabel yang dibuat oleh sub-aplikasi wajib menggunakan prefix unik (contoh: `pricetag_categories`, `pricetag_products`). Penamaan kolom audit kepemilikan (`created_by`, `updated_by`, `deleted_by`) dan kolom timestamps (`created_at`, `updated_at`, `deleted_at`) diseragamkan di seluruh tabel database.

---

## 2. Fitur Core (Master App)

Sistem Core menyediakan infrastruktur dasar seperti manajemen pengguna, autentikasi, otorisasi, pencatatan aktivitas, serta layanan komunikasi global.

### 2.1 Pendaftaran Akun & Alur Persetujuan (Approval)
Untuk mencegah akses tidak sah, sistem menerapkan alur registrasi terkontrol:
1. **Registrasi Awal**: Pengguna baru mendaftarkan diri melalui form registrasi standar dengan mengisi data diri serta kolom wajib `registration_note` (alasan pendaftaran).
2. **Status Akun Nonaktif**: Secara default, akun yang baru terdaftar memiliki kolom `is_active` bernilai `false`.
3. **Penyaringan Middleware**: Middleware `EnsureUserIsActive` akan mencegat setiap pengguna yang sudah login tetapi statusnya belum aktif, kemudian mengarahkannya ke halaman penangguhan (`/pending`).
4. **Persetujuan Admin**: Pengguna dengan hak akses `approve-users` (seperti manajer atau root) dapat melihat daftar pendaftaran tertunda melalui panel admin, lalu memberikan persetujuan (Approve) atau penolakan (Reject) untuk mengaktifkan akun tersebut.

### 2.2 Otorisasi Dinamis & RBAC (Role-Based Access Control)
Sistem menggunakan paket Spatie Laravel Permission yang dikembangkan menjadi sistem dinamis dengan pembagian wewenang yang aman:
* **Peran Sistem Bawaan**: Terdapat 7 peran default yang disediakan sejak inisialisasi yaitu Root, Manajer, Supervisor, Designer, Client, Retail Admin, dan Retail Staff. Peran ini memiliki seeder otomatis dengan pengguna default.
* **Manajemen Peran via UI**: Pengguna Root dapat membuat, mengubah, atau menghapus Role dan mengaitkannya dengan Permission tertentu secara langsung dari halaman antarmuka tanpa perlu melakukan seeding ulang database.
* **Invalidasi Cache Otomatis**: Setiap kali terjadi perubahan Role atau Permission pada sistem, cache izin dari Spatie dibersihkan secara instan untuk menjamin perubahan hak akses langsung diterapkan tanpa harus me-restart server.
* **Proteksi Role Vital**: Terdapat fitur pencegahan penghapusan peran krusial (seperti Root, Manajer, Supervisor, Designer, Client, Retail Admin, dan Retail Staff) atau peran yang masih memiliki pengguna aktif guna menjaga stabilitas otorisasi sistem.
* **Pembatasan Hapus Akun**: Untuk alasan keamanan, fitur penghapusan akun dinonaktifkan untuk semua peran kecuali peran Root. Pengguna non-Root yang mencoba menghapus akun akan ditolak dengan respons 403 Forbidden.
* **Manajemen Izin Bertingkat (Root & Manajer)**:
  * **Root**: Memiliki kendali penuh atas semua peran, pengguna, dan izin di aplikasi. Root dapat membuka panel konfigurasi "Atur Izin Manajer" untuk menetapkan daftar izin (whitelist) mana saja yang boleh didelegasikan oleh Manajer. Setelan ini disimpan pada kolom JSON `settings` di akun Root.
  * **Manajer**: Dapat mengubah otorisasi pengguna lain (selain pengguna Root), namun dibatasi hanya bisa menetapkan peran non-Root dan memberikan izin yang dimiliki oleh Manajer itu sendiri serta sudah masuk ke dalam daftar whitelist izin yang ditetapkan oleh Root.

### 2.3 Sesi Perangkat & Log Aktivitas (Security Module)
Sistem Core melacak jejak keamanan pengguna secara ketat:
* **Daftar Sesi Aktif**: Menggunakan driver session berbasis database (`sessions` table) untuk mendeteksi IP Address, User Agent (yang kemudian diparse menjadi OS dan Browser), serta waktu aktivitas terakhir dari seluruh perangkat yang login menggunakan akun terkait.
* **Pencabutan Sesi Jarak Jauh**: Pengguna dapat memutuskan sesi aktif perangkat lain secara langsung melalui menu pengaturan akun untuk mencegah potensi kebocoran data.
* **Log Audit Keamanan**: Perubahan sensitif pada akun (seperti penggantian password atau perubahan setelan peran) dicatat ke dalam tabel `activity_log` menggunakan sistem Spatie Activitylog dengan prefix log formal seperti `[PRICETAG]` atau `[CORE]`.

### 2.4 Real-Time Broadcasting & Notifikasi WhatsApp
Komunikasi interaktif di dalam aplikasi dikelola melalui dua kanal utama:
* **Broadcasting Real-Time**: Menggunakan Pusher Link (kompatibel dengan shared hosting tanpa membutuhkan server WebSocket mandiri). Ketika ada pendaftaran baru, perubahan status user, atau proses antrean selesai, server memicu event broadcasting melalui Pusher:
  * **Notification Channel (`App.Models.Core.User.{id}`)**: Mengirimkan notifikasi database reaktif yang didengarkan oleh komponen `NotificationBell` untuk memicu pembaruan lencana (badge) secara real-time.
  * **User Status Update Channel (`user-updates`)**: Saluran publik untuk menyebarkan sinyal reaktif ketika terjadi registrasi baru, persetujuan (approval), penolakan (rejection), penonaktifan, atau pengaktifan pengguna. Komponen `DashboardStats` dan `PendingUsers` mendengarkan saluran ini untuk melakukan pembaruan antarmuka secara instan tanpa menggunakan Livewire polling.
  * **Pricetag Batch Update Channel (`pricetag-updates`)**: Saluran publik yang memicu refresh daftar antrean pembuatan label harga saat proses latar belakang (queue job) selesai atau mengalami perubahan progress.
* **Notifikasi WhatsApp**: Menggunakan layanan WhatsApp Gateway Fonnte (`FonnteService`). Sistem mengirimkan pesan otomatis (OTP atau status pendaftaran) langsung ke nomor WhatsApp pengguna yang terdaftar dengan format internasional berkode negara 62.

### 2.5 Panel Pemeliharaan (Maintenance Panel)
Panel kontrol khusus bagi Root yang menyediakan kemampuan operasional penting:
* **Pengaturan Mode Pemeliharaan (Maintenance)**: Mengaktifkan atau menonaktifkan mode pemeliharaan sistem secara global.
* **Pemicu Command Artisan**: Menjalankan perintah artisan vital secara aman (seperti membersihkan cache, menjalankan migrasi database, atau merestart queue worker) melalui antarmuka web. Hal ini sangat berguna pada lingkungan shared hosting cPanel yang tidak menyediakan akses SSH.
* **Notifikasi Tes**: Mengirimkan notifikasi broadcast percobaan untuk memvalidasi apakah koneksi Pusher dan bel notifikasi berjalan dengan baik.

### 2.6 Dashboard & Pemantauan Sistem (Kapasitas Root)
Halaman dashboard disesuaikan secara dinamis berdasarkan peran pengguna untuk membatasi visualisasi data administratif:
* **Pengguna Standar / Staf**: Hanya dapat melihat ringkasan metrik mendasar seperti jumlah pengguna aktif sistem, total persetujuan registrasi tertunda (apabila memiliki hak akses terkait), dan daftar peran aktif yang disematkan pada akun mereka.
* **Pengguna Root**: Dashboard diperluas menjadi pusat kendali dan pengawasan sistem (system administrator monitoring panel) yang menampilkan:
  * **Status Sesi Aktif**: Menampilkan total sesi perangkat yang sedang login secara global di seluruh sistem.
  * **Kesehatan Antrean (Queue Health)**: Memantau jumlah pekerjaan antrean yang tertunda (pending jobs) dan pekerjaan yang gagal (failed jobs). Apabila terdeteksi adanya failed jobs, dashboard menampilkan peringatan berwarna Rose yang mencolok untuk memicu tindakan perbaikan segera.
  * **Detail Database**: Menampilkan jenis driver database (seperti MySQL atau SQLite) beserta estimasi ukuran penyimpanan database saat ini.
  * **Log Audit Keamanan Global (Mini Audit Trail)**: Menampilkan tabel real-time berisi 5 log aktivitas keamanan terbaru di sistem untuk mempermudah audit jejak tindakan pengguna lain.
  * **Informasi Lingkungan (System Environment)**: Menampilkan versi Laravel, PHP, tipe environment (Local/Production), serta status Debug Mode.
  * **Aksi Cepat Inti**: Pintasan langsung khusus untuk mengelola user (User Manager), mengelola role (Role Manager), dan mengakses panel pemeliharaan (Maintenance Panel).

---

## 3. Sub-App: Pricetag Generator

**Pricetag Generator** adalah sub-aplikasi yang digunakan untuk membuat gambar label harga promo atau diskon secara otomatis melalui integrasi dengan Google Slides dan Google Apps Script (GAS).

### 3.1 Alur Kerja Pencarian & Pembuatan (Generate)
Sub-aplikasi ini menyediakan dua opsi pembuatan berkas gambar:
1. **Single Generate (Pembuatan Tunggal)**:
   * Pengguna memilih kategori produk, nama produk, dan varian secara berjenjang (dropdown dinamis).
   * Nilai harga normal ditampilkan sebagai kolom readonly, sedangkan harga diskon diinput secara manual.
   * Sistem melakukan panggilan API sinkron ke Web App Google Apps Script (GAS) menggunakan kelas layanan `PricetagGeneratorService`.
   * GAS memproses template Google Slides, menghasilkan gambar label harga, menyimpannya di Google Drive, dan mengembalikan tautan hasil generate ke Laravel untuk disimpan di database.
2. **Multi Generate (Pembuatan Massal via CSV)**:
   * Pengguna mengunggah berkas CSV yang berisi daftar produk, varian, dan harga diskon.
   * Berkas divalidasi terlebih dahulu terhadap database produk yang ada.
   * Baris data yang valid dipecah menjadi beberapa bagian (Chunking) dengan ukuran **5 item per kelompok**.
   * Pemecahan ini krusial untuk menghindari batas waktu eksekusi skrip Google Apps Script (maksimal 6 menit) dan batas waktu eksekusi server shared hosting.

### 3.2 Sistem Antrean (Laravel Queue) & Progress Bar
Untuk memproses data massal tanpa membebani browser pengguna:
* **Job Queue**: Kelompok data (chunk) yang telah divalidasi didistribusikan ke dalam sistem antrean database melalui kelas `GeneratePricetagChunkJob`.
* **Proses Latar Belakang**: Worker antrean memproses satu per satu kelompok tersebut dengan mengirimkan permintaan ke API GAS secara berkala.
* **Visualisasi Progress**: Pengguna dapat memantau status pemrosesan secara real-time pada halaman Riwayat Generate. Halaman ini menggunakan fitur `wire:poll` pada Livewire untuk membaca jumlah item yang telah diproses (`processed_items`) pada tabel `pricetag_batches` dan menampilkannya dalam bentuk bilah kemajuan (Progress Bar) yang interaktif.

### 3.3 Penyimpanan Tautan Aset Secara Polymorphic
Hasil generate gambar pricetag berupa tautan Google Drive tidak disimpan secara langsung pada tabel produk atau tabel sub-aplikasi lainnya. Sistem menggunakan model polymorphic `AssetLink` yang berelasi ke tabel `asset_links` milik Core App:
* Relasi polymorphic menggunakan kolom `assetable_type` bernilai `App\Models\Pricetag\PricetagProduct` dan `assetable_id` bernilai ID produk yang bersangkutan.
* Cara ini memisahkan data operasional produk dengan berkas fisik digitalnya, mempermudah pelacakan aset secara tersentralisasi, serta memungkinkan perluasan penyimpanan di masa mendatang (misalnya migrasi dari Google Drive ke Amazon S3).

### 3.4 Manajemen Database Sub-App
Untuk mendukung operasional pencarian pricetag, sub-aplikasi menyediakan fitur pengelolaan data internal:
* CRUD data Master Kategori (`pricetag_categories`), Produk (`pricetag_products`), dan Varian.
* Pengunggahan berkas CSV untuk memperbarui harga produk secara massal (Bulk Update), yang secara otomatis mencatat riwayat perubahannya ke log audit.

---

## 4. Cetak Biru Kode (Code Blueprint) & Detail Fungsi

Bagian ini menyajikan dokumentasi teknis mendalam untuk setiap kelas kode utama, middleware, model, aksi bisnis, dan komponen Livewire dalam ekosistem Creative Universe. Dokumentasi ini disusun untuk memudahkan pemahaman fungsi individual secara mandiri.

### 4.1 Aksi Bisnis Utama (`app/Actions/Core`)

#### 4.1.1 `RegisterUserAction`
* **Lokasi File**: `app/Actions/Core/RegisterUserAction.php`
* **Tujuan**: Membuat akun pengguna baru dalam status tertangguh (pending approval).
* **Fungsi Utama**: `handle(RegisterForm $form): User`
  * **Parameter**: `RegisterForm $form` (Form object reaktif berisi input name, username, email, whatsapp_number, password, dan registration_note).
  * **Return Value**: `User` (Model pengguna baru).
  * **Alur Logika**:
    1. Membuat record baru di tabel `users` dengan `is_active` bernilai `false`.
    2. Melakukan enkripsi kata sandi menggunakan hashing default.
    3. Mengambil daftar pengguna aktif yang memiliki hak akses `approve-users`.
    4. Mengirimkan objek notification `UserRegisteredNotification` kepada seluruh admin penyaring tersebut.
    5. Mencatat event ke log aktivitas sistem beserta alamat IP pengirim.

#### 4.1.2 `ApproveUserAction`
* **Lokasi File**: `app/Actions/Core/ApproveUserAction.php`
* **Tujuan**: Menyetujui pendaftaran pengguna tertangguh dan mengaktifkan akunnya.
* **Fungsi Utama**: `handle(User $user, User $admin, string $roleName): void`
  * **Parameter**:
    * `User $user`: Model pengguna tertangguh yang akan disetujui.
    * `User $admin`: Model admin (pengguna login) yang melakukan persetujuan.
    * `string $roleName`: Nama peran sistem yang disematkan ke pengguna.
  * **Return Value**: `void`
  * **Alur Logika**:
    1. Mengubah status pengguna tertangguh dengan menyetel `is_active` menjadi `true`, mencatat kolom `approved_by` dengan ID admin, serta mengisi waktu persetujuan `approved_at`.
    2. Menetapkan hak akses peran kepada pengguna menggunakan method `assignRole` dari Spatie.
    3. Mengirimkan notifikasi keberhasilan aktivasi `AccountApprovedNotification` kepada pengguna terkait.
    4. Mencatat tindakan persetujuan ini ke log audit keamanan (`activity_log`) dan log sistem.

#### 4.1.3 `RejectUserAction`
* **Lokasi File**: `app/Actions/Core/RejectUserAction.php`
* **Tujuan**: Menolak pendaftaran pengguna tertangguh dan menghapus akunnya secara soft delete.
* **Fungsi Utama**: `handle(User $user, User $admin): void`
  * **Parameter**:
    * `User $user`: Model pengguna tertangguh yang ditolak.
    * `User $admin`: Model admin yang melakukan penolakan.
  * **Return Value**: `void`
  * **Alur Logika**:
    1. Mengirimkan notifikasi penolakan `AccountRejectedNotification` kepada email pendaftar.
    2. Menyetel kolom `deleted_by` pada model pengguna menjadi ID admin.
    3. Melakukan penghapusan data secara soft delete menggunakan method `delete()`.
    4. Mencatat log audit penolakan ke log audit keamanan.

#### 4.1.4 `CreateRoleAction`
* **Lokasi File**: `app/Actions/Core/CreateRoleAction.php`
* **Tujuan**: Membuat peran (role) sistem baru secara dinamis dari antarmuka pengguna.
* **Fungsi Utama**: `handle(RoleForm $form, User $admin): Role`
  * **Parameter**:
    * `RoleForm $form`: Form data yang berisi nama peran baru beserta array hak akses (permissions).
    * `User $admin`: Model admin yang membuat peran baru.
  * **Return Value**: `Role` (Model peran yang baru dibuat).
  * **Alur Logika**:
    1. Membuat record baru di tabel `roles` dengan nama peran dan guard `web`.
    2. Menyinkronkan daftar hak akses ke peran tersebut menggunakan method `syncPermissions`.
    3. Mengosongkan cache perizinan Spatie (`forgetCachedPermissions`) agar peran baru langsung aktif secara global.
    4. Mencatat aktivitas pembuatan peran ke log rbac.

#### 4.1.5 `DeleteRoleAction`
* **Lokasi File**: `app/Actions/Core/DeleteRoleAction.php`
* **Tujuan**: Menghapus peran dinamis yang tidak digunakan dari sistem secara aman.
* **Fungsi Utama**: `handle(Role $role, User $admin): void`
  * **Parameter**:
    * `Role $role`: Model peran yang ingin dihapus.
    * `User $admin`: Model admin yang melakukan penghapusan.
  * **Return Value**: `void`
  * **Aturan Pengamanan & Alur Logika**:
    1. Mengecek apakah peran tersebut termasuk dalam peran vital yang dilindungi (Root, Manajer, Supervisor, Designer, Client, Retail Admin, Retail Staff). Jika ya, sistem melempar `RuntimeException` dan membatalkan proses.
    2. Mengecek apakah peran tersebut masih terhubung dengan pengguna aktif. Jika ada minimal satu pengguna aktif yang menggunakan peran ini, proses dibatalkan dengan melempar `RuntimeException`.
    3. Menghapus data peran dari database.
    4. Membersihkan cache otorisasi secara instan dan mencatat riwayat penghapusan peran ke log audit.

#### 4.1.6 `UpdateRolePermissionsAction`
* **Lokasi File**: `app/Actions/Core/UpdateRolePermissionsAction.php`
* **Tujuan**: Mengubah daftar hak akses (permissions) yang dikaitkan dengan suatu peran dinamis.
* **Fungsi Utama**: `handle(Role $role, array $permissions, User $admin): void`
  * **Parameter**:
    * `Role $role`: Model peran yang diubah.
    * `array $permissions`: Daftar nama permission baru yang akan dipetakan.
    * `User $admin`: Model admin yang melakukan pengubahan.
  * **Return Value**: `void`
  * **Alur Logika**:
    1. Membaca daftar hak akses lama untuk keperluan pencatatan log.
    2. Menyinkronkan daftar hak akses baru menggunakan method `syncPermissions`.
    3. Menghapus cache otorisasi sistem dan menulis riwayat perubahan serta daftar perbedaan hak akses (lama vs baru) ke log audit.

---

### 4.2 Controller HTTP Utama (`app/Http/Controllers`)

#### 4.2.1 `ProfileController`
* **Lokasi File**: `app/Http/Controllers/ProfileController.php`
* **Tujuan**: Mengelola informasi profil pribadi, pengunggahan avatar, preferensi peran, serta sesi perangkat aktif pengguna.
* **Fungsi Utama**:
  * `edit(Request $request): View`
    * **Deskripsi**: Menampilkan halaman pengeditan akun.
    * **Logika**: Mengambil objek pengguna saat ini, membaca daftar sesi aktif dari tabel `sessions` berdasarkan ID pengguna, memuat 10 log aktivitas keamanan terakhir pengguna dari tabel `activity_log`, dan mengembalikan view `profile.edit`.
  * `update(ProfileUpdateRequest $request): RedirectResponse`
    * **Deskripsi**: Menyimpan data profil dasar, pengunggahan avatar baru, dan pengaturan tema tampilan.
    * **Logika**: Mengabaikan data avatar dan settings saat memproses isian dasar. Jika pengguna mengunggah berkas avatar baru, berkas lama dihapus dari disk publik sebelum berkas baru disimpan ke folder `avatars` pada disk `public`. Penggabungan (merge) setelan tema dan navbar dilakukan dengan array settings lama, kemudian pengguna menyimpan datanya.
  * `revokeSession(Request $request, string $sessionId): RedirectResponse`
    * **Deskripsi**: Menghapus paksa sesi login pada perangkat lain dari jarak jauh.
    * **Logika**: Menghapus baris record dengan ID sesi terkait yang dimiliki pengguna saat ini pada tabel database `sessions`.
  * `updateRoleSettings(Request $request): RedirectResponse`
    * **Deskripsi**: Menyimpan konfigurasi khusus yang disesuaikan dengan peran pengguna (Root, Manajer, Designer).
    * **Logika**: Menyaring setiap input yang masuk berdasarkan kemampuan otorisasi pengguna (`run-artisan`, `approve-users`, atau `access-pricetag`), melakukan penggabungan array settings, dan menyimpan perubahan tersebut ke database.
  * `destroy(Request $request): RedirectResponse`
    * **Deskripsi**: Menghapus akun pengguna saat ini secara permanen (atas permintaan pengguna sendiri, khusus untuk peran Root).
    * **Logika**: Memeriksa apakah pengguna memiliki peran Root (menolak dengan respons 403 jika bukan Root), memvalidasi kesesuaian password pengguna, melakukan proses logout, menghapus data pengguna secara soft delete, serta menonaktifkan sesi saat ini.

#### 4.2.2 `UserController`
* **Lokasi File**: `app/Http/Controllers/Core/UserController.php`
* **Tujuan**: Menangani pemrosesan halaman administrasi pengguna oleh admin/root.
* **Fungsi Utama**:
  * `index(): View`: Memuat daftar seluruh pengguna aktif sistem dengan relasi peran untuk ditampilkan dengan pagination 20 baris per halaman. Di dalamnya memuat Livewire Component `UserManager` untuk manajemen otorisasi pengguna secara dinamis.
  * `pending(): View`: Mengembalikan view halaman pengelolaan persetujuan pengguna baru.
  * `approve(Request $request, User $user, ApproveUserAction $action): RedirectResponse`: Memvalidasi input peran yang akan disematkan, memanggil kelas aksi `ApproveUserAction` untuk mengaktifkan pengguna, lalu mengembalikan redirect response dengan pesan sukses.
  * `reject(User $user, RejectUserAction $action): RedirectResponse`: Memanggil kelas aksi `RejectUserAction` untuk menolak dan menghapus secara soft-delete pendaftaran tertangguh.

---

### 4.3 Layanan Sistem (`app/Services`)

#### 4.3.1 `FonnteService`
* **Lokasi File**: `app/Services/Fonnte/FonnteService.php`
* **Tujuan**: Menyediakan fungsi pembungkus pengiriman notifikasi pesan teks dan OTP melalui WhatsApp Gateway Fonnte.
* **Fungsi Utama**: `sendWhatsAppNotification(string $target, string $message): bool`
  * **Parameter**:
    * `string $target`: Nomor WhatsApp tujuan (format angka internasional).
    * `string $message`: Isi pesan teks yang akan dikirim.
  * **Return Value**: `bool` (Menunjukkan status pengiriman berhasil/gagal berdasarkan status HTTP response dari API Fonnte).

#### 4.3.2 `PricetagGeneratorService`
* **Lokasi File**: `app/Services/GoogleAppScript/PricetagGeneratorService.php`
* **Tujuan**: Menangani integrasi sinkronisasi data dengan API eksternal Google Apps Script Web App untuk membuat berkas gambar pricetag di Google Drive.
* **Fungsi Utama**: `generate(PricetagProduct $product, int $userId, string $userName): bool`
  * **Parameter**:
    * `PricetagProduct $product`: Objek produk lengkap yang akan dicetak.
    * `int $userId`: ID pengguna yang memicu perintah pencetakan.
    * `string $userName`: Nama pengguna yang memicu perintah pencetakan.
  * **Return Value**: `bool` (Berhasil atau gagal).
  * **Detail Logika**:
    1. Membaca URL endpoint GAS dari database konfigurasi pengguna (atau fallback dari `.env`).
    2. Menyusun payload JSON berisi data produk, nama kategori, harga normal, harga diskon baru, dan nama file yang diformat ramah URL.
    3. Mengirimkan request POST menggunakan Laravel HTTP Client dengan toleransi kegagalan koneksi.
    4. Jika respons bernilai sukses (`status === 'success'`), sistem menghapus tautan berkas `AssetLink` lama milik produk terkait.
    5. Membuat tautan berkas baru bertipe `Google Drive View Link` dan `Google Drive Download Link` pada tabel `asset_links` menggunakan relasi polymorphic.

---

### 4.4 Middleware Custom (`app/Http/Middleware`)

#### 4.4.1 `ArtisanTokenMiddleware`
* **Lokasi File**: `app/Http/Middleware/ArtisanTokenMiddleware.php`
* **Tujuan**: Mengamankan rute eksekusi remote command Artisan pada shared hosting.
* **Logika**: Memeriksa keberadaan header HTTP `X-Artisan-Token` dan mencocokkannya secara ketat menggunakan metode anti-timing-attack `hash_equals` terhadap nilai konfigurasi `app.artisan_secret`. Sistem juga mencocokkan IP Address pemohon dengan nilai whitelist IP jika terkonfigurasi.

#### 4.4.2 `EnsureUserIsActive`
* **Lokasi File**: `app/Http/Middleware/EnsureUserIsActive.php`
* **Tujuan**: Mencegah akses sistem untuk akun yang berstatus nonaktif.
* **Logika**: Jika pengguna terotentikasi memiliki nilai `is_active` bernilai `false`, middleware secara otomatis mengarahkan akses ke rute penangguhan `/pending`.

#### 4.4.3 `EnsureUserCanAccessApp`
* **Lokasi File**: `app/Http/Middleware/EnsureUserCanAccessApp.php`
* **Tujuan**: Mencegah akses lintas modul/sub-aplikasi bagi pengguna yang tidak memiliki hak otorisasi spesifik.
* **Logika**: Memeriksa kepemilikan izin akses pengguna menggunakan method otorisasi `can('access-' . $app)` dari Spatie. Jika tidak memiliki hak akses, sistem mengembalikan kode respons 403 Forbidden.

---

### 4.5 Komponen Livewire Utama (`app/Livewire`)

#### 4.5.1 `Generator` (Pricetag Sub-App)
* **Lokasi File**: `app/Livewire/Pricetag/Generator.php`
* **Tujuan**: Menyediakan mesin antar-muka pembuatan gambar pricetag secara interaktif.
* **Fungsi Utama**:
  * `generateSingleWizard()`: Memvalidasi harga diskon baru untuk pembuatan tunggal (Single Generate) dan mengarahkan step alur ke status pemrosesan.
  * `processSingleGeneration(PricetagGeneratorService $generatorService)`: Memanggil layanan `PricetagGeneratorService` secara sinkron, membuat data riwayat batch pencetakan tunggal, dan mengarahkan pengguna ke halaman hasil download.
  * `generateChecklist()`: Memproses pembuatan berkas massal berbasis daftar pilihan produk dengan cara membuat record `PricetagBatch` dan membagi antrean data ke dalam queue pekerjaan dalam ukuran masing-masing 5 produk.
  * `generateBulk()`: Memproses pengunggahan berkas CSV untuk pencetakan massal, membaca separator (koma atau titik koma), memvalidasi kecocokan nama produk dan varian terhadap database, lalu membagi antrean pekerjaan pencetakan ke sistem queue database.

#### 4.5.2 `RoleManager` (Core App)
* **Lokasi File**: `app/Livewire/Core/RoleManager.php`
* **Tujuan**: Komponen antarmuka reaktif untuk membuat, mengedit, dan menghapus peran pengguna beserta hak aksesnya secara dinamis.
* **Fungsi Utama**:
  * `save()`: Menyimpan pembuatan peran baru atau memperbarui hak akses peran dinamis yang sudah ada menggunakan Action class terkait, lalu memicu invalidasi cache hak akses Spatie.
  * `deleteRole(int $roleId)`: Menghapus peran dinamis yang dipilih setelah memvalidasi aturan keamanan (proteksi peran inti dan ketiadaan pengguna aktif).

#### 4.5.3 `UserManager` (Core App)
* **Lokasi File**: `app/Livewire/Core/UserManager.php` & `resources/views/livewire/core/user-manager.blade.php`
* **Tujuan**: Komponen Livewire reaktif untuk mengelola otorisasi pengguna (Role dan Direct Permission).
* **Fungsi Utama**:
  * `render()`: Memuat daftar pengguna aktif sistem dengan optimalisasi *eager loading* untuk relasi `roles` dan `permissions` untuk mencegah masalah query N+1, lalu merender daftarnya ke tabel di mana izin langsung (direct permissions) ditampilkan dengan penanda khusus (tanda plus) di bawah daftar peran.
  * `openEditOtorisasi(int $userId)`: Membuka modal pengaturan otorisasi untuk pengguna tertentu. Jika pengakses adalah Manajer, sistem melarang pengeditan terhadap pengguna Root.
  * `saveOtorisasi()`: Menyimpan perubahan peran dan izin langsung ke database dengan melakukan pengecekan berlapis (Manajer dilarang memberikan peran Root, Manajer hanya dapat memberikan izin yang ia miliki dan terdaftar di whitelist izin Manajer).
  * `openKelolaAkun(int $userId)`: Membuka modal kelola akun. Khusus Root, sistem akan menampilkan data log aktivitas dan sesi perangkat aktif (IP & User Agent) dari database. Untuk Manajer, informasi audit tersebut disembunyikan. Manajer dilarang mengelola akun pengguna Root.
  * `saveKelolaAkun()`: Menyimpan status penonaktifan akun (aktif/suspend) atau mereset kata sandi baru. Jika akun dinonaktifkan (disuspend), seluruh sesi aktif perangkat pengguna tersebut akan dihapus secara paksa dari database agar langsung keluar (logout).
  * `openWhitelistModal()`: Khusus Root, membuka modal pengaturan whitelist untuk membatasi izin apa saja yang boleh didelegasikan oleh Manajer.
  * `saveWhitelist()`: Menyimpan setelan whitelist ke kolom JSON `settings` milik pengguna Root saat ini.

#### 4.5.4 `MaintenancePanel` (Core App)
* **Lokasi File**: `app/Livewire/Core/MaintenancePanel.php`
* **Tujuan**: Panel kontrol Root untuk mengelola mode pemeliharaan dan remote command Artisan.
* **Fungsi Utama**:
  * `toggleMaintenanceMode()`: Mengubah status pemeliharaan aplikasi secara global.
  * `runCommand(string $command)`: Menjalankan perintah artisan yang dipilih secara aman menggunakan pembungkus `Artisan::call` dan menangkap string log output untuk ditampilkan pada panel debugger UI.
  * `sendTestNotification()`: Memicu pengiriman notifikasi broadcast tes kepada pengguna aktif untuk memastikan kesiapan sistem Pusher.

#### 4.5.5 `DashboardStats`
* **Lokasi File**: `app/Livewire/Core/DashboardStats.php` & `resources/views/livewire/core/dashboard-stats.blade.php`
* **Tujuan**: Mengelola pemuatan dan pembaruan data statistik real-time pada dashboard utama secara instan menggunakan event broadcasting Pusher (tanpa polling).
* **Event Listeners**:
  * `user-status-updated`: Dipicu ketika ada pendaftaran, persetujuan, penolakan, atau suspend user.
  * `notification-received`: Dipicu ketika notifikasi baru diterima.
* **Fungsi Utama**:
  * `loadStats()`:
    * Membaca informasi dasar pengguna login untuk menghitung total user aktif.
    * Menguji hak akses peran `Root`. Jika pengguna adalah Root, metode ini melakukan query ke tabel `sessions`, `failed_jobs`, `jobs`, dan tabel `activity_log` (Spatie) untuk mengumpulkan metrik pengawasan sistem tingkat tinggi secara aman di sisi backend.
  * `getDatabaseSize()`: Mengambil path file database (SQLite) atau menghitung ukuran tabel schema (MySQL) untuk dikonversikan menjadi format satuan ukuran data yang mudah dibaca (KB/MB/GB).

#### 4.5.6 `PendingUsers`
* **Lokasi File**: `app/Livewire/Core/PendingUsers.php` & `resources/views/livewire/core/pending-users.blade.php`
* **Tujuan**: Mengelola halaman persetujuan pendaftaran akun baru secara real-time tanpa Livewire polling.
* **Fungsi Utama**:
  * `render()`: Memuat daftar pengguna tertangguh (`User::pending()`) menggunakan pagination.
  * `refreshPendingList()`: Dipicu secara reaktif oleh event `user-status-updated` atau `notification-received` dari Pusher untuk merestart pagination halaman ke awal agar admin dapat melihat pendaftaran baru yang masuk secara instan.

---

### 4.6 Antrean Pekerjaan (Job Queue)

#### 4.6.1 `GeneratePricetagChunkJob`
* **Lokasi File**: `app/Jobs/Pricetag/GeneratePricetagChunkJob.php`
* **Tujuan**: Memproses potongan antrean data pricetag (maksimal 5 item per job) di latar belakang secara asinkron.
* **Fungsi Utama**: `handle(PricetagGeneratorService $generatorService): void`
  * **Parameter**: `PricetagGeneratorService $generatorService` (Layanan pembuat berkas gambar).
  * **Logika Kerja**:
    1. Membaca data `PricetagBatch` berdasarkan ID. Jika status batch bernilai `failed`, proses dibatalkan.
    2. Mengubah status batch menjadi `processing`.
    3. Untuk setiap item produk dalam chunk, sistem memperbarui nilai `discount_price` pada model produk, lalu melakukan pemanggilan API ke GAS via service.
    4. Menyimpan atau memperbarui hasil status pemrosesan per produk pada tabel `pricetag_batch_items` (bernilai `success` atau `failed`).
    5. Menambah nilai kolom progress `processed_items` pada database batch terkait.
    6. Jika jumlah item yang diproses sudah mencapai total baris data yang seharusnya, status batch diperbarui secara otomatis menjadi `completed` atau `failed`.

---

### 4.7 Model & Skema Database Utama (`app/Models`)

#### 4.7.1 `User`
* **Lokasi File**: `app/Models/Core/User.php`
* **Fungsi Kunci**:
  * `getSetting(string $key, $default = null)`: Membaca setelan spesifik dari kolom JSON `settings` secara dinamis.
  * `setSetting(string $key, $value)`: Menyimpan atau memperbarui setelan secara instan pada kolom JSON `settings`.
  * `approvedBy()`: Relasi Many-to-One self-referencing kembali ke admin penanggung jawab persetujuan.
  * `assetLinks()`: Relasi One-to-Many ke tabel `asset_links` yang mendokumentasikan aset buatan pengguna tersebut.

#### 4.7.2 `AssetLink`
* **Lokasi File**: `app/Models/Core/AssetLink.php`
* **Fungsi Kunci**:
  * `linkable()`: Relasi polymorphic `MorphTo` yang memetakan aset ke tipe model mana pun (misalnya `PricetagProduct`).
  * `creator()`: Relasi Many-to-One ke pengguna pembuat aset.

#### 4.7.3 `PricetagProduct`
* **Lokasi File**: `app/Models/Pricetag/PricetagProduct.php`
* **Fungsi Kunci**:
  * `category()`: Relasi Many-to-One ke model kategori produk `PricetagCategory`.
  * `assetLinks()`: Relasi polymorphic `MorphMany` ke tabel tautan penyimpanan cloud `AssetLink` (untuk menyatukan link Drive).

---

## 5. Standar Keamanan & Deployment (Shared Hosting cPanel)

Aplikasi ini dioptimalkan agar dapat berjalan dengan aman dan berkinerja tinggi pada infrastruktur shared hosting cPanel yang memiliki keterbatasan akses sistem.

### 5.1 Pengamanan Remote Artisan Commands (Web Artisan)
Karena ketiadaan akses SSH pada sebagian besar shared hosting, sistem menyediakan rute khusus di `/routes/web_artisan.php` untuk menjalankan utilitas sistem. Rute-rute ini dilindungi secara berlapis:
* **Artisan Token Middleware**: Setiap permintaan ke endpoint `/_cmd/*` wajib menyertakan HTTP Header bernama `X-Artisan-Token` yang dicocokkan dengan nilai rahasia di file `.env`.
* **Whitelist IP Address**: Permintaan hanya akan dilayani jika berasal dari daftar IP yang diizinkan pada variabel `ARTISAN_ALLOWED_IPS`.
* Rute ini mendukung operasi kritis seperti migrasi database (`migrate --force`), pembersihan cache (`optimize:clear`), sinkronisasi izin (`db:seed`), dan pemicuan antrean pekerjaan (`queue:work --stop-when-empty`).

### 5.2 Optimasi Kinerja & Database Indexing
Untuk menjamin responsivitas aplikasi pada server dengan spesifikasi terbatas:
* **Database Indexing**: Indeks komposit unik diterapkan pada kolom pencarian produk seperti `['name', 'variant_name']` untuk mempercepat query relasi dan mencegah duplikasi data.
* **Pembatasan Batch**: Batas maksimum baris pencetakan per batch dibatasi (default: 100 baris) guna meminimalkan risiko server timeout ketika menghasilkan banyak berkas sekaligus.
* **Eager Loading**: Semua query data master di dalam Livewire menerapkan eager loading (contoh: `with(['category', 'assetLinks'])`) untuk menghindari masalah query N+1 yang dapat memperlambat pemuatan halaman.

---

## 6. Referensi File & Panduan Obsidian

Dokumen ini saling terhubung dengan berkas spesifikasi teknis dan desain database yang tersimpan di dalam repositori:
* **Spesifikasi Kebutuhan Sistem Inti**: [[docs/01_core_system/CreativeUniverse-MainApp_SRD.md|SRD Core System]]
* **Desain Basis Data Inti**: [[docs/01_core_system/CreativeUniverse-MainApp_ERD.md|ERD Core System]]
* **Spesifikasi Kebutuhan Generator Pricetag**: [[docs/02_pricetag_generator/CreativeUniverse-SubApp_PricetagGenerator_SRD.md|SRD Pricetag Generator]]
* **Desain Basis Data Generator Pricetag**: [[docs/02_pricetag_generator/CreativeUniverse-SubApp_PricetagGenerator_ERD.md|ERD Pricetag Generator]]
* **Dokumentasi API Google Apps Script**: [[docs/02_pricetag_generator/PricetagGenerator_GoogleAppScript.md|GAS Integration Guide]]
* **Panduan Operasional Generator Pricetag**: [[docs/02_pricetag_generator/pricetag_generator_V1_Documentation.md|Operational Guide v1.0]]

Dokumen master ini akan terus diperbarui seiring dengan penambahan fitur baru, perbaikan bug, maupun perubahan kebijakan teknis dalam ekosistem Creative Universe.
