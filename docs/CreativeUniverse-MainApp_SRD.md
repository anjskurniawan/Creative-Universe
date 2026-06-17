---
tags:
    - project/creative-universe
    - master-document
    - laravel-11
    - livewire-3
    - architecture
    - enterprise
status: "🔒 LOCKED"
version: "6.3 (Real-Time Notifications & Dynamic RBAC)"
created: 2026-06-14
revised: 2026-06-16
locked: 2026-06-16
owner: Divisi Creative — PT Doran Sukses Indonesia (JETE)
supersedes: "v6.2 (2026-06-15)"
changelog:
    - "v6.1: Auth package ditetapkan → Laravel Breeze + Laravel Socialite (SSO Google)"
    - "v6.1: WhatsApp API ditetapkan → Fonnte (api.fonnte.com)"
    - "v6.1: Livewire pin versi → ^3.6 (Volt SFC tersedia di v3.x)"
    - "v6.1: Cloud link storage ditetapkan → tabel relasi polymorphic `asset_links`"
    - "v6.1: Staging environment dihapus → hanya Local dan Production"
    - "v6.1: Role ditetapkan bersifat universal lintas Sub-App"
    - "v6.1: Fitur dasar Shared Hosting diasumsikan tersedia"
    - "v6.1: Mekanisme audit Login/Logout via Laravel Auth Event Listener"
    - "v6.1: IP Address pada audit trail via Spatie custom properties"
    - "v6.1: Data retention scheduler didefinisikan per Command class"
    - "v6.1: db:seed production diarahkan ke RolePermissionSeeder (idempotent)"
    - "v6.1: Skema tabel asset_links ditambahkan di Seksi 7"
    - "v6.1: Skema kolom ownership diwajibkan eksplisit di tabel users"
    - "v6.1: Fonnte custom notification channel class didefinisikan di Seksi 11"
    - "v6.1: Queue worker cPanel via Cron Job didefinisikan di Seksi 11"
    - "v6.1: RolePermissionSeeder idempotent didefinisikan di Seksi 6"
    - "v6.1: Seluruh Open Questions dari audit v6.0 diselesaikan"
    - "v6.1 LOCKED: Scope Seksi 16 dikecilkan — skema domain entity didelegasikan ke SRD per Sub-App"
    - "v6.2 EMERGENCY: SSO Google dihapus total — laravel/socialite dan socialiteproviders/google dikeluarkan dari stack"
    - "v6.2 EMERGENCY: Kolom google_id dihapus dari skema tabel users"
    - "v6.2 EMERGENCY: Kolom password dikembalikan NOT NULL (tidak ada lagi akun SSO-only)"
    - "v6.2 EMERGENCY: is_active default diubah false — semua akun baru wajib approval admin"
    - "v6.2 EMERGENCY: Alur registrasi self-register + approval admin didefinisikan eksplisit"
    - "v6.2 EMERGENCY: Kolom registration_note ditambahkan ke tabel users"
    - "v6.2 EMERGENCY: Permission approve-users ditambahkan ke matrix"
    - "v6.2 EMERGENCY: Tiga Notification class approval didefinisikan di Seksi 11"
    - "v6.2 EMERGENCY: Seksi 8 ditambah sub-seksi alur registrasi & approval"
    - "v6.2 EMERGENCY: Index google_id dihapus dari Seksi 10"
    - "v6.2 EMERGENCY: Referensi SSO dihapus dari Seksi 12, 15, 18"
    - "v6.2 EMERGENCY: .env.example dibersihkan dari entri Google"
    - "v6.2 EMERGENCY: Audit Requirement Matrix diperbarui — tambah aksi Approve/Reject Akun"
    - "v6.3: Sistem notifikasi in-app diubah dari Livewire polling ke Pusher (Laravel Broadcasting + Laravel Echo)"
    - "v6.3: `pusher/pusher-php-server` ditambahkan ke PHP dependencies; `laravel-echo` dan `pusher-js` ditambahkan ke NPM dependencies (dikompilasi lokal)"
    - "v6.3: Klarifikasi eksplisit: Pusher adalah cloud SaaS — server hanya membuat HTTP call ke Pusher API, tidak membutuhkan WebSocket server sendiri, sepenuhnya kompatibel dengan Shared Hosting"
    - "v6.3: `BROADCAST_CONNECTION`, `PUSHER_APP_ID/KEY/SECRET/CLUSTER`, dan `VITE_PUSHER_APP_KEY/CLUSTER` ditambahkan ke .env.example (Seksi 8.4)"
    - "v6.3: Seksi 11 direstrukturisasi — Seksi 11.2 baru ditambahkan untuk Pusher Broadcasting Setup"
    - "v6.3: Seksi 11.1 ditulis ulang — NotificationBell tidak lagi menggunakan wire:poll, diganti Livewire + Laravel Echo listener"
    - "v6.3: Seksi 11.5 dan 11.6 diperbarui — semua Notification class menambahkan channel `broadcast` dan method `toBroadcast()`"
    - "v6.3: `routes/channels.php` didefinisikan eksplisit di Seksi 11.2 untuk otorisasi Pusher private channel"
    - "v6.3: RBAC diubah ke pola Dynamic — Superadmin dapat membuat, mengubah, dan menghapus Role via UI tanpa menyentuh seeder"
    - "v6.3: Seksi 6.2 diperbarui — prinsip Role diperluas dengan dukungan dynamic role creation"
    - "v6.3: Seksi 6.3 di-reframe sebagai Initial Default State, bukan fixed matrix permanen"
    - "v6.3: Seksi 6.4 RolePermissionSeeder diperbarui — seeder tidak me-reset role dinamis yang dibuat via UI; hanya me-sync tiga role inti"
    - "v6.3: Seksi 6.5 (Dynamic Role Management) ditambahkan — aturan lengkap pengelolaan role via UI termasuk protected roles, cache invalidation, dan tiga Action Class baru"
    - "v6.3: Seksi 10.2 diperbarui — tambah aturan wajib cache invalidation Spatie setiap kali Role/Permission diubah"
    - "v6.3: Seksi 15.1 diperbarui — tambah dua baris debug untuk masalah Pusher dan bell notification"
    - "v6.3: Seksi 16.3 Audit Requirement Matrix diperbarui — tambah aksi Create/Update/Delete Role"
---

# CreativeUniverse-MainApp_SRD

> [!info] Sifat Dokumen
> Dokumen ini adalah **Master Technical Blueprint** yang mengatur standar arsitektur global, keamanan, struktur database inti, dan aturan penulisan kode _(Best Practices)_. Seluruh aturan di sini **WAJIB** dipatuhi oleh semua developer dan Sub-App yang bernaung di bawah ekosistem Creative Universe.

Creative Universe adalah aplikasi hub berbasis website (Desktop & Mobile Responsive) yang menjadi rumah utama _(Super-App)_ bagi seluruh sub-aplikasi internal divisi Creative PT. Doran Sukses Indonesia (JETE).

---

## Daftar Isi

