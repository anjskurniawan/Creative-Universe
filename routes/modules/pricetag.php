<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Pricetag Generator Sub-App Routes — SRD v1.0 Seksi 2 & 4
|--------------------------------------------------------------------------
|
| Route untuk Sub-App Pricetag Generator. Prefix: /pricetag.
| Middleware: auth, verified-active (akun aktif), app:pricetag (Spatie permission)
|
*/

Route::prefix('pricetag')
    ->middleware(['auth', 'verified-active', 'app:pricetag'])
    ->name('pricetag.')
    ->group(function () {

        // Redirect root prefix to search
        Route::get('/', function () {
            return redirect()->route('pricetag.search');
        });

        // Halaman Cari Pricetag (Semua User Sub-App)
        Route::get('/search', function () {
            return view('pages.pricetag.search');
        })->name('search');

        // Halaman Generator Pricetag (Semua User Sub-App)
        Route::get('/generator', function () {
            return view('pages.pricetag.generator');
        })->name('generator');

        // Halaman Riwayat Generate (Semua User Sub-App)
        Route::get('/history', function () {
            return view('pages.pricetag.history');
        })->name('history');

        // Halaman Manajemen Database (Hanya Superadmin / permission: pricetag.manage)
        Route::get('/database', function () {
            return view('pages.pricetag.database');
        })->middleware('can:pricetag.manage')->name('database');

    });
