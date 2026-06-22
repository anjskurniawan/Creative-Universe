<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MaintenanceController extends BaseApiController
{
    /**
     * Get system status metadata safely (no secrets returned).
     */
    public function status(Request $request): JsonResponse
    {
        $failedJobs = 0;
        try {
            $failedJobs = DB::table('failed_jobs')->count();
        } catch (\Exception $e) {
            Log::warning('[MAINTENANCE] Failed to query failed_jobs table: '.$e->getMessage());
        }

        $diskFree = 'N/A';
        try {
            if (function_exists('disk_free_space')) {
                $bytes = disk_free_space(base_path());
                if ($bytes !== false) {
                    $diskFree = round($bytes / (1024 * 1024 * 1024), 2).' GB';
                }
            }
        } catch (\Exception $e) {
            // Avoid failing if function is disabled by cPanel open_basedir/disable_functions
        }

        $logSize = '0 B';
        try {
            $logPath = storage_path('logs/laravel.log');
            if (file_exists($logPath)) {
                $bytes = filesize($logPath);
                if ($bytes !== false) {
                    $logSize = round($bytes / (1024 * 1024), 2).' MB';
                }
            }
        } catch (\Exception $e) {
            // Safe fallback
        }

        $statusData = [
            'app_env' => app()->environment(),
            'cache_driver' => config('cache.default', 'file'),
            'queue_connection' => config('queue.default', 'sync'),
            'failed_jobs_count' => $failedJobs,
            'disk_free_space' => $diskFree,
            'log_file_size' => $logSize,
        ];

        return $this->sendResponse($statusData, 'Metadata status sistem berhasil diambil.');
    }

    /**
     * Run a specific safe command from UI allowlist.
     */
    public function run(Request $request): JsonResponse
    {
        $request->validate([
            'command' => 'required|string',
        ], [
            'command.required' => 'Perintah wajib diisi.',
        ]);

        $commandKey = $request->input('command');

        // STRICT ALLOWLIST MAPPING
        $allowlist = [
            'clear-cache' => 'optimize:clear',
            'queue-restart' => 'queue:restart',
            'storage-link' => 'storage:link',
            'seed-permissions' => 'db:seed', // custom parsed
            'migrate' => 'migrate',
            'migrate-fresh' => 'migrate:fresh',
            'seed' => 'db:seed', // custom parsed
            'queue-work' => 'queue:work',
            'clean-activity-log' => 'clean:activity-log',
            'clean-notifications' => 'clean:notifications',
            'clean-failed-jobs' => 'clean:failed-jobs',
            'clean-temp-uploads' => 'clean:temp-uploads',
            'clean-stale-records' => 'clean:stale-records',
            'auth-clear-resets' => 'auth:clear-resets',
            'optimize' => 'optimize',
        ];

        if (! array_key_exists($commandKey, $allowlist)) {
            return $this->sendError('Perintah tidak diizinkan untuk dieksekusi dari panel web.', [], 422);
        }

        // Environment guard for destructive actions in production env
        if (($commandKey === 'migrate-fresh' || $commandKey === 'seed') && app()->environment('production')) {
            return $this->sendError('Tindakan ini dilarang pada environment production.', [], 403);
        }

        $artisanCommand = $allowlist[$commandKey];
        $output = '';

        try {
            if ($commandKey === 'seed-permissions') {
                Artisan::call('db:seed', [
                    '--class' => 'RolePermissionSeeder',
                    '--force' => true,
                ]);
            } elseif ($commandKey === 'seed') {
                Artisan::call('db:seed', [
                    '--force' => true,
                ]);
            } elseif ($commandKey === 'migrate') {
                Artisan::call('migrate', [
                    '--force' => true,
                ]);
            } elseif ($commandKey === 'migrate-fresh') {
                Artisan::call('migrate:fresh', [
                    '--force' => true,
                ]);
            } elseif ($commandKey === 'queue-work') {
                Artisan::call('queue:work', [
                    '--stop-when-empty' => true,
                ]);
            } else {
                Artisan::call($artisanCommand);
            }
            $output = Artisan::output();

            // Record audit trail with current authenticated user
            activity()
                ->performedOn($request->user())
                ->causedBy($request->user())
                ->tap(fn ($act) => $act->log_name = 'maintenance-ui')
                ->withProperties([
                    'ip' => $request->ip(),
                    'command' => $commandKey,
                    'artisan_command' => $artisanCommand,
                    'output' => $output,
                ])
                ->log("Menjalankan maintenance command: {$commandKey}");

        } catch (\Exception $e) {
            Log::error("[MAINTENANCE] Error running UI command {$commandKey}: ".$e->getMessage());

            activity()
                ->performedOn($request->user())
                ->causedBy($request->user())
                ->tap(fn ($act) => $act->log_name = 'maintenance-ui')
                ->withProperties([
                    'ip' => $request->ip(),
                    'command' => $commandKey,
                    'error' => $e->getMessage(),
                ])
                ->log("Gagal menjalankan maintenance command: {$commandKey}");

            return $this->sendError('Terjadi kesalahan saat mengeksekusi perintah: '.$e->getMessage(), [], 500);
        }

        return $this->sendResponse([
            'command' => $commandKey,
            'output' => $output,
        ], "Perintah '{$commandKey}' berhasil dieksekusi.");
    }
}
