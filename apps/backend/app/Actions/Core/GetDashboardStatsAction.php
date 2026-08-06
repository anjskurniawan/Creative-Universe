<?php

namespace App\Actions\Core;

use App\Models\Core\User;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Models\Activity;

class GetDashboardStatsAction
{
    public function handle(User $user): array
    {
        $result = [
            'active_users' => User::count(),
            'pending_users' => null,
            'roles' => $user->getRoleNames()->values()->all(),
            'is_root' => $user->hasRole('Root'),
            'root_metrics' => null,
        ];

        if (! $result['is_root']) {
            return $result;
        }

        $gitBranch = 'N/A';
        $gitCommit = 'N/A';
        try {
            $branchOutput = shell_exec('git branch --show-current');
            if ($branchOutput) {
                $gitBranch = trim($branchOutput);
            }
            $commitOutput = shell_exec('git log -1 --pretty=format:"%h - %s"');
            if ($commitOutput) {
                $gitCommit = trim($commitOutput);
            }
        } catch (\Throwable) {
            // Silently fall back to N/A
        }

        $result['root_metrics'] = [
            'total_sessions' => DB::table('sessions')->count(),
            'suspended_users' => 0,
            'pending_jobs' => DB::table('jobs')->count(),
            'failed_jobs' => DB::table('failed_jobs')->count(),
            'database_driver' => DB::getDriverName(),
            'database_size' => $this->databaseSize(),
            'laravel_version' => app()->version(),
            'php_version' => PHP_VERSION,
            'git_branch' => $gitBranch,
            'git_commit' => $gitCommit,
            'latest_activities' => Activity::with('causer')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Activity $activity) => [
                    'id' => $activity->id,
                    'log_name' => $activity->log_name,
                    'description' => $activity->description,
                    'causer_name' => $activity->causer?->name ?? 'Sistem',
                    'created_at' => $activity->created_at?->toISOString(),
                ])
                ->values()
                ->all(),
        ];

        return $result;
    }

    private function databaseSize(): string
    {
        try {
            $driver = DB::getDriverName();

            if ($driver === 'sqlite') {
                $path = config('database.connections.sqlite.database');

                return is_string($path) && is_file($path)
                    ? $this->formatBytes((int) filesize($path))
                    : 'N/A';
            }

            if ($driver === 'mysql') {
                $database = config('database.connections.mysql.database');
                $result = DB::selectOne(
                    'SELECT SUM(data_length + index_length) AS size FROM information_schema.TABLES WHERE table_schema = ?',
                    [$database]
                );

                return isset($result->size)
                    ? $this->formatBytes((int) $result->size)
                    : 'N/A';
            }
        } catch (\Throwable) {
            return 'N/A';
        }

        return 'N/A';
    }

    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max(0, $bytes);
        $power = $bytes > 0 ? (int) floor(log($bytes, 1024)) : 0;
        $power = min($power, count($units) - 1);

        return round($bytes / (1024 ** $power), 2).' '.$units[$power];
    }
}
