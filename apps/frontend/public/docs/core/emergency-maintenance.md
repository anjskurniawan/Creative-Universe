# Emergency Maintenance

**Owner:** Core  
**Access:** Root only  
**Status:** Review

Maintenance Darurat adalah kontrol global untuk mengisolasi aplikasi ketika terjadi insiden kritis. Kontrol tersedia pada route `/maintenance` dan hanya dapat dibaca atau diubah oleh Root.

## Perilaku

- Nilai global disimpan pada `app_settings` dengan key `emergency_maintenance_mode`.
- Saat aktif, Root tetap memiliki akses normal ke seluruh aplikasi dan API.
- Pengguna terautentikasi selain Root melihat `UniversalErrorView`.
- Backend mengembalikan HTTP `503` dengan code `EMERGENCY_MAINTENANCE` untuk request API non-Root.
- Endpoint autentikasi dan health tetap tersedia untuk identifikasi sesi, logout, dan pemeriksaan layanan.
- Tombol **Coba lagi** pada error view memuat ulang sesi untuk memeriksa apakah akses sudah dipulihkan.

## Endpoint

- `GET /api/v1/maintenance/emergency`
- `PUT /api/v1/maintenance/emergency`

Keduanya membutuhkan autentikasi, permission `run-artisan`, dan role `Root`.

## Audit

Aktivasi dan deaktivasi dicatat pada activity log `maintenance-ui`, termasuk actor, alamat IP, dan status baru.

## Pemulihan

Root membuka `/maintenance`, memilih **Nonaktifkan Darurat**, lalu memastikan status berubah menjadi nonaktif. Pengguna dapat memilih **Coba lagi** atau memuat ulang halaman untuk memulihkan akses.
