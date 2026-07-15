<?php

namespace App\SubApps\Odds\Services;

use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskTimeLog;

class OddsTimeLogService
{
    public function start(Task $task, string $type, ?int $designerId = null, ?string $notes = null): TaskTimeLog
    {
        return TaskTimeLog::create([
            'task_id' => $task->id,
            'designer_id' => $designerId,
            'log_type' => $type,
            'started_at' => now(),
            'notes' => $notes,
        ]);
    }

    public function stopOpen(Task $task, string $type): void
    {
        TaskTimeLog::query()
            ->where('task_id', $task->id)
            ->where('log_type', $type)
            ->whereNull('stopped_at')
            ->get()
            ->each(function (TaskTimeLog $log) {
                $stoppedAt = now();
                $log->update([
                    'stopped_at' => $stoppedAt,
                    'duration_seconds' => max(0, $log->started_at->diffInSeconds($stoppedAt)),
                ]);
            });
    }

    public function duration(Task $task, string $type): int
    {
        return (int) $task->timeLogs()
            ->where('log_type', $type)
            ->sum('duration_seconds');
    }
}
