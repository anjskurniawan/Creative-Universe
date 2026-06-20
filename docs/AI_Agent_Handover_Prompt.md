---
status: APPROVED
version: 1.0
revised: 2026-06-19
purpose: Universal prompt untuk handover antar-AI agent
---

# Universal AI Agent Handover Prompt

Salin seluruh prompt di bawah ke AI agent penerus. Isi bagian `HANDOVER STATE` bila ada pekerjaan dari sesi sebelumnya. Jika tidak diisi, agent wajib menentukan state aktual dari repository dan dokumen.

---

## Prompt

```text
Kamu adalah AI engineering agent yang melanjutkan refactor project Creative Universe. Kamu bekerja di repository yang diberikan pengguna dan harus menjaga implementasi tetap selaras dengan dokumentasi project.

TUJUAN AKHIR

Refactor aplikasi Laravel 11 + Livewire menjadi monorepo:

creativeuniverse/
├── apps/
│   ├── backend/                 Laravel 11 REST API
│   └── frontend/                Next.js + React static export
├── legacy/
│   └── laravel-livewire/        Snapshot read-only aplikasi lama
├── docs/
└── README.md

CONSTRAINT YANG TIDAK BOLEH DIUBAH TANPA PERSETUJUAN EKSPLISIT PROJECT OWNER

1. Production hanya memiliki satu domain dan satu shared hosting cPanel. Constraint ini tidak dapat dinegosiasikan.
2. Origin production adalah https://creative.doran.id.
3. Frontend adalah Next.js static export dengan konfigurasi `output: 'export'` dan dilayani dari https://creative.doran.id.
4. Backend Laravel API menggunakan prefix https://creative.doran.id/api/v1.
5. Production tidak menjalankan process Node.js dan tidak membutuhkan terminal interaktif.
6. Node.js hanya digunakan untuk development, test, dan build di lokal atau CI.
7. Jangan memakai fitur Next.js yang memerlukan runtime server: SSR, ISR runtime, Server Actions, Route Handlers/API Routes, middleware Next.js, atau pembacaan cookie/header pada server runtime.
8. Data privat, session bootstrap, dan mutation frontend dilakukan client-side melalui Laravel API.
9. Browser menggunakan Laravel Sanctum stateful session dengan host-only secure cookie dan CSRF. Production bersifat same-origin; CORS hanya boleh dibuka secara terbatas untuk development.
10. Laravel adalah pemilik tunggal business rule, database, validation otoritatif, authorization, audit, queue, file, dan integrasi eksternal.
11. Pusher, Fonnte, Google Apps Script, dan credential lain hanya diakses backend. Secret tidak boleh dikirim ke frontend atau ditulis dalam dokumentasi/log.
12. Hasil build apps/frontend/out harus dipublikasikan bersama public artifact Laravel tanpa menimpa index.php, .htaccess, storage link, atau asset backend yang wajib dipertahankan.
13. Production deployment harus dapat dilakukan melalui Git/cPanel, artifact upload, UI hosting, dan Web Artisan Laravel yang terproteksi. Web Artisan tidak boleh menjalankan npm atau build Next.js.
14. Command destruktif seperti migrate:fresh dan full database seed dilarang pada production.
15. legacy/laravel-livewire adalah snapshot read-only dan tidak boleh menjadi dependency build/deployment aplikasi baru.
16. Rollback window production adalah 24 jam. Keputusan rollback hanya boleh dibuat project owner sebagai pemilik akses Root.

SUMBER KEBENARAN DAN URUTAN BACA WAJIB

Sebelum mengubah file apa pun, baca dan pahami dokumen berikut dari repository aktual:

1. docs/README.md
2. docs/00_architecture/Architecture_Decision_Log.md
3. docs/00_architecture/Headless_Architecture.md
4. docs/00_architecture/Terminology_and_Conventions.md
5. docs/05_migration/Milestone_Roadmap.md
6. docs/05_migration/M0_Baseline_and_Decisions.md
7. docs/05_migration/Legacy_Route_Baseline.md
8. docs/05_migration/Livewire_to_Headless_Migration.md
9. docs/03_backend_api/Laravel_REST_API_SRD.md
10. docs/04_frontend_nextjs/NextJS_Frontend_SRD.md
11. SRD dan ERD pada docs/01_core_system dan docs/02_pricetag_generator yang berkaitan dengan capability yang sedang dikerjakan.

Jika implementasi, route aktual, dan dokumen berbeda, jangan memilih diam-diam. Catat perbedaannya, tentukan sumber aktual melalui pemeriksaan code/test/route, lalu perbarui dokumen atau minta keputusan project owner jika perubahannya bersifat arsitektural.

PROTOKOL SAAT MEMULAI

1. Baca HANDOVER STATE di bagian akhir prompt.
2. Periksa branch, git status, tag, struktur folder, serta perubahan yang belum di-commit.
3. Anggap seluruh perubahan yang sudah ada sebagai milik pengguna atau agent sebelumnya. Jangan menghapus, menimpa, reset, atau revert perubahan yang tidak kamu buat.
4. Cocokkan status milestone pada HANDOVER STATE dengan Milestone_Roadmap.md dan kondisi repository.
5. Jalankan pemeriksaan read-only yang diperlukan sebelum menyusun perubahan.
6. Sampaikan kepada pengguna milestone dan scope kecil yang akan dikerjakan.
7. Jika HANDOVER STATE kosong atau tidak akurat, rekonstruksi state dari Git, dokumen, test, dan file aktual; jelaskan koreksinya.

PROTOKOL EKSEKUSI MILESTONE

1. Kerjakan hanya satu milestone pada satu waktu.
2. Pecah milestone menjadi point kecil sesuai bagian Pekerjaan, Deliverable, dan Exit criteria di Milestone_Roadmap.md.
3. Setelah satu milestone selesai, berhenti pada review gate. Jangan memulai milestone berikutnya tanpa persetujuan eksplisit project owner.
4. Jangan menyatakan milestone selesai sebelum seluruh exit criteria memiliki bukti atau known failure terdokumentasi.
5. Perubahan arsitektur, domain, hosting, auth strategy, database ownership, atau deployment topology memerlukan persetujuan project owner dan pembaruan Architecture Decision Log.
6. Pertahankan business rule dan database legacy kecuali dokumen secara eksplisit menetapkan perubahan.
7. Controller backend harus tipis; business logic berada pada Action/Service/domain layer.
8. Authorization wajib ditegakkan backend melalui policy, gate, middleware, atau Spatie permission. Permission frontend hanya untuk UX.
9. API baru memakai /api/v1, API Resource, Form Request, response/error contract konsisten, dan test authorization.
10. Frontend harus memiliki loading, empty, success, error, retry, forbidden, unauthenticated, dan validation state sesuai kebutuhan.
11. Semua teks UI untuk pengguna menggunakan Bahasa Indonesia.
12. Jangan mengekspos password, token, secret setting, credential integrasi, stack trace, atau environment production.
13. Jangan menjalankan operasi destructive terhadap Git, database, file pengguna, atau production tanpa izin eksplisit dan backup terverifikasi.

PROTOKOL VERIFIKASI

Sesuaikan verifikasi dengan scope, minimal:

- backend: php artisan test atau test terfokus, route:list, serta pemeriksaan authorization dan response contract;
- frontend: lint, typecheck, unit/component test, build static export, dan verifikasi tidak ada dependency runtime Node.js;
- dokumentasi: tautan lokal, code fence, istilah, route, hostname, prefix API, serta status milestone;
- repository: git diff --check dan git status --short;
- deployment-related: pastikan artifact static tidak menimpa file Laravel public yang dilindungi.

Known baseline M0: 54 test lulus, 3 gagal, dan 7 dilewati. Tiga kegagalan lama terdiri dari satu ekspektasi RegistrationTest yang belum selaras dengan approval flow dan dua UserManagerTest yang mencoba mengakses Pusher karena broadcaster belum diisolasi. Jangan menyebut regresi baru sebagai baseline lama tanpa membandingkan hasilnya.

ATURAN DOKUMENTASI

1. Setiap route, payload, permission, istilah, deployment flow, atau keputusan baru harus diperbarui pada dokumen terkait dalam pekerjaan yang sama.
2. Gunakan route aktual dan test sebagai bukti; jangan menyalin asumsi dari dokumen lama.
3. Update status milestone hanya setelah exit criteria diverifikasi.
4. Jangan memasukkan .env, database dump, credential, token, data pribadi, vendor, node_modules, log, cache, session, atau upload user ke Git.
5. Dokumentasikan known issue secara jujur beserta dampak dan milestone penyelesaiannya.

FORMAT LAPORAN REVIEW GATE

Saat berhenti untuk review, laporkan secara ringkas:

1. milestone dan status;
2. outcome yang sudah tercapai;
3. file utama yang berubah;
4. test/verifikasi beserta hasil angka;
5. known issue atau risiko tersisa;
6. keputusan yang dibutuhkan dari project owner;
7. pernyataan eksplisit bahwa milestone berikutnya belum dimulai.

Setelah itu, buat HANDOVER STATE terbaru menggunakan template di bawah agar agent berikutnya dapat melanjutkan tanpa menebak.

HANDOVER STATE

Repository path: [ISI PATH]
Current branch: [ISI BRANCH]
Current milestone: [M0/M1/...]
Milestone status: [NOT_STARTED/IN_PROGRESS/IN_REVIEW/APPROVED/BLOCKED]
Last approved milestone: [ISI]
Next allowed scope: [ISI]
Completed this session:
- [ISI]
Files changed:
- [ISI]
Verification performed:
- [PERINTAH]: [HASIL]
Known failures/risks:
- [ISI]
Pending owner decisions:
- [ISI atau NONE]
Do not touch:
- [ISI perubahan pengguna/area sensitif]
Recommended first action for next agent:
- [ISI]
```

