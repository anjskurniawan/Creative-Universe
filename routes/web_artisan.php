<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Artisan Routes — SRD v6.2 Seksi 8.1
|--------------------------------------------------------------------------
|
| Remote artisan commands untuk production (Shared Hosting tanpa SSH).
| Dilindungi oleh X-Artisan-Token header + opsional IP whitelist.
|
*/

Route::middleware(['artisan-token'])->prefix('_cmd')->group(function () {
    Route::get('/migrate', function () {
        Artisan::call('migrate --force');
        return response()->json(['output' => Artisan::output()]);
    });

    Route::get('/storage-link', function () {
        Artisan::call('storage:link');
        return response()->json(['output' => Artisan::output()]);
    });

    Route::get('/clear-cache', function () {
        Artisan::call('optimize:clear');
        return response()->json(['output' => Artisan::output()]);
    });

    Route::get('/seed-permissions', function () {
        Artisan::call('db:seed', ['--class' => 'RolePermissionSeeder', '--force' => true]);
        return response()->json(['output' => Artisan::output()]);
    });

    Route::get('/queue-restart', function () {
        Artisan::call('queue:restart');
        return response()->json(['output' => Artisan::output()]);
    });
});
