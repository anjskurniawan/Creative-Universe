# Entity Relationship Document (ERD)
## Creative Universe - Sub-App: ODDS (One Dashboard Design System)

> **Versi:** 1.0.0
> **Status:** Draft
> **Modul Induk:** Creative Universe Monorepo

---

## 1. Pendahuluan

Dokumen ini menjelaskan struktur basis data dari Sub-App **ODDS (One Dashboard Design System)**. Seluruh skema tabel ODDS diisolasi dengan prefix `odds_`, kecuali untuk tabel bersama (shared tables) yang dikelola oleh *Core System* (seperti `users`, `asset_links`, dan tabel *Spatie Permission*). Semua relasi *foreign key* dari `odds_*` ke *Core tables* diperbolehkan dan dikonfigurasi melalui migrasi standar.

---

## 2. Struktur Tabel Utama

### 2.1 `odds_tickets`
Pusat entitas dari sistem ODDS. Mencatat setiap *request* desain yang diajukan oleh *Staff/Client*.

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto Increment |
| `ticket_number` | String(50) | Nomor unik tiket (contoh: `ODDS-260622-001`), Index, Unique |
| `design_purpose` | String(255) | Tujuan design (berdasarkan kolom "Tujuan Design" di spreadsheet) |
| `requester_id` | BigInt | FK -> `users.id` (Tugas Dari) |
| `assigned_to` | BigInt | FK -> `users.id` (Desainer yang ditugaskan, Nullable) |
| `category_id` | BigInt | FK -> `odds_design_categories.id` |
| `brand` | String(100) | Brand tujuan desain |
| `channel` | String(100) | Media tayang (Marketplace, Sosmed, dsb) |
| `important_matrix` | String(20) | Kuadran prioritas (Enum: `Quadrant 1`, `Quadrant 2`, `Quadrant 3`, `Quadrant 4`) |
| `deadline` | DateTime | Batas waktu pengerjaan (Default: H+3) |
| `status` | String(50) | Enum (Lihat SRD untuk daftar lengkap status) |
| `brief_score` | Int | Nullable, skor dari AI Brief Checker (0-100) |
| `sla_status` | String(20) | Enum: `on_track`, `at_risk`, `overdue`, Nullable |
| `approved_at` | Timestamp | Nullable, waktu akhir disetujui *Client* |
| `created_by` | BigInt | FK -> `users.id` |
| `created_at` / `updated_at` | Timestamp | Standard Timestamps |
| `deleted_at` | Timestamp | SoftDeletes |

### 2.2 `odds_ticket_briefs`
Menyimpan rincian narasi dan deskripsi kebutuhan secara terpisah untuk meminimalisasi ukuran tabel utama. Relasi `1:1` dengan `odds_tickets`.

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `ticket_id` | BigInt | FK -> `odds_tickets.id`, Unique |
| `description` | Text | Deskripsi permintaan desain |
| `target_audience` | String(255) | Audiens target |
| `key_message` | Text | Pesan utama yang ingin disampaikan |
| `required_outputs` | JSON | Spesifikasi output (contoh: ukuran 1080x1080) |
| `ai_summary` | Text | Nullable, rangkuman otomatis dari AI |
| `created_at` / `updated_at` | Timestamp | Standard Timestamps |

### 2.3 `odds_ticket_versions`
Mengelola hasil keluaran (*output*) dari desainer. Setiap iterasi revisi melahirkan versi baru.

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `ticket_id` | BigInt | FK -> `odds_tickets.id` |
| `version_number` | Int | Nomor urut versi (1, 2, 3...) |
| `submitted_by` | BigInt | FK -> `users.id` (Desainer yang submit) |
| `status` | String(50) | Enum: `pending_review`, `approved`, `rejected` |
| `notes` | Text | Catatan rilis versi dari desainer |
| `created_at` / `updated_at` | Timestamp | Standard Timestamps |

