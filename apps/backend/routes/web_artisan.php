<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Artisan Routes — SRD v6.2 Seksi 8.1
|--------------------------------------------------------------------------
|
| Remote artisan commands untuk production (Shared Hosting tanpa SSH).
| Dilindungi oleh X-Artisan-Token header, IP whitelist, rate limit,
| dan environment guard. Setiap eksekusi dicatat pada activity_log.
|
*/

Route::middleware(['artisan-token', 'throttle:5,1'])->prefix('_cmd')->group(function () {
    Route::post('/migrate', function () {
        Artisan::call('migrate --force');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'migrate', 'output' => $output])
            ->log('Eksekusi remote command: migrate');

        return response()->json(['output' => $output]);
    });

    Route::post('/migrate-fresh', function () {
        if (app()->environment('production')) {
            activity()
                ->tap(fn ($act) => $act->log_name = 'web-artisan')
                ->withProperties(['ip' => request()->ip(), 'command' => 'migrate:fresh', 'status' => 'blocked'])
                ->log('Percobaan eksekusi remote command terlarang di production: migrate:fresh');

            return response()->json(['message' => 'Tindakan ini dilarang pada environment production.'], 403);
        }

        Artisan::call('migrate:fresh', ['--force' => true]);
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'migrate:fresh', 'output' => $output])
            ->log('Eksekusi remote command: migrate:fresh');

        return response()->json(['output' => $output]);
    });

    Route::post('/storage-link', function () {
        Artisan::call('storage:link');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'storage:link', 'output' => $output])
            ->log('Eksekusi remote command: storage:link');

        return response()->json(['output' => $output]);
    });

    Route::post('/clear-cache', function () {
        Artisan::call('optimize:clear');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'optimize:clear', 'output' => $output])
            ->log('Eksekusi remote command: optimize:clear');

        return response()->json(['output' => $output]);
    });

    Route::post('/seed-permissions', function () {
        Artisan::call('db:seed', ['--class' => 'RolePermissionSeeder', '--force' => true]);
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'db:seed --class=RolePermissionSeeder', 'output' => $output])
            ->log('Eksekusi remote command: db:seed --class=RolePermissionSeeder');

        return response()->json(['output' => $output]);
    });

    Route::post('/seed-odds-categories', function () {
        Artisan::call('db:seed', ['--class' => 'OddsCategorySeeder', '--force' => true]);
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'db:seed --class=OddsCategorySeeder', 'output' => $output])
            ->log('Eksekusi remote command: db:seed --class=OddsCategorySeeder');

        return response()->json(['output' => $output]);
    });

    Route::post('/seed-test-accounts', function () {
        Artisan::call('db:seed', ['--class' => 'LocalTestAccountsSeeder', '--force' => true]);
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'db:seed --class=LocalTestAccountsSeeder', 'output' => $output])
            ->log('Eksekusi remote command: db:seed --class=LocalTestAccountsSeeder');

        return response()->json(['output' => $output]);
    });

    Route::post('/seed-simulation-demo', function () {
        Artisan::call('db:seed', ['--class' => 'OddsSimulationDemoSeeder', '--force' => true]);
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'db:seed --class=OddsSimulationDemoSeeder', 'output' => $output])
            ->log('Eksekusi remote command: db:seed --class=OddsSimulationDemoSeeder');

        return response()->json(['output' => $output]);
    });

    Route::post('/seed', function () {
        if (app()->environment('production')) {
            activity()
                ->tap(fn ($act) => $act->log_name = 'web-artisan')
                ->withProperties(['ip' => request()->ip(), 'command' => 'db:seed', 'status' => 'blocked'])
                ->log('Percobaan eksekusi remote command terlarang di production: db:seed (full seeder)');

            return response()->json(['message' => 'Tindakan ini dilarang pada environment production.'], 403);
        }

        Artisan::call('db:seed', ['--force' => true]);
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'db:seed', 'output' => $output])
            ->log('Eksekusi remote command: db:seed (full seeder)');

        return response()->json(['output' => $output]);
    });

    Route::post('/queue-restart', function () {
        Artisan::call('queue:restart');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'queue:restart', 'output' => $output])
            ->log('Eksekusi remote command: queue:restart');

        return response()->json(['output' => $output]);
    });

    Route::post('/queue-work', function () {
        Artisan::call('queue:work', ['--stop-when-empty' => true]);
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'queue:work --stop-when-empty', 'output' => $output])
            ->log('Eksekusi remote command: queue:work --stop-when-empty');

        return response()->json(['output' => $output]);
    });

    Route::post('/clean-activity-log', function () {
        Artisan::call('clean:activity-log');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'clean:activity-log', 'output' => $output])
            ->log('Eksekusi remote command: clean:activity-log');

        return response()->json(['output' => $output]);
    });

    Route::post('/clean-notifications', function () {
        Artisan::call('clean:notifications');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'clean:notifications', 'output' => $output])
            ->log('Eksekusi remote command: clean:notifications');

        return response()->json(['output' => $output]);
    });

    Route::post('/clean-failed-jobs', function () {
        Artisan::call('clean:failed-jobs');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'clean:failed-jobs', 'output' => $output])
            ->log('Eksekusi remote command: clean:failed-jobs');

        return response()->json(['output' => $output]);
    });

    Route::post('/clean-temp-uploads', function () {
        Artisan::call('clean:temp-uploads');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'clean:temp-uploads', 'output' => $output])
            ->log('Eksekusi remote command: clean:temp-uploads');

        return response()->json(['output' => $output]);
    });

    Route::post('/clean-stale-records', function () {
        Artisan::call('clean:stale-records');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'clean:stale-records', 'output' => $output])
            ->log('Eksekusi remote command: clean:stale-records');

        return response()->json(['output' => $output]);
    });

    Route::post('/auth-clear-resets', function () {
        Artisan::call('auth:clear-resets');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'auth:clear-resets', 'output' => $output])
            ->log('Eksekusi remote command: auth:clear-resets');

        return response()->json(['output' => $output]);
    });

    Route::post('/optimize', function () {
        Artisan::call('optimize');
        $output = Artisan::output();

        activity()
            ->tap(fn ($act) => $act->log_name = 'web-artisan')
            ->withProperties(['ip' => request()->ip(), 'command' => 'optimize', 'output' => $output])
            ->log('Eksekusi remote command: optimize');

        return response()->json(['output' => $output]);
    });
});
