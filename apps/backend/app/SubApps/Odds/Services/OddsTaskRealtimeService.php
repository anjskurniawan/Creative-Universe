<?php

namespace App\SubApps\Odds\Services;

use App\Models\Core\User;
use App\SubApps\Odds\Events\OddsTaskDeleted;
use App\SubApps\Odds\Events\OddsTaskUpdated;
use App\SubApps\Odds\Models\Task;

class OddsTaskRealtimeService
{
    /** @param array<int, int> $additionalAudience */
    public function publishUpdated(Task $task, array $additionalAudience = []): void
    {
        $snapshot = $task->fresh([
            'category', 'requester', 'assignedDesigner', 'currentQueue', 'results.assetLinks',
            'revisions', 'skipRequests', 'cancelRequests', 'reviews', 'timeLogs',
        ]);

        if (! $snapshot) {
            return;
        }

        OddsTaskUpdated::dispatch($snapshot, array_values(array_unique([
            ...$this->audience($snapshot),
            ...$additionalAudience,
        ])));
    }

    /** @param array<int, int> $userIds */
    public function publishDeleted(int $taskId, array $userIds): void
    {
        OddsTaskDeleted::dispatch($taskId, $userIds);
    }

    /** @return array<int, int> */
    public function audience(Task $task): array
    {
        $controlIds = User::role(['Root', 'Manajer', 'SPV'])->pluck('id')->map(fn ($id) => (int) $id)->all();

        return array_values(array_unique(array_filter([
            $task->requester_id,
            $task->assigned_designer_id,
            ...$controlIds,
        ])));
    }
}
