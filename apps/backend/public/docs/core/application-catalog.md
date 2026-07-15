# Creative Universe Application Catalog

## 1. Tujuan

Dokumen ini adalah daftar resmi Core, Sub-App, dan aplikasi eksperimen Creative Universe. Perubahan nama, slug, key backend, status, atau kepemilikan fitur wajib memperbarui katalog ini sebelum implementasi.

## 2. Core application

Core bukan Sub-App bisnis. Core menyediakan capability bersama dan portal untuk seluruh Sub-App.

| Fitur Core | Fungsi | Akses dasar |
|---|---|---|
| Authentication | Login, logout, session, CSRF, dan pemulihan password | Semua akun sesuai status |
| Account & Onboarding | Identitas akun, divisi, posisi, dan aktivasi awal | Semua akun terkait |
| User Management | Daftar dan pengelolaan pengguna | Berdasarkan permission Core |
| Role & Permission | Role global, permission fitur, alias permission, dan akses aplikasi | Root/otoritas yang diberikan |
| Profile | Data pribadi, avatar, password, preferensi, dan sesi | Pemilik akun |
| Settings | Konfigurasi Core dan konfigurasi yang didelegasikan Sub-App | Berdasarkan permission |
| Application Registry | Daftar Sub-App, status, urutan, dan akses pengguna | Root/administrator aplikasi |
| Chat & Conversation | Percakapan umum dan context room yang dapat dipakai Sub-App | Peserta conversation |
| Notification | Notifikasi database dan realtime lintas aplikasi | Penerima notifikasi |
| Asset & File | Referensi file, asset link, dan upload bersama | Berdasarkan pemilik/context |
| Activity Log & Audit | Jejak aktivitas dan audit perubahan | Berdasarkan permission |
| Dashboard | Portal utama dan ringkasan akses pengguna | Semua akun aktif |
| Documentation | Dokumentasi penggunaan dan teknis aplikasi | Berdasarkan jenis dokumen |
| Maintenance | Operasi sistem yang diizinkan | Root saja |

## 3. Sub-App catalog

| Nama resmi | Nama UI | Backend key | Page route | API prefix | Status | Prefix tabel |
|---|---|---|---|---|---|---|
| KV Retail Task | KV Retail Task | `kv-retail` | `/kv-retail` | `/api/v1/kv-retail` | `ACTIVE` | `kv_retail_*` |
| Creative Report | Creative Report | `creative-report` | `/creative-report` | `/api/v1/creative-reports` | `ACTIVE` | `creative_report_*` |
| One Dashboard Design System | ODDS | `odds` | `/odds` | `/api/v1/odds` | `ACTIVE` | `odds_*` |
| Generator | Generator | `generator` | `/generator` | `/api/v1/generator` | `ACTIVE` | `generator_*` |
| Creative Artificial Intelligence | Creative AI | `cai` | `/creative-ai` | `/api/v1/cai` | `EXPERIMENTAL` | `cai_*` |
| Design Assets | Design Assets | `design-assets` | `/design-assets` | `/api/v1/design-assets` | `EXPERIMENTAL` | `design_assets_*` |

## 4. Generator catalog

Generator adalah Sub-App induk. Generator di dalamnya bukan Sub-App tingkat atas, tetapi tetap memiliki permission group, route, service, dan prefix data yang jelas.

| Generator | Backend key | Page route | API prefix | Status | Prefix tabel |
|---|---|---|---|---|---|
| Pricetag | `pricetag` | `/generator/pricetag` | `/api/v1/generator/pricetag` | `ACTIVE` | `generator_pricetag_*` |

Generator baru wajib ditambahkan ke tabel ini sebelum route atau tabelnya dibuat.

## 5. Status aplikasi

- `ACTIVE`: boleh dipakai pengguna sesuai permission dan wajib melewati quality gate production.
- `EXPERIMENTAL`: scope dapat berubah, akses dibatasi, dan tidak boleh dianggap kontrak production final.
- `DISABLED`: terdaftar tetapi tidak tersedia untuk pengguna.
- `DEPRECATED`: masih tersedia dalam compatibility window dan sedang menuju penghapusan.

## 6. Permission dan alias UI

Permission backend memakai key stabil:

```text
{application-key}.{resource}.{action}
```

Contoh:

| Key backend | Alias UI |
|---|---|
| `kv-retail.tasks.view` | Melihat Tugas KV Retail |
| `creative-report.assessments.update` | Mengisi Penilaian Creative |
| `odds.reports.view` | Melihat Laporan ODDS |
| `generator.pricetag.generate` | Membuat Pricetag |
| `cai.chat.use` | Menggunakan Creative AI |

Key backend tidak ditampilkan sebagai label utama kepada pengguna. UI mengambil `display_name`, `description`, dan grup permission dari metadata Core.

## 7. Aturan perubahan katalog

1. Nama resmi dan backend key tidak boleh diubah langsung di kode.
2. Perubahan dimulai dari keputusan owner dan pembaruan katalog.
3. Perubahan route atau API wajib memiliki compatibility plan.
4. Perubahan prefix tabel wajib memakai migration yang mempertahankan data.
5. Aplikasi eksperimen harus melalui keputusan tertulis sebelum menjadi `ACTIVE`.
