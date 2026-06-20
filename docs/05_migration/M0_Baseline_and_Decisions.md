---
status: APPROVED
milestone: M0
executed_at: 2026-06-19
owner: Divisi Creative - PT Doran Sukses Indonesia (JETE)
---

# M0 - Baseline dan keputusan sebelum refactor

## Hasil

Baseline teknis dan jalur pemulihan aplikasi Laravel Livewire sudah dibuat dan diverifikasi. Topologi hosting, hostname, serta rollback governance disetujui project owner pada 2026-06-19. Milestone M0 ditutup dan M1 belum dimulai.

Tidak ada source code aplikasi yang diubah pada milestone ini. Perubahan hanya berupa dokumentasi, aturan ignore untuk backup sensitif, backup lokal, dan tag Git.

## 1. Baseline Git

| Item | Nilai |
|---|---|
| Branch | `main` |
| Commit legacy terakhir | `750d491f0a4f5240ae27fe3f47e1839f1fbd5972` |
| Commit subject | `Pricetag: improve generator flow, search, and docs` |
| Tag annotated | `legacy-livewire-final` |
| Status tag | Terverifikasi menunjuk commit legacy terakhir |

Worktree belum bersih karena paket dokumentasi refactor masih belum di-commit. Perubahan tersebut dipertahankan dan dicatat; tag sengaja menunjuk commit source legacy terakhir, bukan perubahan dokumentasi yang belum di-commit.

Perintah verifikasi:

```powershell
git show --no-patch legacy-livewire-final
git status --short
```

## 2. Runtime legacy

| Komponen | Baseline lokal |
|---|---|
| Laravel | 11.54.0 |
| PHP | 8.2.31 |
| Composer | 2.10.1 |
| Livewire | 3.6.0 |
| Spatie Permission | 6.25.0 |
| Node.js | 24.16.0 |
| npm | 11.13.0 |
| Database | MySQL 8.4.3 |
| Queue | Database |
| Session | Database |
| Cache | Database |
| Broadcasting | Pusher |

Catatan Windows: wrapper `npm.ps1` diblokir oleh execution policy lokal, tetapi `npm.cmd` berfungsi. Hal ini bukan kendala production atau masalah instalasi Node.js.

## 3. Automated test baseline

Perintah yang dijalankan:

```powershell
php artisan test
```

Hasil aktual:

| Status | Jumlah |
|---|---:|
| Lulus | 54 |
| Gagal | 3 |
| Dilewati | 7 |
| Assertions | 161 |
| Durasi | 44,56 detik |

Kegagalan lama yang terdokumentasi:

1. `RegistrationTest > new users can register`: test masih mengharapkan user langsung terautentikasi, sedangkan flow aplikasi saat ini memakai approval/pending account.
2. Dua skenario `UserManagerTest`: test mencoba mengirim broadcast ke Pusher karena `BROADCAST_CONNECTION` belum dioverride pada `phpunit.xml`; koneksi eksternal tidak tersedia saat test.

Tujuh test auth dilewati secara sengaja karena email verification dan reset password token bawaan telah digantikan approval flow serta WhatsApp OTP.

Baseline test memakai SQLite in-memory, queue `sync`, dan mailer `array`. Perbaikan isolasi broadcasting serta penyelarasan test registrasi dijadwalkan sebelum parity gate, tanpa mengubah fakta baseline M0.

## 4. Route baseline

`php artisan route:list --json` berhasil dijalankan pada 2026-06-19.

| Metrik | Jumlah |
|---|---:|
| Total route | 66 |
| Route dengan middleware auth | 45 |
| Public atau middleware lain | 21 |
| `GET|HEAD` | 45 |
| `POST` | 14 |
| `DELETE` | 4 |
| `PATCH` | 1 |
| `PUT` | 1 |
| Kombinasi `GET|POST|HEAD` | 1 |

Daftar route fungsional dan pengecualian package tersedia pada [Legacy Route Baseline](Legacy_Route_Baseline.md).

## 5. Database dan backup

Database sumber saat baseline memiliki 21 tabel dengan ukuran sekitar 896 KB. Seluruh 13 migration berstatus `Ran`.

Backup lokal:

