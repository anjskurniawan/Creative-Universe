<?php

use App\Http\Controllers\Core\DashboardController;
use App\Http\Controllers\Core\UserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Core Routes — SRD v6.2 Seksi 3.2
|--------------------------------------------------------------------------
|
| Route untuk Master App (Core). Prefix: none (root level).
| Middleware: auth + verified-active untuk semua route yang butuh akun aktif.
|
*/

// ─── Halaman Landing (Guest) ────────────────────────────
Route::get('/', function () {
    return view('ui_test');
})->name('home');

// ─── Halaman Pending Approval ────────────────────────────
// Akses: user yang sudah login tapi is_active = false
Route::get('/pending', function () {
    return view('pages.core.pending');
})->middleware('auth')->name('pending');

// ─── Route yang butuh auth + akun aktif ────────────────────
Route::middleware(['auth', 'verified-active'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Profile (dari Breeze, sudah ada)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ─── Route Superadmin: User Management ────────────────────
Route::middleware(['auth', 'verified-active'])
    ->prefix('users')
    ->name('core.users.')
    ->group(function () {
        Route::get('/', [UserController::class, 'index'])
            ->middleware('can:manage-users')
            ->name('index');

        Route::get('/pending', [UserController::class, 'pending'])
            ->middleware('can:approve-users')
            ->name('pending');

        Route::post('/{user}/approve', [UserController::class, 'approve'])
            ->middleware('can:approve-users')
            ->name('approve');

        Route::post('/{user}/reject', [UserController::class, 'reject'])
            ->middleware('can:approve-users')
            ->name('reject');
    });

// Dynamic Role Management
Route::get('/roles', fn () => view('pages.core.roles.index'))
    ->middleware(['auth', 'verified-active', 'can:manage-roles'])
    ->name('core.roles.index');
