# cPanel Shared Hosting Deployment Runbook

## Arsitektur produksi

- Laravel melayani REST API, session, storage, queue, scheduler, dan broadcasting server-side.
- Next.js dibangun sebagai static export dan hasil `apps/frontend/out` disalin ke `apps/backend/public`.
- Pusher Cloud adalah satu-satunya provider realtime. Laravel Reverb tidak digunakan.
- File aplikasi menggunakan Laravel local storage; S3 belum diaktifkan.

## Persiapan artefak

1. Jalankan `composer install --no-dev --optimize-autoloader` pada backend production artifact.
2. Jalankan `npm ci` dan `npm run build` pada frontend.
3. Pastikan hasil build memiliki `/creative-ai`, `/design-assets`, `/generator/pricetag`, `/kv-retail`, `/creative-report`, dan `/odds`.
4. Salin isi `apps/frontend/out` ke `apps/backend/public` tanpa menimpa `index.php`, `.htaccess`, atau symbolic link `storage`.

## Environment minimum

- `APP_ENV=production`, `APP_DEBUG=false`, dan `APP_URL` HTTPS yang benar.
- Database production dan kredensial yang tidak disimpan di repository.
- `SESSION_SECURE_COOKIE=true` dan domain session sesuai host.
- `BROADCAST_CONNECTION=pusher` serta seluruh `PUSHER_APP_*`.
- Frontend memakai `NEXT_PUBLIC_PUSHER_KEY` dan `NEXT_PUBLIC_PUSHER_CLUSTER` yang sama.
- Token maintenance harus panjang, unik, dan disimpan di environment cPanel.

## Urutan release

1. Backup database dan folder `storage/app`.
2. Aktifkan maintenance mode bila perubahan schema berisiko.
3. Upload backend artifact dan frontend static export.
4. Jalankan migration dengan `php artisan migrate --force`.
5. Jalankan `php artisan storage:link` bila link belum tersedia.
6. Jalankan `php artisan optimize` dan restart queue.
7. Nonaktifkan maintenance mode.
8. Verifikasi `/api/v1/health`, login, upload file, Chat, Notification, dan satu alur utama setiap Sub-App.

## Cron cPanel

Scheduler dijalankan setiap menit:

```text
* * * * * /usr/local/bin/php /home/ACCOUNT/path/to/artisan schedule:run >> /dev/null 2>&1
```

Jika cPanel tidak menyediakan daemon queue, jalankan queue worker melalui cron pendek dengan batas waktu:

```text
* * * * * /usr/local/bin/php /home/ACCOUNT/path/to/artisan queue:work --stop-when-empty --tries=3 >> /dev/null 2>&1
```

Path PHP dan project harus disesuaikan dengan akun hosting.

## Rollback

1. Aktifkan maintenance mode.
2. Pulihkan artifact aplikasi sebelumnya.
3. Jalankan migration rollback hanya jika migration tersebut telah diverifikasi reversible dan data aman.
4. Jika tidak, pulihkan backup database lengkap.
5. Pulihkan `storage/app`, bersihkan cache, restart queue, lalu lakukan smoke test.

## Known security upgrade

Audit 2026-07-15 telah memperbarui Guzzle dan PSR-7 ke versi aman. Composer masih melaporkan advisory Laravel yang perbaikannya tersedia pada Laravel 12.60/12.61.1 atau lebih baru. Upgrade mayor Laravel 11 ke 12 harus dilakukan sebagai pekerjaan terpisah dengan compatibility test penuh, bukan sebagai cleanup dependency otomatis.
