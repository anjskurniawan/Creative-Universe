<?php

/*
|--------------------------------------------------------------------------
| Web Routes — SRD v6.2 Seksi 3.2
|--------------------------------------------------------------------------
|
| File ini hanya bertugas menginclude semua file route modul.
| Setiap Sub-App memiliki route file tersendiri di routes/modules/.
|
*/

// Core (Master App) routes
require __DIR__.'/modules/core.php';

// Web Artisan routes (remote artisan commands)
require __DIR__.'/web_artisan.php';

// Auth routes (dari Laravel Breeze)
require __DIR__.'/auth.php';

// Tambahkan baris baru per Sub-App baru:
// require __DIR__.'/modules/odds.php';