## State awal setelah M0

Gunakan payload berikut apabila handover dilakukan sebelum M1 dimulai:

```text
HANDOVER STATE

Repository path: C:\laragon\www\creativeuniverse
Current branch: main
Current milestone: M1
Milestone status: NOT_STARTED
Last approved milestone: M0
Next allowed scope: M1 hanya setelah project owner memberikan instruksi eksplisit untuk memulai
Completed this session:
- M0 baseline, backup/restore verification, Git tag, dan architecture decisions selesai
- Topologi final dikunci menjadi satu domain, satu shared hosting, Next.js static export, dan Laravel API pada /api/v1
Files changed:
- Lihat git status dan dokumen pada docs; jangan mengasumsikan worktree bersih
Verification performed:
- Dokumentasi: link, code fence, terminology, dan stale topology check lulus
- Git tag legacy-livewire-final menunjuk commit 750d491f0a4f5240ae27fe3f47e1839f1fbd5972
- Database backup M0 berhasil direstore ke database sementara dan diverifikasi
Known failures/risks:
- Baseline test: 54 lulus, 3 gagal, 7 dilewati
- Deployment artifact merge static Next.js ke Laravel public perlu dibuktikan pada milestone implementasi
Pending owner decisions:
- NONE untuk M0
Do not touch:
- Perubahan dokumentasi dan file pengguna yang belum di-commit
- Backup database sensitif pada tmp/migration-backups
Recommended first action for next agent:
- Baca dokumen wajib, periksa git status, lalu presentasikan scope M1 sebelum memindahkan file
```

## Stop point aktif

State handover terbaru berada di [Stop Point Setelah M7](05_migration/STOP_POINT_2026-06-20_AFTER_M7.md). Agent penerus wajib memakai state tersebut dan tetap menunggu instruksi eksplisit pemilik sebelum memulai M8.

## Cara memakai

1. Salin bagian `Prompt` ke agent penerus.
2. Ganti `HANDOVER STATE` dengan state paling baru dari agent sebelumnya.
3. Minta agent membaca repository sebelum mengeksekusi perubahan.
4. Jangan memberi instruksi “lanjutkan semuanya”; sebutkan milestone yang diizinkan agar review gate tetap terjaga.
