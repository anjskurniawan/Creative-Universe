<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('clean:activity-log', function () {
    $deleted = DB::table('activity_log')
        ->where('created_at', '<', now()->subMonths(24))
        ->delete();

    $this->info("Deleted {$deleted} old activity log rows.");
})->purpose('Delete activity log rows older than 24 months');

Artisan::command('clean:notifications', function () {
    $deleted = DB::table('notifications')
        ->where('created_at', '<', now()->subMonths(12))
        ->delete();

    $this->info("Deleted {$deleted} old notification rows.");
})->purpose('Delete notification rows older than 12 months');

Artisan::command('clean:failed-jobs', function () {
    $deleted = DB::table('failed_jobs')
        ->where('failed_at', '<', now()->subDays(30))
        ->delete();

    $this->info("Deleted {$deleted} old failed job rows.");
})->purpose('Delete failed job rows older than 30 days');

Artisan::command('clean:temp-uploads', function () {
    $path = storage_path('app/livewire-tmp');

    if (! File::isDirectory($path)) {
        $this->info('No temporary upload directory found.');
        return;
    }

    $deleted = 0;
    $threshold = now()->subDays(7)->timestamp;

    foreach (File::allFiles($path) as $file) {
        if ($file->getMTime() < $threshold) {
            File::delete($file->getPathname());
            $deleted++;
        }
    }

    foreach (array_reverse(File::directories($path)) as $directory) {
        if (count(File::allFiles($directory)) === 0) {
            File::deleteDirectory($directory);
        }
    }

    $this->info("Deleted {$deleted} old temporary upload files.");
})->purpose('Delete temporary upload files older than 7 days');

Artisan::command('clean:stale-records', function () {
    $this->info('No stale record pruning target registered yet.');
})->purpose('Reserved hook for sub-app stale record pruning');

Schedule::command('clean:activity-log')->monthly();
Schedule::command('clean:notifications')->monthly();
Schedule::command('clean:failed-jobs')->daily();
Schedule::command('auth:clear-resets')->daily();
Schedule::command('clean:temp-uploads')->daily();
Schedule::command('clean:stale-records')->monthly();
