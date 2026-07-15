<?php

namespace App\SubApps\Odds\Services;

use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\Task;

class OddsPriorityService
{
    public function score(Task $task, ?DesignerProfile $profile = null): float
    {
        $matrix = strtolower((string) $task->important_matrix);
        $matrixScore = match ($matrix) {
            'urgent', 'quadrant_1', 'quadrant 1', 'q1' => 80,
            'high', 'quadrant_2', 'quadrant 2', 'q2' => 60,
            'quadrant_3', 'quadrant 3', 'q3' => 40,
            default => 25,
        };

        $deadlineHours = max(1, now()->diffInHours($task->deadline, false));
        $deadlineScore = $deadlineHours <= 24 ? 50 : max(5, 40 - ($deadlineHours / 12));
        $ageScore = min(30, $task->created_at ? $task->created_at->diffInHours(now()) : 0);
        $workloadPenalty = $profile ? $this->activeWorkload($profile) * 5 : 0;
        $urgentBoost = str_contains($task->task_type, 'urgent') ? 100 : 0;

        return round($matrixScore + $deadlineScore + $ageScore + $urgentBoost - $workloadPenalty, 2);
    }

    public function activeWorkload(DesignerProfile $profile): int
    {
        return Task::query()
            ->where('assigned_designer_id', $profile->user_id)
            ->whereIn('status', ['queued', 'scheduled', 'ready_to_start', 'in_progress', 'spv_review', 'leader_revision_requested'])
            ->sum('workload_point');
    }
}
