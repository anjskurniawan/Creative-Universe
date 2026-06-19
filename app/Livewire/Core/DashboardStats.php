<?php

namespace App\Livewire\Core;

use App\Models\Core\User;
use Livewire\Attributes\On;
use Livewire\Component;

/**
 * DashboardStats — Real-time dashboard statistics
 *
 * Polling setiap 30 detik untuk update stats.
 */
class DashboardStats extends Component
{
    public int $totalActiveUsers = 0;

    public int $totalPendingUsers = 0;

    public string $userRoles = '';

    // Root-specific properties
    public bool $isRoot = false;
    public int $totalSessions = 0;
    public int $totalSuspendedUsers = 0;
    public string $databaseDriver = '';
    public string $databaseSize = '';
    public int $totalPendingJobs = 0;
    public int $failedJobsCount = 0;
    public array $latestActivities = [];
    public array $systemEnv = [];

    public function mount(): void
    {
        $this->loadStats();
    }

    public function loadStats(): void
    {
        $user = auth()->user();
        $this->totalActiveUsers = User::active()->count();
        $this->totalPendingUsers = $user->can('approve-users') ? User::pending()->count() : 0;
        $this->userRoles = $user->roles->pluck('name')->join(', ') ?: 'Tidak ada role';

        // Load root-specific metrics
        $this->isRoot = $user->hasRole('Root');
        if ($this->isRoot) {
            $this->totalSessions = \Illuminate\Support\Facades\DB::table('sessions')->count();
            $this->totalSuspendedUsers = User::where('is_active', false)
                ->whereNotNull('approved_by')
                ->count();
            $this->databaseDriver = \Illuminate\Support\Facades\DB::getDriverName();
            $this->databaseSize = $this->getDatabaseSize();
            $this->totalPendingJobs = \Illuminate\Support\Facades\DB::table('jobs')->count();
            $this->failedJobsCount = \Illuminate\Support\Facades\DB::table('failed_jobs')->count();

            // Load 5 latest global activities
            $this->latestActivities = \Spatie\Activitylog\Models\Activity::with('causer')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($activity) {
                    $properties = $activity->properties;
                    return [
                        'id' => $activity->id,
                        'log_name' => $activity->log_name,
                        'description' => $activity->description,
                        'causer_name' => $activity->causer ? $activity->causer->name : 'Sistem',
                        'ip' => $properties['ip'] ?? '-',
                        'user_agent' => $properties['user_agent'] ?? '-',
                        'created_at_human' => $activity->created_at->diffForHumans(),
                    ];
                })
                ->toArray();

            // System environments
            $this->systemEnv = [
                'laravel_version' => app()->version(),
                'php_version' => PHP_VERSION,
                'app_env' => config('app.env'),
                'app_debug' => config('app.debug') ? 'Aktif' : 'Nonaktif',
            ];
        }
    }

    private function getDatabaseSize(): string
    {
        try {
            $driver = \Illuminate\Support\Facades\DB::getDriverName();
            if ($driver === 'sqlite') {
                $dbPath = config('database.connections.sqlite.database');
                if (file_exists($dbPath)) {
                    return $this->formatBytes(filesize($dbPath));
                }
            } elseif ($driver === 'mysql') {
                $dbName = config('database.connections.mysql.database');
                $result = \Illuminate\Support\Facades\DB::select("
                    SELECT SUM(data_length + index_length) AS size 
                    FROM information_schema.TABLES 
                    WHERE table_schema = ?
                ", [$dbName]);
                if (!empty($result) && isset($result[0]->size)) {
                    return $this->formatBytes((int)$result[0]->size);
                }
            }
        } catch (\Throwable $e) {
            // Silently fail
        }
        return 'N/A';
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    #[On('user-status-updated')]
    #[On('notification-received')]
    public function refreshStats(): void
    {
        $this->loadStats();
    }

    public function render()
    {
        return view('livewire.core.dashboard-stats');
    }
}