*(Tautan ke gambar pratinjau atau file source tidak disimpan di sini, melainkan melalui relasi polymorphic `morphMany` ke tabel `asset_links` milik Core)*

### 2.4 `odds_ticket_revisions`
Mencatat perintah revisi baik dari *SPV* maupun *Client*.

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `ticket_id` | BigInt | FK -> `odds_tickets.id` |
| `version_id` | BigInt | FK -> `odds_ticket_versions.id` (Versi yang direvisi) |
| `requested_by` | BigInt | FK -> `users.id` (Pihak yang meminta revisi) |
| `revision_type` | String(20) | Enum: `spv`, `manager`, `client` |
| `notes` | Text | Catatan perbaikan (Catatan Revisi) |
| `revision_deadline` | DateTime | Batas waktu pengerjaan revisi (Deadline Tugas Revisi) |
| `status` | String(20) | Enum: `open`, `resolved` |
| `created_at` / `updated_at` | Timestamp | Standard Timestamps |

### 2.5 `odds_ticket_ratings`
Menyimpan tanggapan (*feedback*) dari *Requester* setelah tiket selesai (Status `delivered`). Relasi `1:1` dengan `odds_tickets`.

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `ticket_id` | BigInt | FK -> `odds_tickets.id`, Unique |
| `rater_id` | BigInt | FK -> `users.id` (Requester) |
| `quality_score` | TinyInt | 1-5 |
| `speed_score` | TinyInt | 1-5 |
| `communication_score` | TinyInt | 1-5 |
| `overall_score` | Decimal(3,2) | Rata-rata kalkulasi nilai |
| `feedback` | Text | Nullable, testimoni naratif |
| `created_at` / `updated_at` | Timestamp | Standard Timestamps |

### 2.6 `odds_design_categories`
Master data untuk berbagai jenis tipe desain (Misal: Banner Sosmed, UI/UX, Print).

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `name` | String(100) | Nama Kategori |
| `sla_days` | Int | Target SLA default dalam hari (contoh: 3) |
| `is_active` | Boolean | Default `true` |
| `created_at` / `updated_at` | Timestamp | Standard Timestamps |

---

## 3. Relasi Shared Table (Core System)

### 3.1 Integrasi `users`
Tabel `users` (Core) menopang identitas bagi:
- `requester_id`
- `assigned_to`
- `submitted_by`
- `requested_by`
- `rater_id`

### 3.2 Integrasi `asset_links`
Setiap tiket, rincian brief, maupun versi output yang memiliki "attachment file" (berupa link Google Drive, Figma, dll) akan disimpan di tabel `asset_links` milik *Core*.

Konfigurasi Polymorphic:
- Model `Ticket` -> memiliki relasi `morphMany` AssetLink. (`linkable_type` = `App\Models\Odds\Ticket`)
- Model `TicketVersion` -> memiliki relasi `morphMany` AssetLink. (`linkable_type` = `App\Models\Odds\TicketVersion`)

### 3.3 Integrasi `activity_log`
Semua perubahan krusial di tabel `odds_tickets` (seperti pergeseran *status*, perpindahan *assignment*, revisi diajukan) diwajibkan tertangkap oleh trait `LogsActivity` dari Spatie Activitylog untuk keperluan audit historis.

---

## 4. Diagram Relasi Sederhana

```text
users (CORE) 1 -- N odds_tickets
odds_design_categories 1 -- N odds_tickets

odds_tickets 1 -- 1 odds_ticket_briefs
odds_tickets 1 -- N odds_ticket_versions
odds_tickets 1 -- N odds_ticket_revisions
odds_tickets 1 -- 1 odds_ticket_ratings

odds_ticket_versions 1 -- N odds_ticket_revisions

odds_tickets N -- N asset_links (CORE, Polymorphic)
odds_ticket_versions N -- N asset_links (CORE, Polymorphic)
```
