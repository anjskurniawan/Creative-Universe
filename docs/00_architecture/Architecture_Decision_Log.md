---
status: APPROVED
version: 1.1
revised: 2026-06-19
---

# Architecture Decision Log

Dokumen ini mencatat keputusan arsitektur yang mengikat refactor Creative Universe. Seluruh keputusan M0 telah disetujui project owner pada 2026-06-19.

## ADR-001 - Monorepo headless

- Status: `ACCEPTED`
- Keputusan: repository memakai `apps/backend`, `apps/frontend`, `legacy/laravel-livewire`, dan `docs`.
- Konsekuensi: snapshot legacy bersifat read-only; build dan deployment aplikasi baru hanya berasal dari folder `apps`.

## ADR-002 - Kepemilikan business rule

- Status: `ACCEPTED`
- Keputusan: Laravel tetap menjadi pemilik tunggal business rule, database, authorization, audit, queue, dan integrasi eksternal.
- Konsekuensi: Next.js hanya mengonsumsi kontrak API dan tidak menyimpan credential layanan backend.

## ADR-003 - Autentikasi browser

- Status: `ACCEPTED`
- Keputusan: browser menggunakan Laravel Sanctum stateful cookie dan CSRF, bukan bearer token sebagai default.
- Konsekuensi: frontend dan API memakai origin yang sama, `https://creative.doran.id`. Session menggunakan host-only secure cookie; production tidak membutuhkan CORS lintas-origin.

## ADR-004 - Topologi hosting production

- Status: `ACCEPTED`
- Keputusan: Laravel API dan hasil static export Next.js ditempatkan pada satu shared hosting cPanel di `creative.doran.id`.
- Batasan tetap: project hanya memiliki satu domain dan satu hosting; batasan ini tidak dapat diubah. Production tidak menjalankan process Node.js dan tidak bergantung pada terminal interaktif.
- Konsekuensi: Node.js hanya digunakan saat development/build di lokal atau CI. Artifact `apps/frontend/out` digabungkan secara terkontrol ke public artifact Laravel saat deployment.

## ADR-005 - Hostname production

- Status: `ACCEPTED`
- Frontend: `https://creative.doran.id`.
- Backend API: `https://creative.doran.id/api/v1`.
- Konsekuensi: tidak ada subdomain API, DNS tambahan, atau CORS lintas-origin pada production. Development origin tetap dibatasi secara eksplisit jika frontend dan backend memakai port berbeda.

## ADR-006 - Deployment tanpa terminal

- Status: `ACCEPTED`
- Keputusan frontend: Next.js memakai `output: 'export'`; build dilakukan di lokal atau CI dan menghasilkan artifact statis `out`.
- Keputusan backend: deployment memakai Git/cPanel atau artifact upload; operasi Laravel yang diperlukan tanpa terminal memakai Web Artisan terproteksi.
- Packaging: isi `out` dipublikasikan bersama Laravel `public` tanpa menimpa `index.php`, `.htaccess`, storage link, atau asset backend.
- Guard: Web Artisan tidak menjalankan npm/Next.js dan tidak menyediakan command destruktif pada production.

## ADR-007 - Rollback governance

- Status: `ACCEPTED`
- Rollback window: 24 jam setelah production cutover.
- PIC keputusan: project owner sebagai pemilik akses `Root`.
- Trigger: error autentikasi massal, pelanggaran authorization, kehilangan/korupsi data, queue kritis berhenti, atau integrasi Pricetag gagal tanpa workaround.
- Mekanisme: kembalikan routing frontend ke aplikasi legacy, hentikan write pada aplikasi baru jika diperlukan, dan pulihkan database hanya melalui backup yang telah diverifikasi.