| Item | Nilai |
|---|---|
| File | `tmp/migration-backups/legacy-livewire-m0-2026-06-19.sql` |
| Ukuran | 45.199 byte |
| Struktur tabel pada dump | 21 |
| SHA-256 | `3408F4499A5EA9D545EA22597BE859581A162CD6715908D6F320E3105BBBF753` |
| Git | Diabaikan melalui `/tmp/migration-backups/` |

Restore test dilakukan ke database sementara yang terisolasi. Hasil restore berisi 21 tabel, 13 migration, 7 role, dan 7 user. Database verifikasi kemudian berhasil dihapus. Database utama tidak dimodifikasi oleh restore test.

Perintah verifikasi file:

```powershell
Get-FileHash tmp\migration-backups\legacy-livewire-m0-2026-06-19.sql -Algorithm SHA256
```

Backup mengandung data aplikasi dan tidak boleh di-commit, dikirim melalui kanal publik, atau ditempatkan di document root hosting.

## 6. Schema, role, dan permission

Baseline mencakup tabel user/auth, database cache/session/queue, activity log, notification, Spatie permission, asset link, serta tabel Pricetag.

Tujuh protected role:

- `Root`
- `Manajer`
- `Supervisor`
- `Designer`
- `Client`
- `Retail Admin`
- `Retail Staff`

Delapan permission baseline:

- `access-core`
- `manage-users`
- `manage-roles`
- `approve-users`
- `view-logs`
- `run-artisan`
- `access-pricetag`
- `pricetag.manage`

## 7. Queue, scheduler, dan integrasi

Queue workload:

- `GeneratePricetagChunkJob`;
- notification registrasi, approval, dan rejection.

Scheduler baseline:

- pembersihan activity log dan stale record setiap bulan;
- pembersihan notification, failed job, reset token, serta temporary upload setiap hari;
- `queue:work --stop-when-empty` setiap menit.

Integrasi eksternal:

- Pusher untuk broadcasting;
- Fonnte untuk WhatsApp;
- Google Apps Script untuk Pricetag generation;
- Google Drive link untuk hasil generation;
- filesystem public untuk avatar.

Credential tidak dicatat dalam dokumen. Inventory hanya memakai nama environment variable dari `.env.example`.

## 8. Risiko legacy yang dibawa ke migrasi

1. Endpoint Web Artisan legacy masih memakai method `GET` dan menyediakan `migrate:fresh` serta full database seed. Target backend harus menggunakan `POST`, allowlist, audit, rate limit, dan production guard.
2. Test suite belum mengisolasi broadcaster sehingga dua test mencoba mengakses Pusher sungguhan.
3. Deployment cPanel saat ini melakukan `rsync` menuju `/home/creativedoran/creative.doran.id`; konfigurasi ini harus diganti saat struktur monorepo dibuat.
4. Queue worker bergantung pada scheduler per menit; strategi target harus tetap dapat dioperasikan melalui UI hosting tanpa terminal interaktif.

## 9. Exit criteria M0

| Kriteria | Status | Bukti |
|---|---|---|
| Commit legacy dapat dipulihkan | Lulus | Tag `legacy-livewire-final` |
| Backup database tersedia dan dapat dibaca | Lulus | Dump, checksum, dan restore test |
| Route aktual tercatat | Lulus | 66 route dan route baseline |
| Test baseline tercatat | Lulus dengan known failures | 54 lulus, 3 gagal, 7 dilewati |
| Runtime, schema, role, queue, scheduler, integrasi tercatat | Lulus | Bagian 2, 6, dan 7 |
| Hosting dan hostname final disetujui | Lulus | Decision log ADR-004 dan ADR-005 |
| Rollback window dan PIC ditetapkan | Lulus | Decision log ADR-007 |

## 10. Keputusan review

Project owner menyetujui keputusan berikut pada 2026-06-19:

1. Laravel API dan static export Next.js ditempatkan pada satu shared hosting cPanel;
2. satu-satunya hostname production adalah `creative.doran.id`, dengan API pada `/api/v1`;
3. production tidak menjalankan process Node.js; build Next.js dilakukan di lokal atau CI;
4. rollback window adalah 24 jam setelah cutover;
5. keputusan rollback berada pada project owner sebagai pemilik akses `Root`.

Status M0 adalah `APPROVED`. Pekerjaan tetap berhenti sebelum M1 sampai project owner memberi instruksi untuk melanjutkan.
