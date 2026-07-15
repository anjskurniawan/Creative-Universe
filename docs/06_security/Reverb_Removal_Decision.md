---
title: "Reverb Removal Decision"
status: "COMPLETED"
version: "1.0"
created: "2026-06-27"
revised: "2026-07-15"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
scope: "broadcasting dependency management"
---

# Reverb Removal Decision

## 1. Purpose
Mendokumentasikan alasan historis, bukti teknis, serta mitigasi risiko terkait rencana pencabutan (uninstall) modul `laravel/reverb` dari repositori backend Creative Universe, mengingat Pusher telah resmi digunakan sebagai mesin broadcasting utama.

## 2. Current Broadcasting Decision
Arsitektur monorepo Creative Universe secara teknis mendukung mekanisme *broadcasting* event secara realtime. Saat ini, variabel lingkungan di backend dan frontend dikonfigurasi menggunakan driver `pusher`. Modul `laravel/reverb` juga sempat terinstal namun tidak berjalan atau melayani koneksi socket.

## 3. Evidence That Pusher Is Active
1. Berkas `.env` dan `config/broadcasting.php` menggunakan driver `pusher`.
2. Frontend Next.js di `apps/frontend/src/lib/echo.ts` menginisialisasi client `Echo` menggunakan driver `pusher` (melalui Pusher JS).
3. Transmisi realtime (misal untuk chat atau notifikasi ODDS) berfungsi secara mulus menggunakan kredensial Pusher terenkripsi melalui port 443 standar HTTPS/WSS.

## 4. Evidence That Reverb Is Redundant
1. Perintah `php artisan reverb:start` tidak dikelola oleh supervisor/daemon di environment produksi yang dirancang.
2. Port 8080 (default reverb) tidak dibuka atau diproksikan dari frontend cPanel.
3. Kredensial Reverb di `.env` (seperti `REVERB_APP_ID`) identik dengan Pusher atau tidak disuplai nilai yang valid untuk server mandiri.

## 5. Risk of Keeping Reverb
1. **Bloat:** Menambah beban ukuran direktori `vendor` backend yang diekspor.
2. **Security Confusion:** Auditor keamanan mungkin melihat adanya dual-stack socket server dan kebingungan memetakan port mana yang harus diamankan (padahal Reverb mati).
3. **Maintenance:** Pembaruan rutin `composer update` akan terus menarik rilis versi terbaru Reverb, memperlambat proses pipeline/CI.

## 6. Risk of Removing Reverb
1. Jika suatu saat tim memutuskan berhenti menggunakan Pusher cloud (untuk menghindari biaya), Reverb harus diinstal ulang dan dikonfigurasi dari awal secara mandiri pada server (VPS/Dedicated).

## 7. Recommended Removal Plan
Hapus dependensi secara permanen dari composer backend.
- Command yang akan dijalankan: `composer remove laravel/reverb` (Direkomendasikan di Batch 13).
- Bersihkan konfigurasi dari `config/broadcasting.php` (menghapus blok `reverb`).
- Bersihkan file rute jika rute `routes/channels.php` memuat *echo/reverb specific route* yang tidak digunakan.

## 8. Required Verification Before Composer Remove
- Pastikan semua tes unit (`php artisan test`) terutama notifikasi (`NotificationApiTest`) masih lulus tanpa kehadiran Reverb.
- Pastikan frontend Echo client tidak memanggil `wsHost` atau setelan server Reverb secara *hardcode*.

## 9. Final Decision
Project Owner mengonfirmasi pada 2026-07-15 bahwa realtime sepenuhnya menggunakan Pusher Cloud. `laravel/reverb`, konfigurasi Reverb, dan dependency turunannya telah dihapus.

## 10. Next Actions
- Pertahankan Pusher sebagai satu-satunya konfigurasi broadcasting production.
- Instalasi Reverb kembali membutuhkan keputusan arsitektur baru dan hosting yang mendukung proses WebSocket persisten.