1. [[#1. Tujuan & Filosofi Dokumen]]
2. [[#2. Tech Stack & Spesifikasi Server]]
3. [[#3. Arsitektur Monolith & Struktur Sub-App]]
4. [[#4. Konvensi Kode & Naming Standards]]
5. [[#5. Standar Arsitektur Kode (Livewire Volt)]]
6. [[#6. Database Inti, RBAC & Role-Permission Matrix]]
7. [[#7. Strategi Penyimpanan Hybrid]]
8. [[#8. Security Standards & Auth Flow]]
9. [[#9. Error Handling & Validasi Global]]
10. [[#10. Kinerja, Caching & Database Indexing]]
11. [[#11. Notifikasi & Audit Trail]]
12. [[#12. Testing Strategy]]
13. [[#13. Deployment & cPanel Workarounds]]
14. [[#14. UI/UX Standards & Loading States]]
15. [[#15. Panduan Debug & Developer Workflow]]
16. [[#16. Core Domain Model & Data Ownership]]
17. [[#17. Data Lifecycle, Backup & Disaster Recovery]]
18. [[#18. Environment, API & Future Integration Standards]]

---

## 1. Tujuan & Filosofi Dokumen

### 1.1 Prinsip Dasar Arsitektur

- **Consistency over cleverness** : Satu cara melakukan sesuatu, dipakai di seluruh codebase.
- **Explicit over implicit** : Tidak ada _magic_ yang tidak terdokumentasi.
- **Debuggability first** : Setiap keputusan arsitektural mempertimbangkan kemudahan debugging.
- **Shared Hosting constraint-aware** : Setiap solusi teknis harus bisa berjalan tanpa SSH/Terminal.
- **Security by default** : Setiap celah yang ditemukan diselesaikan sebelum development berlanjut.

---

## 2. Tech Stack & Spesifikasi Server

Aplikasi dibangun di atas ekosistem modern TALL Stack dengan batasan _environment_ Shared Hosting.

| Komponen               | Spesifikasi                                                |
| ---------------------- | ---------------------------------------------------------- |
| Bahasa Pemrograman     | PHP 8.2                                                    |
| Framework Utama        | Laravel 11                                                 |
| Frontend Engine        | Livewire `^3.6` — Volt SFC Architecture                    |
| Styling                | Tailwind CSS v4, dikompilasi via Vite (lokal)              |
| Database               | MySQL 8.0+                                                 |
| Package Auth           | Laravel Breeze (Blade stack)                               |
| Package RBAC           | `spatie/laravel-permission`                                |
| Package Activity Log   | `spatie/laravel-activitylog`                               |
| Package Log Viewer     | `opcodesio/log-viewer`                                     |
| WhatsApp API           | Fonnte (`api.fonnte.com`)                                  |
| Broadcasting Driver    | Pusher (`api.pusherapp.com`) — `pusher/pusher-php-server`  |
| NPM Dependencies       | `laravel-echo`, `pusher-js` — dikompilasi via Vite (lokal) |
| Queue Driver           | Database (cPanel compatible)                               |
| Environment Production | Shared Hosting cPanel — **TANPA akses SSH/Terminal**       |

> [!danger] LARANGAN KERAS
> Jangan menggunakan Node.js, Redis, atau fitur apapun yang membutuhkan akses terminal di production. Seluruh kompilasi asset (`npm run build`) **hanya** dilakukan di environment lokal sebelum di-upload.

> [!info] Pusher Kompatibel dengan Shared Hosting
> Pusher adalah layanan WebSocket **cloud SaaS** — bukan server yang harus dijalankan sendiri. Kompatibilitasnya dengan Shared Hosting terjamin karena:
>
> - **Server-side**: `pusher/pusher-php-server` hanya membuat HTTP POST ke `api.pusherapp.com` dari dalam PHP process (queue job). Tidak ada persistent process, tidak butuh SSH.
> - **Client-side**: `pusher-js` dan `laravel-echo` dikompilasi oleh Vite di lokal, lalu di-upload sebagai file statis ke `public/build/`. Browser user yang terhubung ke `ws.pusherapp.com` — tidak ada keterlibatan server production dalam koneksi WebSocket ini.

> [!danger] SSO Google Dihapus Permanen
> `laravel/socialite` dan `socialiteproviders/google` **TIDAK** masuk ke dalam project ini dalam bentuk apapun. Jangan install, jangan referensikan, jangan rencanakan penggunaannya tanpa membuka versi SRD baru dengan audit keamanan terlebih dahulu. Keputusan ini final per v6.2.

> [!warning] Catatan Versi Livewire
> SRD ini menggunakan Livewire `^3.6`. Volt SFC (Single File Component) tersedia sejak Livewire v3. Jangan upgrade ke versi major baru tanpa audit breaking change terlebih dahulu dan pembaruan SRD ini.

> [!info] Catatan Auth Package
> Laravel Breeze digunakan dengan **Blade stack** (bukan Livewire stack Breeze) agar tidak konflik dengan pola Volt SFC yang dikelola manual. Breeze menyediakan scaffolding untuk Login, Register, Forgot Password, dan Reset Password. Alur Register dimodifikasi untuk kebutuhan approval — lihat [[#8.2 Alur Registrasi & Approval Akun|Seksi 8.2]].

---

## 3. Arsitektur Monolith & Struktur Sub-App

Seluruh Sub-App berjalan dalam **SATU codebase Laravel yang sama**. Pemisahan dilakukan secara struktural dan sistematis menggunakan PHP Namespace dan folder hierarchy, bukan multi-repo atau microservice.

> [!info] Keputusan Arsitektural
> Monolith dengan pemisahan namespace adalah pilihan yang tepat untuk tim kecil dengan constraint cPanel. Seluruh Sub-App share satu database, satu auth system, dan satu deployment pipeline.

### 3.1 Struktur Folder Sub-App

Setiap Sub-App memiliki namespace dan folder tersendiri, terisolasi penuh dari Sub-App lain.

```
app/
├── Http/
│   └── Controllers/
│       ├── Core/              # Controller milik Master App
│       ├── Odds/              # Controller milik Sub-App ODDS
│       └── [SubAppName]/      # Controller milik Sub-App lain
├── Livewire/
│   ├── Core/
│   ├── Odds/
│   └── [SubAppName]/
├── Actions/
│   ├── Core/
│   ├── Odds/
│   └── [SubAppName]/
├── Services/                  # Service Class untuk integrasi eksternal
│   ├── Fonnte/
│   └── [IntegrationName]/
└── Models/
    ├── Core/                  # Model shared (User, Role, AssetLink)
    ├── Odds/                  # Model spesifik ODDS
    └── [SubAppName]/

resources/views/
├── components/                # Blade Components shared
├── livewire/
│   ├── core/
│   ├── odds/
│   └── [sub-app-name]/
└── pages/
    ├── core/
    ├── odds/
    └── [sub-app-name]/

routes/
├── web.php                    # Entry point, load semua route file
├── web_artisan.php            # Remote artisan commands
├── channels.php               # Pusher private channel authorization
└── modules/
    ├── core.php               # Route Master App
    ├── odds.php               # Route Sub-App ODDS
    └── [sub-app].php          # Route Sub-App lain
```

> [!info] Folder `Services/`
> Folder `app/Services/` digunakan **khusus** untuk integrasi layanan eksternal (Fonnte WhatsApp API, dll.). Jangan tempatkan logika bisnis domain di sini — itu milik `app/Actions/`. Lihat [[#18. Environment, API & Future Integration Standards|Seksi 18.4]] untuk aturan lengkap.

### 3.2 Aturan Route per Sub-App

Setiap Sub-App memiliki route prefix dan middleware group tersendiri. File `web.php` hanya bertugas menginclude semua file route modul.

```php
// routes/web.php
require __DIR__.'/modules/core.php';
require __DIR__.'/modules/odds.php';
// tambahkan baris baru per Sub-App baru
```

```php
// routes/modules/odds.php
Route::prefix('odds')
    ->middleware(['auth', 'verified-active', 'app:odds'])
    ->name('odds.')
    ->group(function () {
        Route::resource('tickets', Odds\TicketController::class);
    });
```

> [!info] Middleware `verified-active`
> Seluruh route yang membutuhkan autentikasi menggunakan middleware `verified-active` (bukan hanya `auth`). Middleware ini memastikan user sudah login DAN `is_active = true`. User yang sudah login namun belum diapprove (`is_active = false`) akan diredirect ke halaman `/pending`. Lihat [[#8.3 Middleware EnsureUserIsActive|Seksi 8.3]].

### 3.3 Middleware Penjaga Sub-App

Buat custom middleware `EnsureUserCanAccessApp` yang membaca permission `access-[app-slug]` dari Spatie. Ini mencegah user mengakses Sub-App yang tidak berhak mereka masuki.

```php
// app/Http/Middleware/EnsureUserCanAccessApp.php
public function handle(Request $request, Closure $next, string $app): Response
{
    if (!auth()->user()->can('access-'.$app)) {
        abort(403, 'Kamu tidak memiliki akses ke aplikasi ini.');
    }
    return $next($request);
}
```

### 3.4 Cara Debug Tertuju ke Sub-App yang Tepat

Karena ini monolith, semua log masuk ke satu file `laravel.log`. Gunakan pola **Context Logging wajib** di setiap Sub-App agar log bisa difilter:

```php
// Wajib di setiap Action Class / Controller Sub-App
use Illuminate\Support\Facades\Log;

Log::info('[ODDS] Ticket created', [
    'ticket_id' => $ticket->id,
    'user_id'   => auth()->id(),
]);
```

> [!warning] Konvensi Prefix Log
> Setiap log entry **WAJIB** diawali dengan prefix nama Sub-App dalam kurung siku: `[CORE]`, `[ODDS]`, `[NAMA-APP]`. Dengan ini, filtering di Log Viewer cukup menggunakan keyword prefix.

Untuk error kritis yang perlu dimonitor terpisah, daftarkan channel log per Sub-App di `config/logging.php`:

```php
// config/logging.php
'channels' => [
    'odds' => [
        'driver' => 'single',
        'path'   => storage_path('logs/odds.log'),
        'level'  => 'debug',
    ],
],
```

Gunakan `Log::channel('odds')->error()` untuk error kritis yang perlu file log tersendiri. Gunakan `Log::info('[ODDS] ...')` untuk logging rutin yang cukup masuk ke `laravel.log` utama. Kedua pendekatan ini tidak bertentangan: channel terpisah adalah **opt-in** untuk error kritis, bukan pengganti prefix logging rutin.

---

## 4. Konvensi Kode & Naming Standards

Konsistensi naming adalah fondasi codebase yang bisa dibaca dan di-debug dengan cepat oleh siapapun. Seluruh konvensi di bawah bersifat **WAJIB**.

| Elemen             | Konvensi                 | Contoh Benar                | Contoh Salah            |
| ------------------ | ------------------------ | --------------------------- | ----------------------- |
| File Blade         | `kebab-case`             | `ticket-card.blade.php`     | `TicketCard.blade.php`  |
| Livewire Component | `PascalCase`             | `CreateTicket.php`          | `create-ticket.php`     |
| Action Class       | `PascalCase` + `Action`  | `CreateTicketAction.php`    | `TicketCreate.php`      |
| Service Class      | `PascalCase` + `Service` | `FonnteService.php`         | `FonnteHelper.php`      |
| Form Object        | `PascalCase` + `Form`    | `TicketForm.php`            | `TicketFormClass.php`   |
| Model              | `PascalCase Singular`    | `Ticket.php`                | `Tickets.php`           |
| Kolom DB           | `snake_case`             | `assigned_to`, `created_by` | `assignedTo`, `usr_id`  |
| Route Name         | `modul.resource.action`  | `odds.tickets.store`        | `store_ticket`          |
| Livewire Event     | `kebab-case`             | `ticket-approved`           | `ticketApproved`        |
| CSS Class          | Tailwind utility only    | `class="flex items-center"` | `class="myCustomClass"` |
| JS Function        | `camelCase`              | `handleSubmit()`            | `handle_submit()`       |

### 4.1 Aturan Namespace PHP

- **Core App:** `App\Http\Controllers\Core\`, `App\Models\Core\`
- **ODDS:** `App\Http\Controllers\Odds\`, `App\Models\Odds\`, `App\Actions\Odds\`
- **Services:** `App\Services\Fonnte\`, `App\Services\[IntegrationName]\`
- **Sub-App baru:** gunakan nama PascalCase dari slug app — contoh: `App\Models\DesignReview\`

---

## 5. Standar Arsitektur Kode (Livewire Volt)

### 5.1 Manajemen Input & Validasi — Form Objects

> [!danger] LARANGAN KERAS
> Dilarang mendeklarasikan variabel form (`$title`, `$body`, `$status`) langsung di dalam blok `<?php ?>` komponen SFC Volt. Semua form field dan rules **WAJIB** dipisah ke Form Object di `app/Livewire/Forms/[SubApp]/`.

```php
// app/Livewire/Forms/Odds/TicketForm.php
namespace App\Livewire\Forms\Odds;
use Livewire\Form;

class TicketForm extends Form
{
    public string $title       = '';
    public string $description = '';
    public string $priority    = 'normal';

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'priority'    => 'required|in:low,normal,high,urgent',
        ];
    }
}
```

### 5.2 Pola Volt SFC yang Benar

Volt SFC hanya boleh berisi: `state`, `computed`, `mount`, dan method pemanggil Action. **Tidak ada logika bisnis di dalam SFC.**

```php
<?php
use function Livewire\Volt\{state, computed, mount, form};
use App\Livewire\Forms\Odds\TicketForm;
use App\Actions\Odds\CreateTicketAction;

form(TicketForm::class);

computed(fn() => cache()->remember('priorities', 3600, fn() => Priority::all()));

$save = function (CreateTicketAction $action) {
    $this->form->validate();
    $ticket = $action->handle($this->form, auth()->user());
    $this->dispatch('ticket-created', ticketId: $ticket->id);
    session()->flash('success', 'Tiket berhasil dibuat.');
};
?>
```

### 5.3 Ekstraksi Logika Bisnis — Action Classes

Jika sebuah fungsi mengandung lebih dari **10 baris logika eksekusi** (tidak menghitung baris komentar, baris kosong, dan deklarasi tipe) atau menyentuh lebih dari **1 tabel database**, WAJIB diekstrak ke Action Class di `app/Actions/[SubApp]/`.

```php
// app/Actions/Odds/CreateTicketAction.php
namespace App\Actions\Odds;

class CreateTicketAction
{
    public function handle(TicketForm $form, User $user): Ticket
    {
        $ticket = Ticket::create([...]);
        $ticket->assignTo($user);
        activity()->log('[ODDS] Ticket created: '.$ticket->id);
        return $ticket;
    }
}
```

### 5.4 Pembatasan Query — Model Scopes

> [!danger] LARANGAN
> Dilarang menulis query builder berantai langsung di komponen Livewire atau file Blade. Semua logika filter dan query wajib dipindah ke **Local Scope** di file Model.

```php
// app/Models/Odds/Ticket.php — BENAR
public function scopeOpenByUser($query, int $userId): Builder
{
    return $query->where('status', 'open')->where('assigned_to', $userId);
}

// Di SFC Volt — BENAR
computed(fn() => Ticket::openByUser(auth()->id())->latest()->paginate(20));

// Di SFC Volt — SALAH
computed(fn() => Ticket::where('status','open')->where('assigned_to', auth()->id())->get());
```

### 5.5 Dekomposisi UI — Blade Components

Elemen visual yang berulang (Modal, Card, Badge, Alert, Button) **WAJIB** dipisah ke `resources/views/components/`.

- **Shared (lintas Sub-App):** `resources/views/components/` → prefix `<x-modal>`, `<x-badge>`
- **Spesifik Sub-App:** `resources/views/components/odds/` → prefix `<x-odds.ticket-card>`

---

## 6. Database Inti, RBAC & Role-Permission Matrix

### 6.1 Skema Tabel `users`

Tabel ini wajib mendukung `SoftDeletes` — kebijakan data abadi, data karyawan resign tidak pernah dihapus permanen.

| Kolom                       | Tipe        | Constraint                | Keterangan                                                                            |
| --------------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `id`                        | BigInt      | PK, Auto Increment        | Primary key                                                                           |
| `name`                      | String(255) | NOT NULL, index           | Nama lengkap karyawan                                                                 |
| `username`                  | String(100) | UNIQUE, NOT NULL          | Kredensial login utama                                                                |
| `email`                     | String(255) | UNIQUE, NOT NULL          | Kredensial login                                                                      |
| `whatsapp_number`           | String(20)  | Nullable                  | Format: `628xxxx` untuk notifikasi Fonnte                                             |
| `password`                  | String(255) | NOT NULL                  | Bcrypt hashed. Wajib diisi saat registrasi                                            |
| `is_active`                 | Boolean     | Default: **false**, index | `false` = pending approval. `true` = akun aktif dan dapat login penuh                 |
| `registration_note`         | Text        | Nullable                  | Catatan dari pendaftar saat registrasi — membantu admin mengenali identitas pendaftar |
| `approved_by`               | BigInt      | Nullable, FK → users.id   | Superadmin yang menyetujui akun ini                                                   |
| `approved_at`               | Timestamp   | Nullable                  | Waktu approval                                                                        |
| `avatar_path`               | String(500) | Nullable                  | UUID-based filename, max 2MB                                                          |
| `created_by`                | BigInt      | Nullable, FK → users.id   | Nullable karena registrasi mandiri tidak memiliki `created_by`                        |
| `updated_by`                | BigInt      | Nullable, FK → users.id   | User yang terakhir mengubah data ini                                                  |
| `deleted_by`                | BigInt      | Nullable, FK → users.id   | User yang melakukan soft delete                                                       |
| `deleted_at`                | Timestamp   | Nullable                  | SoftDeletes field                                                                     |
| `created_at` / `updated_at` | Timestamp   | Auto                      | Laravel timestamps                                                                    |

> [!danger] Perubahan Kritis dari v6.1
>
> - Kolom `google_id` **dihapus** — SSO Google tidak ada di ekosistem ini.
> - Kolom `password` **NOT NULL** — tidak ada lagi akun tanpa password.
> - Kolom `is_active` **default: false** — semua akun baru masuk sebagai pending, tidak bisa login ke Sub-App sampai diapprove Superadmin.
> - Kolom `registration_note`, `approved_by`, `approved_at` **ditambahkan** untuk mendukung alur approval.

> [!warning] Kebijakan Penamaan File Avatar
> File avatar **WAJIB** di-rename saat upload menggunakan `Storage::putFile()` yang auto-generate UUID filename. Format: `{uuid}.{ext}`. Jangan pakai nama asli file dari user karena rentan path traversal dan naming collision.

> [!info] Kolom `created_by` Nullable pada `users`
> Kolom `created_by` di tabel `users` bersifat Nullable sebagai pengecualian dari aturan ownership global. Alasannya: user yang mendaftar sendiri (self-register) tidak memiliki `created_by`. Kolom ini terisi hanya jika akun dibuat manual oleh Superadmin.

### 6.2 Strategi RBAC — Spatie Permission

Sistem menolak penggunaan kolom statis `role` pada tabel `users`. Role dan Permission dikelola dinamis melalui Spatie.

> [!success] Prinsip Role Universal & Scalable
> Role bersifat **universal dan tidak di-scope per Sub-App**. Satu Role berlaku di seluruh ekosistem Creative Universe. Pembatasan akses per Sub-App dikendalikan oleh **Permission** (bukan Role), menggunakan konvensi prefix `access-[app-slug]` dan `[app].[resource].[action]`.
>
> Sistem RBAC dirancang **scalable** — tiga role default (Superadmin, Manajer, Desainer) adalah titik awal, bukan batas. Superadmin dapat membuat role baru dan mengelola permission-nya sepenuhnya via UI tanpa menyentuh seeder atau kode. Skema tabel Spatie tidak berubah saat role baru ditambahkan — semua operasi dilakukan di application layer.

> [!info] Akun Pending dan Role
> User yang baru mendaftar (is_active = false / pending) **tidak memiliki Role apapun**. Role diberikan oleh Superadmin bersamaan dengan atau setelah proses approval. Sebelum Role diberikan, user hanya bisa mengakses halaman `/pending` dan `/profile`.

> [!warning] Cache Spatie — Aturan Kritis
> Spatie Permission menggunakan cache internal untuk menyimpan data Role dan Permission demi performa. Setiap kali Role atau Permission diubah — baik via seeder maupun via UI — cache **WAJIB** di-reset secara eksplisit. Lihat [[#6.5 Dynamic Role Management|Seksi 6.5]] untuk detail.

### 6.3 Role-Permission Matrix — Initial Default State

> [!note] Konteks Tabel Ini
> Tabel di bawah adalah **Initial Default State** yang di-seed saat inisialisasi pertama. Di production, role dan permission aktual dapat berbeda karena Superadmin telah mengelolanya via UI. Tabel ini mendefinisikan _minimum yang harus ada_, bukan _batas maksimum_ yang membekukan sistem.

> [!note] Single Source of Truth untuk Seed Awal
> Tabel ini adalah acuan untuk `RolePermissionSeeder`. Setiap permission inti yang ditambahkan via seeder **WAJIB** didokumentasikan di sini. Permission dari Sub-App baru juga wajib ditambahkan ke sini sebelum di-deploy.

| Permission Slug        | Superadmin | Manajer | Desainer | Keterangan                                 |
| ---------------------- | :--------: | :-----: | :------: | ------------------------------------------ |
| `access-core`          |     ✅     |   ✅    |    ✅    | Akses ke Master App (dashboard)            |
| `access-odds`          |     ✅     |   ✅    |    ✅    | Akses ke Sub-App ODDS                      |
| `manage-users`         |     ✅     |   ❌    |    ❌    | CRUD user & assign role                    |
| `manage-roles`         |     ✅     |   ❌    |    ❌    | Buat, edit, & hapus Role/Permission via UI |
| `approve-users`        |     ✅     |   ❌    |    ❌    | Approve / reject akun pending              |
| `odds.tickets.create`  |     ✅     |   ✅    |    ✅    | Buat tiket baru di ODDS                    |
| `odds.tickets.assign`  |     ✅     |   ✅    |    ❌    | Assign tiket ke desainer                   |
| `odds.tickets.approve` |     ✅     |   ✅    |    ❌    | Approve / reject output                    |
| `odds.tickets.delete`  |     ✅     |   ❌    |    ❌    | Hapus tiket (soft delete)                  |
| `odds.reports.view`    |     ✅     |   ✅    |    ❌    | Lihat laporan & analytics                  |
| `view-logs`            |     ✅     |   ❌    |    ❌    | Akses Log Viewer                           |
| `run-artisan`          |     ✅     |   ❌    |    ❌    | Trigger Web Artisan Routes                 |

> [!info] Aturan Permission Naming
> Format slug: `[app-prefix].[resource].[action]` untuk permission spesifik Sub-App. Permission lintas app menggunakan format tanpa prefix: `manage-users`, `approve-users`, `view-logs`.

### 6.4 RolePermissionSeeder — Pola Idempotent untuk Initial Seed

> [!danger] Aturan Seeder Production
> Seeder yang dijalankan di production **WAJIB** menggunakan `RolePermissionSeeder` yang terpisah dari `DatabaseSeeder`. Seeder ini harus bersifat **idempotent** — aman dijalankan berulang kali tanpa menduplikasi data.

> [!warning] Seeder vs UI Management
> `RolePermissionSeeder` hanya bertanggung jawab untuk **tiga role inti** (Superadmin, Manajer, Desainer) dan seluruh permission default. Role tambahan yang dibuat Superadmin via UI **tidak tersentuh** oleh seeder. Menjalankan seeder ulang akan me-reset permission tiga role inti ke default-nya, namun tidak akan menghapus role dinamis maupun permission yang sudah ada di database.

```php
// database/seeders/RolePermissionSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    // Daftar permission inti yang dikelola seeder.
    // Permission Sub-App baru WAJIB ditambahkan ke sini saat Sub-App baru di-deploy.
    private array $corePermissions = [
        'access-core', 'access-odds',
        'manage-users', 'manage-roles', 'approve-users',
        'odds.tickets.create', 'odds.tickets.assign',
        'odds.tickets.approve', 'odds.tickets.delete',
        'odds.reports.view', 'view-logs', 'run-artisan',
    ];

    public function run(): void
    {
        // Reset cache Spatie sebelum operasi
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Step 1: Buat semua permission — firstOrCreate menjamin idempotent.
        // Permission yang sudah ada tidak akan terduplikasi atau dihapus.
        foreach ($this->corePermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Step 2: Buat tiga role inti — firstOrCreate menjamin idempotent.
        $superadmin = Role::firstOrCreate(['name' => 'Superadmin']);
        $manajer    = Role::firstOrCreate(['name' => 'Manajer']);
        $desainer   = Role::firstOrCreate(['name' => 'Desainer']);

        // Step 3: Sync permission ke tiga role inti.
        // CATATAN: syncPermissions menimpa assignment permission yang ada pada role-role ini.
        // Role dinamis yang dibuat via UI tidak disentuh — seeder hanya mengelola tiga role di bawah.
        $superadmin->syncPermissions($this->corePermissions);
        $manajer->syncPermissions([
            'access-core', 'access-odds',
            'odds.tickets.create', 'odds.tickets.assign',
            'odds.tickets.approve', 'odds.reports.view',
        ]);
        $desainer->syncPermissions([
            'access-core', 'access-odds',
            'odds.tickets.create',
        ]);

        // Reset cache Spatie setelah operasi selesai
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
```

> [!warning] Cara Menjalankan di Production
> Gunakan Web Artisan Route: `GET /_cmd/seed-permissions`. Route ini memanggil `db:seed --class=RolePermissionSeeder --force`, bukan `DatabaseSeeder`. `DatabaseSeeder` hanya dijalankan sekali saat inisialisasi pertama di environment Local.

### 6.5 Dynamic Role Management — Pengelolaan Role via UI

> [!info] Tujuan
> Seksi ini mendefinisikan standar untuk mengelola Role dan Permission secara dinamis melalui antarmuka admin, tanpa menyentuh seeder atau codebase. Ini adalah mekanisme utama untuk menambah role baru seiring berkembangnya organisasi.

#### Prinsip Dynamic RBAC

1. Skema tabel Spatie (`roles`, `permissions`, `model_has_roles`, `role_has_permissions`) **tidak pernah berubah** saat role baru ditambahkan — semua operasi di application layer.
2. Permission baru yang di-deploy via seeder (Sub-App baru) dapat langsung di-assign ke role lama maupun baru via UI.
3. Role yang dibuat via UI tidak terpengaruh saat `RolePermissionSeeder` dijalankan ulang.
4. Hanya user dengan permission `manage-roles` yang dapat membuat, mengubah, atau menghapus Role.

#### Aturan Penamaan & Validasi Role Dinamis

| Aturan   | Keterangan                                                                |
| -------- | ------------------------------------------------------------------------- |
| Format   | Title Case — contoh: `Koordinator`, `Kepala Tim`, `Kontributor Eksternal` |
| Panjang  | Maksimum 100 karakter                                                     |
| Karakter | Huruf, angka, dan spasi — tidak boleh ada karakter khusus                 |
| Keunikan | Nama role harus unik — dijaga oleh UNIQUE constraint di tabel `roles`     |
| Guard    | Selalu `web` — tidak ada guard lain di ekosistem ini                      |

#### Role yang Dilindungi (Protected Roles)

Tiga role inti di bawah **tidak boleh dihapus** dalam kondisi apapun. Proteksi ini diberlakukan di level Action Class, bukan level database.

```php
// Daftar protected roles — tidak boleh dihapus via UI
const PROTECTED_ROLES = ['Superadmin', 'Manajer', 'Desainer'];
```

#### Cache Invalidation — WAJIB di Setiap Perubahan Role/Permission

> [!danger] Aturan Kritis
> Setiap Action Class yang mengubah Role atau Permission **WAJIB** memanggil reset cache Spatie di akhir eksekusinya. Tanpa ini, perubahan tidak akan terdeteksi oleh sistem permission check sampai cache kedaluwarsa secara natural — menyebabkan bug akses yang sulit di-debug.

```php
// Wajib dipanggil di akhir setiap Action yang mengubah Role atau Permission:
app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
```

#### Action Classes untuk Role Management

```php
// app/Actions/Core/CreateRoleAction.php
namespace App\Actions\Core;

use Spatie\Permission\Models\Role;
use App\Models\Core\User;
use App\Livewire\Forms\Core\RoleForm;

class CreateRoleAction
{
    public function handle(RoleForm $form, User $admin): Role
    {
        $role = Role::create(['name' => $form->name, 'guard_name' => 'web']);

        if (!empty($form->permissions)) {
            $role->syncPermissions($form->permissions);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        activity('rbac')
            ->causedBy($admin)
            ->performedOn($role)
            ->withProperties([
                'role_name'   => $role->name,
                'permissions' => $form->permissions,
                'ip'          => request()->ip(),
            ])
            ->log('[CORE] New role created: ' . $role->name);

        return $role;
    }
}
```

```php
// app/Actions/Core/UpdateRolePermissionsAction.php
namespace App\Actions\Core;

use Spatie\Permission\Models\Role;
use App\Models\Core\User;

class UpdateRolePermissionsAction
{
    public function handle(Role $role, array $permissions, User $admin): void
    {
        $oldPermissions = $role->permissions->pluck('name')->toArray();
        $role->syncPermissions($permissions);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        activity('rbac')
            ->causedBy($admin)
            ->performedOn($role)
            ->withProperties([
                'old' => $oldPermissions,
                'new' => $permissions,
                'ip'  => request()->ip(),
            ])
            ->log('[CORE] Role permissions updated: ' . $role->name);
    }
}
```

```php
// app/Actions/Core/DeleteRoleAction.php
namespace App\Actions\Core;

use Spatie\Permission\Models\Role;
use App\Models\Core\User;

class DeleteRoleAction
{
    private const PROTECTED_ROLES = ['Superadmin', 'Manajer', 'Desainer'];

    public function handle(Role $role, User $admin): void
    {
        if (in_array($role->name, self::PROTECTED_ROLES)) {
            throw new \RuntimeException(
                "Role '{$role->name}' adalah role inti yang dilindungi dan tidak dapat dihapus."
            );
        }

        $activeUserCount = $role->users()->where('is_active', true)->count();
        if ($activeUserCount > 0) {
            throw new \RuntimeException(
                "Role '{$role->name}' masih memiliki {$activeUserCount} user aktif. "
                . "Pindahkan semua user ke role lain sebelum menghapus."
            );
        }

        $roleName = $role->name;
        $role->delete(); // Hard delete — Role tidak menggunakan SoftDeletes

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        activity('rbac')
            ->causedBy($admin)
            ->withProperties(['deleted_role' => $roleName, 'ip' => request()->ip()])
            ->log('[CORE] Role deleted: ' . $roleName);
    }
}
```

#### Audit Trail untuk Perubahan Role

Seluruh operasi CRUD pada Role dan Permission via UI wajib masuk ke audit trail dengan `log_name = 'rbac'`. Lihat [[#16.3 Audit Requirement Matrix|Seksi 16.3]].

---

## 7. Strategi Penyimpanan Hybrid

| Lapisan Storage                      | Penggunaan & Aturan                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Local System (Kantor)**            | Source code master, file PSD/AI/Raw Video. Tidak pernah diupload ke cPanel.                           |
| **cPanel Server**                    | Avatar karyawan (max 2MB), thumbnail preview desain (max 2MB), PDF brief. WAJIB validasi MIME + size. |
| **Cloud Link (Tabel `asset_links`)** | File besar (video, ZIP, drive folder). App menyimpan metadata URL — bukan file-nya.                   |

### 7.1 Aturan Upload File ke cPanel

1. Semua file yang diupload ke cPanel **WAJIB** melalui `Storage::putFile()` — auto UUID naming.
2. Wajib validasi MIME type di setiap form upload: `'mimes:jpg,jpeg,png,pdf'`
3. Wajib validasi ukuran maksimum: `'max:2048'` (2MB dalam kilobytes)
4. Jangan pernah expose path storage asli ke user — gunakan signed URL atau route proxy.
5. Wajib implementasi `storage:link` via Web Artisan Routes untuk symlink `public/storage`.

### 7.2 Skema Tabel `asset_links` (Cloud Link Storage)

Tabel ini menyimpan referensi URL ke file eksternal yang di-host di cloud storage manapun. Satu entitas (Task, Project, Ticket, dll.) dapat memiliki banyak cloud link dari berbagai provider.

| Kolom                       | Tipe        | Constraint              | Keterangan                                                       |
| --------------------------- | ----------- | ----------------------- | ---------------------------------------------------------------- |
| `id`                        | BigInt      | PK, Auto Increment      | Primary key                                                      |
| `linkable_type`             | String(255) | NOT NULL, index         | Polymorphic type (e.g., `App\Models\Odds\Ticket`)                |
| `linkable_id`               | BigInt      | NOT NULL, index         | Polymorphic ID — ID entitas terkait                              |
| `provider`                  | Enum        | NOT NULL                | Nilai: `google_drive`, `dropbox`, `onedrive`, `youtube`, `other` |
| `label`                     | String(255) | NOT NULL                | Nama tampilan link (e.g., "File Revisi Final v3")                |
| `url`                       | Text        | NOT NULL                | URL lengkap ke resource cloud                                    |
| `created_by`                | BigInt      | NOT NULL, FK → users.id | User yang menambahkan link ini                                   |
| `updated_by`                | BigInt      | Nullable, FK → users.id | User yang terakhir mengubah                                      |
| `deleted_by`                | BigInt      | Nullable, FK → users.id | User yang menghapus (jika soft delete)                           |
| `deleted_at`                | Timestamp   | Nullable                | SoftDeletes field                                                |
| `created_at` / `updated_at` | Timestamp   | Auto                    | Laravel timestamps                                               |

> [!info] Penggunaan Polymorphic
> Dengan relasi polymorphic, tabel `asset_links` dapat digunakan oleh Sub-App manapun tanpa membuat tabel cloud link tersendiri per Sub-App. Tambahkan relasi `morphMany` di setiap Model yang membutuhkan:
>
> ```php
> public function assetLinks(): MorphMany
> {
>     return $this->morphMany(\App\Models\Core\AssetLink::class, 'linkable');
> }
> ```

> [!warning] Validasi URL
> Setiap URL yang disimpan ke `asset_links` **WAJIB** divalidasi dengan rule `'url'` di Form Object sebelum menyentuh database.

---

## 8. Security Standards & Auth Flow

### 8.1 Web Artisan Routes — Keamanan Token

> [!warning] Keamanan Token
> Token autentikasi Web Artisan Routes menggunakan HTTP Header `X-Artisan-Token`, bukan query string, untuk menghindari paparan di browser history, server access log, dan proxy log.

```php
// app/Http/Middleware/ArtisanTokenMiddleware.php
public function handle(Request $request, Closure $next): Response
{
    $token      = $request->header('X-Artisan-Token');
    $validToken = config('app.artisan_secret');

    if (!$token || !hash_equals($validToken, $token)) {
        abort(403);
    }

    $allowedIps = array_filter(explode(',', config('app.artisan_allowed_ips', '')));
    if (!empty($allowedIps) && !in_array($request->ip(), $allowedIps)) {
        abort(403);
    }

    return $next($request);
}
```

> [!info] Perilaku IP Whitelist
> Jika `ARTISAN_ALLOWED_IPS` kosong atau tidak didefinisikan di `.env`, validasi IP dilewati. Jika diisi, hanya IP yang terdaftar yang diizinkan. Format CSV: `ARTISAN_ALLOWED_IPS=192.168.1.1,10.0.0.5`.

```php
// routes/web_artisan.php
Route::middleware(['artisan-token'])->prefix('_cmd')->group(function () {
    Route::get('/migrate',          fn() => Artisan::call('migrate --force'));
    Route::get('/storage-link',     fn() => Artisan::call('storage:link'));
    Route::get('/clear-cache',      fn() => Artisan::call('optimize:clear'));
    Route::get('/seed-permissions', fn() => Artisan::call('db:seed --class=RolePermissionSeeder --force'));
    Route::get('/queue-restart',    fn() => Artisan::call('queue:restart'));
});
```

### 8.2 Alur Registrasi & Approval Akun

> [!danger] Aturan Kritis
> Tidak ada akun yang dapat mengakses fitur apapun (termasuk Dashboard dan Sub-App) sebelum Superadmin memberikan approval. Ini adalah garis pertahanan utama akses tidak sah ke `creative.doran.id`.

#### Alur Lengkap Registrasi → Approval → Login

```
[1] User buka /register
    → Isi: nama lengkap, username, email, nomor WhatsApp, password,
           konfirmasi password, catatan registrasi (opsional)
    → Submit

[2] System:
    → Buat akun baru dengan is_active = false
    → Tidak ada Role yang diberikan
    → Kirim UserRegisteredNotification ke SELURUH user ber-permission approve-users
       (in-app real-time via Pusher + WhatsApp Fonnte)
    → Redirect user ke /pending

[3] User landing di /pending
    → Halaman statis: "Akunmu sedang menunggu persetujuan admin."
    → Tidak bisa mengakses halaman lain selain /pending dan /profile
    → Bisa logout

[4] Superadmin buka /users/pending
    → Lihat antrian akun pending
    → Tindakan per akun: Approve atau Reject

[5a] Superadmin klik Approve:
    → is_active = true
    → approved_by = Superadmin ID
    → approved_at = now()
    → Assign Role sesuai jabatan
    → Kirim AccountApprovedNotification ke user (in-app real-time via Pusher + WhatsApp Fonnte)
    → User sudah bisa login penuh

[5b] Superadmin klik Reject:
    → Akun di-soft delete (deleted_at = now(), deleted_by = Superadmin ID)
    → Kirim AccountRejectedNotification ke user (in-app real-time via Pusher + WhatsApp Fonnte)
    → Jika user sedang login → sesi di-invalidate saat request berikutnya
```

#### Form Registrasi — Validasi Wajib

```php
// app/Livewire/Forms/Core/RegisterForm.php
public function rules(): array
{
    return [
        'name'              => 'required|string|max:255',
        'username'          => 'required|string|max:100|unique:users,username|alpha_dash',
        'email'             => 'required|email|max:255|unique:users,email',
        'whatsapp_number'   => 'nullable|string|max:20|regex:/^628[0-9]{8,12}$/',
        'password'          => 'required|string|min:8|confirmed',
        'registration_note' => 'nullable|string|max:500',
    ];
}
```

#### Action Class Registrasi

```php
// app/Actions/Core/RegisterUserAction.php
namespace App\Actions\Core;

use App\Models\Core\User;
use App\Notifications\Core\UserRegisteredNotification;

class RegisterUserAction
{
    public function handle(RegisterForm $form): User
    {
        $user = User::create([
            'name'              => $form->name,
            'username'          => $form->username,
            'email'             => $form->email,
            'whatsapp_number'   => $form->whatsapp_number,
            'password'          => bcrypt($form->password),
            'registration_note' => $form->registration_note,
            'is_active'         => false, // WAJIB false — pending approval
        ]);

        // Notifikasi ke semua Superadmin (in-app real-time + WhatsApp)
        $admins = User::permission('approve-users')->where('is_active', true)->get();
        foreach ($admins as $admin) {
            $admin->notify(new UserRegisteredNotification($user));
        }

        activity('auth')
            ->performedOn($user)
            ->withProperties(['ip' => request()->ip()])
            ->log('[CORE] New user registered — pending approval: '.$user->email);

        return $user;
    }
}
```

#### Action Class Approval

```php
// app/Actions/Core/ApproveUserAction.php
namespace App\Actions\Core;

use App\Models\Core\User;
use App\Notifications\Core\AccountApprovedNotification;

class ApproveUserAction
{
    public function handle(User $user, User $admin, string $roleName): void
    {
        $user->update([
            'is_active'   => true,
            'approved_by' => $admin->id,
            'approved_at' => now(),
            'updated_by'  => $admin->id,
        ]);

        $user->assignRole($roleName);
        $user->notify(new AccountApprovedNotification());

        activity('auth')
            ->causedBy($admin)
            ->performedOn($user)
            ->withProperties(['ip' => request()->ip(), 'role_assigned' => $roleName])
            ->log('[CORE] User account approved: '.$user->email);
    }
}
```

#### Action Class Reject

```php
// app/Actions/Core/RejectUserAction.php
namespace App\Actions\Core;

use App\Models\Core\User;
use App\Notifications\Core\AccountRejectedNotification;

class RejectUserAction
{
    public function handle(User $user, User $admin): void
    {
        $user->notify(new AccountRejectedNotification());

        $user->update(['deleted_by' => $admin->id]);
        $user->delete(); // soft delete

        activity('auth')
            ->causedBy($admin)
            ->performedOn($user)
            ->withProperties(['ip' => request()->ip()])
            ->log('[CORE] User account rejected and removed: '.$user->email);
    }
}
```

### 8.3 Middleware EnsureUserIsActive

Middleware ini dipasang di semua route yang memerlukan akun aktif. User yang sudah login namun `is_active = false` diredirect ke `/pending`, bukan ke halaman login.

```php
// app/Http/Middleware/EnsureUserIsActive.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (auth()->check() && !auth()->user()->is_active) {
            return redirect()->route('pending');
        }

        return $next($request);
    }
}
```

Daftarkan middleware di `bootstrap/app.php` (Laravel 11):

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'verified-active' => \App\Http\Middleware\EnsureUserIsActive::class,
        'app'             => \App\Http\Middleware\EnsureUserCanAccessApp::class,
        'artisan-token'   => \App\Http\Middleware\ArtisanTokenMiddleware::class,
    ]);
})
```

### 8.4 Variabel `.env` yang Wajib Didefinisikan

```env
# Web Artisan Security
ARTISAN_SECRET=your-secure-random-token-here
ARTISAN_ALLOWED_IPS=

# WhatsApp Fonnte
FONNTE_TOKEN=
FONNTE_SENDER=

# Broadcasting — Pusher
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=ap1

# Pusher keys untuk frontend (Vite akan membaca dua variabel ini)
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

> [!info] Kenapa Ada Dua Set Pusher Keys?
> Variabel `PUSHER_APP_*` digunakan oleh PHP server untuk mengirim event ke Pusher API. Variabel `VITE_PUSHER_*` digunakan oleh Vite saat kompilasi aset — nilainya identik, namun prefix `VITE_` membuatnya tersedia di JavaScript frontend via `import.meta.env`.

> [!danger] Entri Google Dihapus
> Entri `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, dan `GOOGLE_REDIRECT_URI` **tidak ada** di `.env.example`. Jangan tambahkan entri ini.

### 8.5 Rate Limiting

- **Login endpoint:** `throttle:5,1` — 5 percobaan per menit, kunci 1 menit
- **Register endpoint:** `throttle:3,10` — 3 percobaan per 10 menit per IP
- **Web Artisan Routes:** `throttle:3,60` — 3 eksekusi per jam
- **File upload endpoint:** `throttle:10,1` — 10 upload per menit per user

### 8.6 Proteksi Data Umum

- Seluruh input user **WAJIB** melewati Form Object validation sebelum menyentuh database.
- Gunakan Eloquent ORM untuk semua query — hindari raw SQL kecuali sangat diperlukan.
- Jika raw SQL diperlukan, **WAJIB** menggunakan parameter binding: `DB::select('SELECT * FROM x WHERE id = ?', [$id])`
- Semua aksi destruktif (delete, reject, revoke) **WAJIB** dipagari middleware `can` atau `Gate::authorize()`.
- File `.env` **TIDAK BOLEH** dicommit ke repository.

---

## 9. Error Handling & Validasi Global

### 9.1 Global Exception Handler

```php
// app/Exceptions/Handler.php
public function register(): void
{
    $this->reportable(function (Throwable $e) {
        Log::error('Unhandled Exception', [
            'message' => $e->getMessage(),
            'url'     => request()->fullUrl(),
            'user_id' => auth()->id() ?? 'guest',
            'app'     => request()->segment(1),
        ]);
    });
}
```

### 9.2 Aturan Validation Error

- Validation error di Livewire Volt: gunakan `$this->addError()` atau biarkan Livewire auto-handle dari Form Object `validate()`.
- **JANGAN** gunakan `session()->flash()` untuk validation error — hanya untuk success/info message.
- Pesan error **WAJIB** menggunakan Bahasa Indonesia yang jelas dan actionable.
- Contoh **BENAR:** `"Username hanya boleh berisi huruf, angka, dan tanda hubung."`
- Contoh **SALAH:** `"The username field is required."` atau `"Error 422."`

### 9.3 Konfirmasi Modal untuk Aksi Destruktif

Setiap aksi yang tidak bisa di-undo (hapus soft delete, reject akun, revoke akses, hapus role) **WAJIB** menampilkan konfirmasi modal sebelum dieksekusi. Gunakan Blade Component `<x-confirm-modal>`.

```php
$confirmReject = function () {
    $this->dispatch('confirm-action', [
        'message' => 'Akun ini akan ditolak dan dihapus dari sistem. Yakin?',
        'confirm' => 'reject-user',
        'payload' => $this->userId,
    ]);
};
```

> [!info] Pesan Konfirmasi Modal — Soft Delete
> Seluruh aksi hapus di Creative Universe menggunakan **soft delete**, bukan hard delete permanen. Pesan konfirmasi modal **WAJIB** menggunakan frasa "dipindahkan ke arsip" atau "dihapus sementara", bukan "dihapus permanen". Pengecualian: reject akun pending menggunakan frasa "ditolak dan dihapus dari sistem" karena akun pending belum pernah aktif. Hapus Role menggunakan frasa "dihapus permanen" karena Role tidak mendukung SoftDeletes.

---

## 10. Kinerja, Caching & Database Indexing

### 10.1 Database Indexing

Kolom yang sering digunakan untuk filter, search, atau join **WAJIB** diberikan index di migration.

| Tabel           | Kolom                                 | Alasan Index                              |
| --------------- | ------------------------------------- | ----------------------------------------- |
| `users`         | `username`, `email`, `is_active`      | Login lookup, filter active/pending users |
| `users`         | `approved_by`                         | Lookup approval history                   |
| `[app]_tickets` | `status`, `assigned_to`, `created_by` | Filter tiket by status dan user           |
| `[app]_tickets` | `deleted_at`                          | SoftDeletes query performance             |
| `asset_links`   | `linkable_type`, `linkable_id`        | Polymorphic lookup performance            |
| `activity_log`  | `subject_type`, `subject_id`          | Audit trail lookup per resource           |
| `activity_log`  | `causer_id`                           | Filter log per user                       |
| `jobs`          | `queue`, `reserved_at`                | Queue worker performance                  |

### 10.2 Strategi Caching

- Data master yang jarang berubah (Kategori, daftar Provider): `Cache::remember('key', 3600, fn() => ...)`
- Cache invalidation **WAJIB** dipanggil setiap kali data master diupdate: `Cache::forget('key')`
- Jangan cache data yang bersifat per-user atau real-time (notifikasi, status tiket aktif, status akun pending)
- Gunakan prefix cache yang mencerminkan Sub-App: `'odds.priorities'`, `'core.roles'`

> [!danger] Spatie Permission Cache — Aturan Wajib
> Spatie Permission menyimpan data Role dan Permission dalam cache untuk performa pengecekan `can()`. Setiap kali Role atau Permission **diubah lewat jalur manapun** (seeder, UI, atau langsung via Eloquent), cache Spatie WAJIB di-reset. Kegagalan melakukan ini menyebabkan perubahan permission tidak berlaku sampai cache kadaluwarsa, yang merupakan security bug.
>
> ```php
> // Wajib dipanggil di setiap Action yang memodifikasi Role atau Permission:
> app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
> ```
>
> Role list **tidak boleh** di-cache dengan `Cache::remember()` karena sudah dikelola oleh Spatie internal cache. Menggunakan keduanya sekaligus akan menyebabkan inkonsistensi data.

---

## 11. Notifikasi & Audit Trail

### 11.1 Omnichannel Notifications

| Channel               | Penggunaan                                                                          | Mekanisme                         |
| --------------------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| **In-App (Lonceng)**  | Semua notifikasi — tersimpan di tabel `notifications` Laravel                       | Real-time via Pusher Broadcasting |
| **WhatsApp (Fonnte)** | Notifikasi urgent: registrasi pending, approval/reject akun, assign tiket, deadline | Fonnte API via queue job          |
| **Email (opsional)**  | Weekly summary                                                                      | —                                 |

#### In-App Bell Notification — Real-Time via Pusher

Komponen bell icon diimplementasikan sebagai Livewire Class Component yang **tidak menggunakan polling**. Pembaruan badge notifikasi berjalan secara real-time melalui event yang dikirim Pusher ke browser.

**Alur kerja:**

1. Sebuah notifikasi baru dibuat dan dikirim via `$user->notify(...)`.
2. Laravel Broadcasting mengirim event ke Pusher API via HTTP (diproses dalam queue job).
3. Pusher mendistribusikan event ke semua browser yang terhubung ke private channel user tersebut.
4. JavaScript listener di browser menerima event → memanggil `Livewire.dispatch('notification-received')`.
5. Livewire component `NotificationBell` menerima event → menjalankan query ulang ke database → me-refresh badge counter.

```php
// app/Livewire/Core/NotificationBell.php
namespace App\Livewire\Core;

use Livewire\Attributes\On;
use Livewire\Component;

class NotificationBell extends Component
{
    public int $unreadCount = 0;

    public function mount(): void
    {
        $this->unreadCount = auth()->user()->unreadNotifications()->count();
    }

    // Menerima event dari JavaScript yang di-trigger oleh Pusher listener
    #[On('notification-received')]
    public function refreshBell(): void
    {
        $this->unreadCount = auth()->user()->unreadNotifications()->count();
    }

    public function markAllAsRead(): void
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);
        $this->unreadCount = 0;
    }

    public function render(): \Illuminate\View\View
    {
        return view('livewire.core.notification-bell', [
            'notifications' => auth()->user()
                ->unreadNotifications()
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
```

```html
{{-- Di dalam layout utama (resources/views/layouts/app.blade.php) --}}
{{-- Letakkan sebelum tag </body>, setelah @vite --}}
@auth
<script>
    document.addEventListener('livewire:navigated', () => {
        if (typeof window.Echo !== 'undefined') {
            window.Echo.private(`App.Models.Core.User.{{ auth()->id() }}`)
                .notification(() => {
                    // Pusher menerima event notifikasi baru —
                    // dispatch ke Livewire NotificationBell untuk refresh
                    Livewire.dispatch('notification-received');
                });
        }
    });
</script>
@endauth
```

> [!info] Kenapa `livewire:navigated` Bukan `DOMContentLoaded`?
> `livewire:navigated` digunakan agar listener Echo terdaftar ulang setiap kali Livewire melakukan navigasi SPA-style. `DOMContentLoaded` hanya berjalan sekali saat halaman pertama kali dimuat.

---

### 11.2 Pusher Broadcasting — Setup & Konfigurasi

#### Instalasi Package

```bash
# PHP dependency — jalankan di lokal, commit composer.lock
composer require pusher/pusher-php-server

# NPM dependencies — jalankan di lokal, compile, commit public/build
npm install laravel-echo pusher-js
```

#### Konfigurasi Broadcasting

```php
// config/broadcasting.php
// Pastikan Pusher dikonfigurasi sebagai default driver
'default' => env('BROADCAST_CONNECTION', 'null'),

'connections' => [
    'pusher' => [
        'driver'  => 'pusher',
        'key'     => env('PUSHER_APP_KEY'),
        'secret'  => env('PUSHER_APP_SECRET'),
        'app_id'  => env('PUSHER_APP_ID'),
        'options' => [
            'cluster'  => env('PUSHER_APP_CLUSTER', 'ap1'),
            'useTLS'   => true,
        ],
    ],
],
```

#### Registrasi BroadcastServiceProvider (Laravel 11)

Di Laravel 11, jalankan perintah berikut di lokal untuk setup broadcasting:

```bash
php artisan install:broadcasting
```

Perintah ini membuat `routes/channels.php` dan mendaftarkan `BroadcastServiceProvider` secara otomatis.

#### Otorisasi Pusher Private Channel

Private channel membutuhkan otorisasi server agar hanya user yang berhak dapat subscribe.

```php
// routes/channels.php
use App\Models\Core\User;
use Illuminate\Support\Facades\Broadcast;

// Otorisasi private channel per user — hanya user yang bersangkutan yang bisa subscribe
Broadcast::channel('App.Models.Core.User.{id}', function (User $user, int $id): bool {
    return (int) $user->id === $id;
});
```

#### Inisialisasi Laravel Echo di Frontend

```js
// resources/js/bootstrap.js
// Tambahkan blok ini setelah konfigurasi Axios yang sudah ada

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? "ap1",
    forceTLS: true,
    authEndpoint: "/broadcasting/auth",
});
```

> [!warning] Wajib Build Ulang Setelah Perubahan Frontend
> Setiap perubahan pada `resources/js/bootstrap.js` atau file JS lainnya **WAJIB** diikuti dengan `npm run build` di lokal sebelum deploy. File `public/build/` yang ter-generate wajib dicommit dan diupload ke production.

> [!info] Route `/broadcasting/auth`
> Route ini disediakan otomatis oleh Laravel Broadcasting untuk memverifikasi bahwa user yang subscribe ke private channel adalah user yang sah (memanggil callback di `routes/channels.php`). Route ini bekerja dengan session auth standar — tidak perlu konfigurasi tambahan.

---

### 11.3 Fonnte WhatsApp Service

Seluruh komunikasi dengan Fonnte API dikapsulasi dalam `App\Services\Fonnte\FonnteService`. Dilarang memanggil Fonnte API langsung dari Notification class atau Controller.

```php
// app/Services/Fonnte/FonnteService.php
namespace App\Services\Fonnte;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    private string $token;
    private string $sender;
    private string $baseUrl = 'https://api.fonnte.com';

    public function __construct()
    {
        $this->token  = config('services.fonnte.token');
        $this->sender = config('services.fonnte.sender');
    }

    public function send(string $target, string $message): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post("{$this->baseUrl}/send", [
                'target'  => $target,
                'message' => $message,
                'sender'  => $this->sender,
            ]);

            if (!$response->successful()) {
                Log::error('[CORE] Fonnte API error', [
                    'target'   => $target,
                    'status'   => $response->status(),
                    'response' => $response->body(),
                ]);
                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('[CORE] Fonnte request failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
```

```php
// config/services.php
'fonnte' => [
    'token'  => env('FONNTE_TOKEN'),
    'sender' => env('FONNTE_SENDER'),
],
```

---

### 11.4 Custom Notification Channel — Fonnte

```php
// app/Notifications/Channels/FonnteChannel.php
namespace App\Notifications\Channels;

use App\Services\Fonnte\FonnteService;
use Illuminate\Notifications\Notification;

class FonnteChannel
{
    public function __construct(private FonnteService $fonnte) {}

    public function send(object $notifiable, Notification $notification): void
    {
        $target = $notifiable->whatsapp_number;

        if (!$target) {
            return; // User tidak punya nomor WA — skip tanpa error
        }

        $this->fonnte->send($target, $notification->toFonnte($notifiable));
    }
}
```

---

### 11.5 Notification Classes — Approval Flow

Tiga Notification class wajib dibuat untuk mendukung alur registrasi dan approval. Setiap class menggunakan tiga channel: **database** (tersimpan permanen), **broadcast** (real-time via Pusher), dan **FonnteChannel** (WhatsApp).

```php
// app/Notifications/Core/UserRegisteredNotification.php
// Penerima: Superadmin (semua user ber-permission approve-users)
// Trigger: setelah user baru berhasil mendaftar

use Illuminate\Notifications\Messages\BroadcastMessage;

class UserRegisteredNotification extends Notification implements ShouldQueue
{
    public int $tries   = 3;
    public int $backoff = 60;

    public function __construct(private User $newUser) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', FonnteChannel::class];
    }

    // Payload yang dikirim ke Pusher — data minimal untuk performa
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    public function toFonnte(object $notifiable): string
    {
        return "Ada pendaftar baru di Creative Universe!\n"
             . "Nama: {$this->newUser->name}\n"
             . "Email: {$this->newUser->email}\n"
             . "Catatan: " . ($this->newUser->registration_note ?? '-') . "\n"
             . "Buka dashboard untuk approve atau reject.";
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message'     => "Pendaftar baru: {$this->newUser->name} ({$this->newUser->email})",
            'url'         => route('core.users.pending'),
            'new_user_id' => $this->newUser->id,
        ];
    }
}
```

```php
// app/Notifications/Core/AccountApprovedNotification.php
// Penerima: user yang baru diapprove
// Trigger: setelah Superadmin approve akun

use Illuminate\Notifications\Messages\BroadcastMessage;

class AccountApprovedNotification extends Notification implements ShouldQueue
{
    public int $tries   = 3;
    public int $backoff = 60;

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', FonnteChannel::class];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    public function toFonnte(object $notifiable): string
    {
        return "Halo {$notifiable->name}! Akunmu di Creative Universe telah disetujui. "
             . "Kamu sekarang bisa login dan menggunakan aplikasi.";
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Akunmu telah disetujui. Selamat datang di Creative Universe!',
            'url'     => route('dashboard'),
        ];
    }
}
```

```php
// app/Notifications/Core/AccountRejectedNotification.php
// Penerima: user yang ditolak
// Trigger: setelah Superadmin reject akun

use Illuminate\Notifications\Messages\BroadcastMessage;

class AccountRejectedNotification extends Notification implements ShouldQueue
{
    public int $tries   = 3;
    public int $backoff = 60;

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', FonnteChannel::class];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    public function toFonnte(object $notifiable): string
    {
        return "Halo {$notifiable->name}. Pendaftaran akunmu di Creative Universe "
             . "tidak dapat disetujui. Hubungi admin divisi untuk informasi lebih lanjut.";
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Pendaftaran akunmu tidak disetujui. Hubungi admin divisi.',
            'url'     => null,
        ];
    }
}
```

---

### 11.6 Notification Class — Ticket Assigned

```php
// app/Notifications/Odds/TicketAssignedNotification.php

use Illuminate\Notifications\Messages\BroadcastMessage;

class TicketAssignedNotification extends Notification implements ShouldQueue
{
    public int $tries   = 3;
    public int $backoff = 60;

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', FonnteChannel::class];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    public function toFonnte(object $notifiable): string
    {
        return "Halo {$notifiable->name}, tiket baru telah di-assign kepadamu di ODDS. "
             . "Cek Creative Universe untuk detail.";
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Tiket baru di-assign kepadamu.',
            'url'     => route('odds.tickets.show', $this->ticket->id),
        ];
    }
}
```

> [!info] Pola `toBroadcast()` untuk Notification Baru
> Setiap Notification class yang dibuat di masa depan (baik di Core maupun Sub-App) **WAJIB** mengikuti pola tiga channel ini: `'database'`, `'broadcast'`, `FonnteChannel::class`. Method `toBroadcast()` cukup mengembalikan `new BroadcastMessage($this->toArray($notifiable))` kecuali ada kebutuhan payload berbeda untuk Pusher.

---

### 11.7 Queue Worker di cPanel (Tanpa SSH)

```bash
# Cron Job di cPanel — queue:work sekali per menit
* * * * * cd /home/[username]/[project-folder] && php artisan queue:work --stop-when-empty --tries=3 >> /dev/null 2>&1
```

> [!warning] Pilihan `--stop-when-empty`
> Worker berhenti otomatis setelah queue kosong — kompatibel dengan Shared Hosting. Cron Job berikutnya menginisiasi worker baru jika ada job masuk. Broadcasting via Pusher (HTTP call ke `api.pusherapp.com`) dilakukan dari dalam queue job ini — tidak ada koneksi WebSocket dari server, hanya HTTP request biasa.

---

### 11.8 Audit Trail — Activity Log

```php
// app/Models/Odds/Ticket.php
use Spatie\Activitylog\Traits\LogsActivity;

class Ticket extends Model
{
    use LogsActivity;

    protected static $logName      = 'odds-ticket';
    protected static $logFillable  = true;
    protected static $logOnlyDirty = true;
}
```

### 11.9 Audit Login & Logout via Event Listener

```php
// app/Listeners/LogAuthActivity.php
class LogAuthActivity
{
    public function handleLogin(Login $event): void
    {
        activity('auth')
            ->causedBy($event->user)
            ->withProperties([
                'ip'         => request()->ip(),
                'user_agent' => request()->userAgent(),
                'sub_app'    => 'core',
            ])
            ->log('User login');
    }

    public function handleLogout(Logout $event): void
    {
        activity('auth')
            ->causedBy($event->user)
            ->withProperties(['ip' => request()->ip(), 'sub_app' => 'core'])
            ->log('User logout');
    }
}
```

```php
// app/Providers/EventServiceProvider.php
protected $listen = [
    \Illuminate\Auth\Events\Login::class  => [\App\Listeners\LogAuthActivity::class.'@handleLogin'],
    \Illuminate\Auth\Events\Logout::class => [\App\Listeners\LogAuthActivity::class.'@handleLogout'],
];
```

### 11.10 IP Address pada Audit Trail

IP Address dicatat sebagai custom property pada setiap activity log via kolom `properties` (JSON) Spatie. Tidak memerlukan kolom tambahan di tabel `activity_log`.

### 11.11 Log Viewer — Superadmin Only

- Route: `/system/logs` — middleware `auth` + `can:view-logs`
- Hanya Superadmin (`view-logs`) yang dapat mengakses

---

## 12. Testing Strategy

> [!info] Filosofi Testing
> Testing bukan luxury, testing adalah dokumentasi yang bisa dijalankan.

### 12.1 Standar Minimum

- Setiap Action Class **WAJIB** memiliki minimal 1 unit test yang mencover happy path.
- Fitur kritis (login, registrasi, approval flow, permission check, file upload, role management) **WAJIB** memiliki Feature Test.
- Gunakan SQLite in-memory untuk kecepatan: konfigurasi `testing` database di `phpunit.xml`.
- Nama test **WAJIB** deskriptif dalam Bahasa Inggris.
- Seluruh test dijalankan secara **manual** sebelum setiap deploy: `php artisan test`.

### 12.2 Wajib Ada — Feature Test Auth Flow

```php
// tests/Feature/Auth/RegistrationApprovalTest.php
class RegistrationApprovalTest extends TestCase
{
    public function test_new_user_is_inactive_after_registration(): void
    {
        $this->post('/register', [...]);
        $this->assertDatabaseHas('users', ['email' => 'test@test.com', 'is_active' => false]);
    }

    public function test_inactive_user_cannot_access_dashboard(): void
    {
        $user = User::factory()->create(['is_active' => false]);
        $this->actingAs($user)->get('/dashboard')->assertRedirect('/pending');
    }

    public function test_superadmin_can_approve_user(): void
    {
        $admin   = User::factory()->create(['is_active' => true])->assignRole('Superadmin');
        $pending = User::factory()->create(['is_active' => false]);

        $this->actingAs($admin)->post("/users/{$pending->id}/approve", ['role' => 'Desainer']);
        $this->assertDatabaseHas('users', ['id' => $pending->id, 'is_active' => true]);
    }

    public function test_approved_user_receives_notification(): void
    {
        Notification::fake();
        // ... trigger approval ...
        Notification::assertSentTo($pending, AccountApprovedNotification::class);
    }

    public function test_superadmin_receives_notification_on_new_registration(): void
    {
        Notification::fake();
        $this->post('/register', [...]);
        Notification::assertSentTo($superadmin, UserRegisteredNotification::class);
    }
}
```

### 12.3 Wajib Ada — Feature Test Dynamic Role Management

```php
// tests/Feature/Core/DynamicRoleManagementTest.php
class DynamicRoleManagementTest extends TestCase
{
    public function test_superadmin_can_create_new_role(): void
    {
        $admin = User::factory()->create(['is_active' => true])->assignRole('Superadmin');
        $this->actingAs($admin)->post('/roles', ['name' => 'Koordinator', 'permissions' => ['access-core']]);
        $this->assertDatabaseHas('roles', ['name' => 'Koordinator']);
    }

    public function test_protected_role_cannot_be_deleted(): void
    {
        $admin = User::factory()->create(['is_active' => true])->assignRole('Superadmin');
        $role  = Role::findByName('Superadmin');
        $this->expectException(\RuntimeException::class);
        (new DeleteRoleAction)->handle($role, $admin);
    }

    public function test_role_with_active_users_cannot_be_deleted(): void
    {
        $admin = User::factory()->create(['is_active' => true])->assignRole('Superadmin');
        $role  = Role::firstOrCreate(['name' => 'TestRole']);
        User::factory()->create(['is_active' => true])->assignRole('TestRole');
        $this->expectException(\RuntimeException::class);
        (new DeleteRoleAction)->handle($role, $admin);
    }
}
```

### 12.4 Contoh Unit Test

```php
// tests/Unit/Actions/Odds/CreateTicketActionTest.php
class CreateTicketActionTest extends TestCase
{
    public function test_ticket_is_created_with_correct_data(): void
    {
        $user        = User::factory()->create(['is_active' => true]);
        $form        = new TicketForm();
        $form->title = 'Banner Instagram JETE';

        $ticket = (new CreateTicketAction)->handle($form, $user);

        $this->assertDatabaseHas('tickets', ['title' => 'Banner Instagram JETE']);
    }
}
```

---

## 13. Deployment & cPanel Workarounds

### 13.1 Environment

| Environment    | Tujuan                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| **Local**      | Development harian dan UAT sebelum deploy                              |
| **Production** | Sistem aktif perusahaan di Shared Hosting cPanel (`creative.doran.id`) |

> [!danger] LARANGAN
> Testing fitur baru **DILARANG** dilakukan langsung di Production. Semua pengujian dilakukan di environment Local.

### 13.2 Checklist Pre-Deploy

> [!danger] Wajib dijalankan setiap kali deploy ke production

1. Pastikan semua test lulus: `php artisan test`
2. Build asset lokal: `npm run build`
3. Commit folder `public/build` ke repository
4. Update `.env.example` jika ada perubahan environment variable baru
5. Buat migration baru — **JANGAN** edit migration lama yang sudah di-run di production
6. Upload seluruh file ke cPanel via FTP atau File Manager
7. Trigger migration: `GET /_cmd/migrate`
8. Trigger clear cache: `GET /_cmd/clear-cache`
9. Trigger queue restart: `GET /_cmd/queue-restart`
10. Verifikasi storage symlink: `GET /_cmd/storage-link` (hanya jika pertama kali atau symlink hilang)
11. Jika ada perubahan Role/Permission inti: `GET /_cmd/seed-permissions`
12. Verifikasi Pusher berfungsi: buka dua tab browser berbeda, login sebagai user berbeda, pastikan notifikasi muncul real-time

### 13.3 cPanel Cron Jobs

```bash
# Laravel Scheduler — setiap menit
* * * * * cd /home/[username]/[project-folder] && php artisan schedule:run >> /dev/null 2>&1

# Queue Worker — setiap menit
# Queue worker ini yang bertugas mengirim event ke Pusher API dan Fonnte WA
* * * * * cd /home/[username]/[project-folder] && php artisan queue:work --stop-when-empty --tries=3 >> /dev/null 2>&1
```

> [!info] Asumsi Operasional
> PHP CLI dan Cron Job diasumsikan tersedia di Shared Hosting. Outbound HTTP request ke `api.pusherapp.com` (port 443/HTTPS) diasumsikan diizinkan oleh server — ini adalah konfigurasi standar di semua Shared Hosting modern. Jika ditemukan keterbatasan, catat sebagai deviasi operasional.

### 13.4 Branch Strategy

| Branch           | Aturan                                                                   |
| ---------------- | ------------------------------------------------------------------------ |
| `main`           | Production-ready **SELALU**. Hanya merge dari `develop` setelah testing. |
| `develop`        | Integration branch. Semua feature branch di-merge ke sini dulu.          |
| `feature/[nama]` | Satu branch per fitur. Contoh: `feature/auth-approval-flow`              |
| `hotfix/[nama]`  | Perbaikan bug kritis. Merge ke `main` DAN `develop`.                     |

---

## 14. UI/UX Standards & Loading States

### 14.1 Loading State — Wajib di Semua Form

> [!danger] Aturan Wajib
> Setiap form dan tombol aksi yang berinteraksi dengan server **WAJIB** disematkan atribut `wire:loading`.

```html
<button
    wire:click="save"
    wire:loading.attr="disabled"
    wire:target="save"
    class="btn-primary"
>
    <span wire:loading.remove wire:target="save">Simpan</span>
    <span wire:loading wire:target="save">
        <svg class="animate-spin h-4 w-4 mr-1" ...></svg> Menyimpan...
    </span>
</button>
```

### 14.2 Standar Pesan UI

- Semua label, pesan, dan copy UI menggunakan **Bahasa Indonesia**.
- Tombol menggunakan kata kerja aktif dan spesifik: `"Daftar Akun"`, `"Setujui Akun"`, `"Tolak Akun"`, `"Buat Role"`.
- Pesan sukses: `"[Nama entitas] berhasil [aksi]."` — contoh: `"Akun berhasil disetujui."`, `"Role Koordinator berhasil dibuat."`
- Pesan error: actionable — contoh: `"Email sudah digunakan. Coba email lain."`
- Empty state harus memberikan instruksi — contoh: `"Tidak ada akun yang menunggu persetujuan."`
- Halaman `/pending` menggunakan bahasa yang ramah dan tidak membuat user khawatir.

---

## 15. Panduan Debug & Developer Workflow

### 15.1 Peta Debug per Lapisan Masalah

| Gejala Masalah                              | Cari di Mana                                          | Tool / Perintah                                                                                                                   |
| ------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| User daftar tapi tidak bisa login           | Tabel `users` kolom `is_active`                       | Cek status pending di `/users/pending`                                                                                            |
| Notif approval tidak terkirim               | Tabel `jobs` dan `failed_jobs`                        | Cek `FonnteService`, periksa `FONNTE_TOKEN`                                                                                       |
| Superadmin tidak terima notif WA            | Tabel `users` kolom `whatsapp_number`                 | Pastikan format `628xxxx`                                                                                                         |
| Bell notifikasi tidak update real-time      | Browser DevTools → Console & Network                  | Pastikan Pusher terkoneksi, cek `VITE_PUSHER_APP_KEY` dan `VITE_PUSHER_APP_CLUSTER` di `.env`, jalankan `npm run build` ulang     |
| Pusher event tidak diterima server          | Tabel `jobs` dan `failed_jobs`                        | Pastikan queue worker berjalan, cek `PUSHER_APP_SECRET` di `.env`, cek outbound HTTP ke `api.pusherapp.com:443` diizinkan hosting |
| User approved tapi tidak bisa akses Sub-App | Tabel `model_has_roles`                               | Pastikan Role sudah di-assign saat approval                                                                                       |
| Perubahan permission tidak berlaku          | Cache Spatie                                          | Pastikan `forgetCachedPermissions()` dipanggil di Action Class, atau jalankan `GET /_cmd/clear-cache`                             |
| Role baru tidak muncul di dropdown          | Cache aplikasi                                        | Jalankan `GET /_cmd/clear-cache`                                                                                                  |
| Error 500 / exception tak terduga           | `storage/logs/laravel.log`                            | Log Viewer (Superadmin)                                                                                                           |
| Validasi form tidak bekerja                 | `app/Livewire/Forms/[SubApp]/[Name]Form.php`          | Cek method `rules()`                                                                                                              |
| Query lambat / data salah                   | `app/Models/[SubApp]/[Name].php`                      | Cek Local Scope, tambah index                                                                                                     |
| Permission denied 403                       | Tabel `roles`, `permissions`, `model_has_permissions` | `php artisan permission:show`                                                                                                     |
| Fonnte API error                            | `storage/logs/laravel.log`                            | Filter keyword `[CORE] Fonnte`                                                                                                    |
| Asset CSS/JS tidak update                   | `public/build/`                                       | `npm run build` ulang di lokal, re-upload                                                                                         |
| Queue job tidak diproses                    | Tabel `jobs`                                          | Pastikan Cron Job `queue:work` terdaftar di cPanel                                                                                |
| Cloud link tidak tampil                     | Tabel `asset_links`                                   | Cek relasi `morphMany` di Model                                                                                                   |

### 15.2 Konvensi Prefix Log

```php
Log::info('[CORE] New registration: test@example.com');
Log::info('[CORE] Account approved: test@example.com by admin#1');
Log::info('[CORE] Account rejected: test@example.com by admin#1');
Log::info('[CORE] User #5 logged in');
Log::info('[CORE] New role created: Koordinator by admin#1');
Log::info('[CORE] Role permissions updated: Manajer by admin#1');
Log::info('[CORE] Role deleted: TestRole by admin#1');
Log::error('[CORE] Fonnte API error for user #45', ['status' => 500]);
Log::info('[ODDS] Ticket #123 assigned to user #45');
Log::warning('[ODDS] SLA approaching for ticket #123');
```

### 15.3 Checklist Membuat Sub-App Baru

1. Buat folder namespace: `app/Http/Controllers/[AppName]/`, `app/Models/[AppName]/`, `app/Actions/[AppName]/`, `app/Livewire/[AppName]/`
2. Buat route file: `routes/modules/[app-slug].php` dengan prefix `verified-active`, middleware, dan name group
3. Require route file baru di `routes/web.php`
4. Tambahkan permission `access-[app-slug]` dan permission spesifik ke `$corePermissions` di `RolePermissionSeeder` dan Seksi 6.3
5. Pastikan middleware `EnsureUserCanAccessApp` terpasang di route group
6. Setup log channel di `config/logging.php`
7. Buat folder views: `resources/views/livewire/[app-slug]/` dan `resources/views/pages/[app-slug]/`
8. Update `.env.example` jika Sub-App butuh environment variable baru
9. Dokumentasikan Role-Permission baru di [[#6.3 Role-Permission Matrix|Seksi 6.3]]
10. Pastikan Model memiliki relasi `morphMany` ke `AssetLink` jika membutuhkan cloud link
11. Pastikan semua Notification class Sub-App menggunakan tiga channel: `database`, `broadcast`, `FonnteChannel`

---

## 16. Core Domain Model & Data Ownership

> [!info] Tujuan
> Bab ini mendefinisikan entitas inti Creative Universe agar seluruh Sub-App menggunakan bahasa bisnis yang konsisten.

### 16.1 Prinsip Domain

```text
User
├── Project
│   ├── Task
│   │   └── AssetLink (polymorphic — cloud link)
│   ├── Asset
│   │   └── AssetLink (polymorphic — cloud link)
│   ├── Revision
│   └── Comment
│
├── Notification
├── Activity Log
└── Role / Permission
```

> [!warning] Scope Skema Domain Entity
> Entitas `Project`, `Task`, `Asset`, `Revision`, dan `Comment` adalah **reserved domain concept** — nama dan hierarkinya dikunci di Master SRD ini. Namun **skema tabel** untuk masing-masing entitas didefinisikan di **SRD masing-masing Sub-App**. Tabel yang shared lintas Sub-App hanya `users` dan `asset_links`.

### 16.2 Aturan Kepemilikan Data

Setiap data operasional WAJIB memiliki kolom berikut:

| Kolom        | Tujuan                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| `created_by` | User pembuat data (FK → users.id, NOT NULL — kecuali tabel `users` sendiri) |
| `updated_by` | User terakhir yang mengubah (FK → users.id, Nullable)                       |
| `deleted_by` | User yang melakukan soft delete (FK → users.id, Nullable)                   |
| `created_at` | Waktu pembuatan (auto)                                                      |
| `updated_at` | Waktu perubahan (auto)                                                      |
| `deleted_at` | Waktu penghapusan (jika SoftDeletes, Nullable)                              |

### 16.3 Audit Requirement Matrix

| Aktivitas                | Wajib Audit | Mekanisme                                                                      |
| ------------------------ | ----------- | ------------------------------------------------------------------------------ |
| Login                    | Ya          | Auth Event Listener (Seksi 11.9)                                               |
| Logout                   | Ya          | Auth Event Listener (Seksi 11.9)                                               |
| Registrasi Akun Baru     | Ya          | Manual `activity()->log()` di `RegisterUserAction`                             |
| Approve Akun             | Ya          | Manual `activity()->log()` di `ApproveUserAction`                              |
| Reject Akun              | Ya          | Manual `activity()->log()` di `RejectUserAction`                               |
| Create Data              | Ya          | LogsActivity trait                                                             |
| Update Data              | Ya          | LogsActivity trait                                                             |
| Delete Data              | Ya          | LogsActivity trait                                                             |
| Restore Data             | Ya          | LogsActivity trait                                                             |
| Assign Ticket            | Ya          | Manual `activity()->log()` di Action Class                                     |
| Approve / Reject Tiket   | Ya          | Manual `activity()->log()` di Action Class                                     |
| **Buat Role Baru**       | **Ya**      | Manual `activity()->log()` di `CreateRoleAction` (log_name: `rbac`)            |
| **Ubah Permission Role** | **Ya**      | Manual `activity()->log()` di `UpdateRolePermissionsAction` (log_name: `rbac`) |
| **Hapus Role**           | **Ya**      | Manual `activity()->log()` di `DeleteRoleAction` (log_name: `rbac`)            |
| Eksekusi Web Artisan     | Ya          | Manual `activity()->log()` di Web Artisan Route                                |

Format minimum audit (custom properties di kolom `properties` JSON):

- `causer_id`, `created_at`, `old`, `new`, `ip`, `sub_app`

---

## 17. Data Lifecycle, Backup & Disaster Recovery

### 17.1 Data Retention Policy

| Data                  | Retensi  | Scheduler Command                              |
| --------------------- | -------- | ---------------------------------------------- |
| Activity Log          | 24 Bulan | `CleanOldActivityLogCommand` — monthly         |
| Notifications         | 12 Bulan | `CleanOldNotificationsCommand` — monthly       |
| Failed Jobs           | 30 Hari  | `CleanFailedJobsCommand` — daily               |
| Password Reset Tokens | 7 Hari   | Laravel built-in (`auth:clear-resets`) — daily |
| Temporary Upload      | 7 Hari   | `CleanTempUploadsCommand` — daily              |
| Soft Deleted Data     | 12 Bulan | `PruneStaleRecordsCommand` — monthly           |

```php
// routes/console.php
Schedule::command('clean:activity-log')->monthly();
Schedule::command('clean:notifications')->monthly();
Schedule::command('clean:failed-jobs')->daily();
Schedule::command('auth:clear-resets')->daily();
Schedule::command('clean:temp-uploads')->daily();
Schedule::command('clean:stale-records')->monthly();
```

### 17.2 Backup Policy

- Database Backup Harian (via cPanel Backup Wizard)
- Full Application Backup Mingguan
- Penyimpanan backup di lokasi berbeda dari server production
- Retensi backup minimal 30 hari

### 17.3 Disaster Recovery Procedure

1. Identifikasi waktu kejadian.
2. Tentukan backup terbaru yang valid.
3. Restore database ke environment terisolasi (Local).
4. Verifikasi integritas data.
5. Restore ke production.
6. Dokumentasikan insiden.

### 17.4 Recovery Objective

| Parameter                      | Target                          |
| ------------------------------ | ------------------------------- |
| RPO (Recovery Point Objective) | Maksimal kehilangan data 24 jam |
| RTO (Recovery Time Objective)  | Maksimal downtime 8 jam         |

---

## 18. Environment, API & Future Integration Standards

### 18.1 Database Change Management

1. DILARANG mengubah migration lama yang sudah pernah dijalankan di Production.
2. Setiap perubahan struktur database WAJIB dibuat dalam migration baru.
3. Rollback harus diuji di environment Local sebelum deploy ke Production.
4. Setiap migration harus memiliki tujuan tunggal dan jelas.

### 18.2 API Response Standard

#### Success Response

```json
{
    "success": true,
    "message": "Data berhasil diambil.",
    "data": {}
}
```

#### Error Response

```json
{
    "success": false,
    "message": "Data tidak ditemukan.",
    "errors": []
}
```

### 18.3 Performance Target

| Aktivitas                             | Target                                              |
| ------------------------------------- | --------------------------------------------------- |
| Login                                 | < 2 detik                                           |
| Dashboard Load                        | < 3 detik                                           |
| Submit Form                           | < 2 detik                                           |
| Search Data                           | < 3 detik                                           |
| Upload File                           | < 10 detik                                          |
| Notifikasi Real-Time (Pusher latency) | < 500ms (dikontrol oleh Pusher SLA, bukan aplikasi) |

Verifikasi dilakukan manual menggunakan browser DevTools Network tab selama QA di environment Local.

### 18.4 Future Integration Principles

Creative Universe dirancang untuk mendukung integrasi dengan:

- WhatsApp API (sudah diimplementasikan via Fonnte)
- Pusher (sudah diimplementasikan untuk real-time broadcasting)
- Looker Studio
- Mobile Application
- REST API Consumer lainnya

> [!danger] LARANGAN KERAS
> Seluruh integrasi eksternal **WAJIB** menggunakan `Service Class` di `app/Services/[IntegrationName]/`. DILARANG menempatkan kode integrasi langsung di Controller, Volt SFC, Action Class, atau Blade View.

---
