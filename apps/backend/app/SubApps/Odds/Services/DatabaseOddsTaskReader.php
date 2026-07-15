<?php

namespace App\SubApps\Odds\Services;

use App\SubApps\Odds\Contracts\OddsTaskReader;
use App\SubApps\Odds\Data\OddsTaskSummary;
use App\SubApps\Odds\Models\Task;

class DatabaseOddsTaskReader implements OddsTaskReader
{
    public function findSummary(int $taskId): ?OddsTaskSummary
    {
        $task = Task::query()->find($taskId);

        if (! $task) {
            return null;
        }

        return new OddsTaskSummary(
            id: $task->id,
            status: $task->status,
            requesterId: $task->requester_id,
            assignedDesignerId: $task->assigned_designer_id,
            doneAt: $task->done_at?->toAtomString(),
        );
    }
}
