<?php

namespace App\Services\Odds;

use App\Enums\Odds\RevisionTypeEnum;
use App\Enums\Odds\TaskStatusEnum;
use App\Enums\Odds\TaskTypeEnum;
use App\Models\Odds\Task;
use App\Models\Odds\TaskRevision;
use Illuminate\Support\Facades\DB;

class OddsRevisionService
{
    public function __construct(
        private OddsQueueService $queue,
        private OddsReportingService $reporting,
        private OddsNotificationService $notifications
    ) {}

    public function request(Task $task, array $data, int $userId): TaskRevision
    {
        return DB::transaction(function () use ($task, $data, $userId) {
            $type = $data['revision_type'] ?? RevisionTypeEnum::NORMAL->value;
            $limit = (int) data_get($task->category_snapshot, 'normal_revision_limit', 2);

            if ($type === RevisionTypeEnum::NORMAL->value && $task->normal_revision_count >= $limit) {
                $type = $task->extra_revision_used_at ? RevisionTypeEnum::URGENT_FINAL->value : RevisionTypeEnum::EXTRA->value;
            }

            $status = in_array($type, [RevisionTypeEnum::EXTRA->value, RevisionTypeEnum::URGENT_FINAL->value], true)
                ? 'pending_spv'
                : 'queued';

            $revision = $task->revisions()->create([
                'result_id' => $data['result_id'] ?? $task->results()->latest('version_number')->value('id'),
                'requested_by' => $userId,
                'assigned_to' => $task->assigned_designer_id,
                'revision_type' => $type,
                'notes' => $data['notes'],
                'status' => $status,
                'is_urgent_final' => $type === RevisionTypeEnum::URGENT_FINAL->value,
            ]);

            if ($type === RevisionTypeEnum::NORMAL->value) {
                $task->increment('normal_revision_count');
                $this->queue->enqueue($task, TaskTypeEnum::CLIENT_REVISION->value, $task->assigned_designer_id);
            } elseif ($type === RevisionTypeEnum::LEADER->value) {
                $task->increment('leader_revision_count');
                $this->queue->enqueue($task, TaskTypeEnum::LEADER_REVISION->value, $task->assigned_designer_id);
            } else {
                $this->notifications->send($task->assignedDesigner, $type.'_requested', 'Revision ODDS butuh review SPV', $data['notes'], $task);
            }

            activity('odds')->performedOn($task)->event($type.'_revision_requested')->log($data['notes']);

            return $revision->refresh();
        });
    }

    public function reviewExtra(TaskRevision $revision, int $reviewerId, string $decision, ?string $note = null): TaskRevision
    {
        return $this->reviewSpecialRevision($revision, $reviewerId, $decision, $note, false);
    }

    public function reviewUrgent(TaskRevision $revision, int $reviewerId, string $decision, ?string $note = null): TaskRevision
    {
        return $this->reviewSpecialRevision($revision, $reviewerId, $decision, $note, true);
    }

    private function reviewSpecialRevision(TaskRevision $revision, int $reviewerId, string $decision, ?string $note, bool $urgent): TaskRevision
    {
        return DB::transaction(function () use ($revision, $reviewerId, $decision, $note, $urgent) {
            $task = $revision->task;

            if ($decision === 'approved') {
                $revision->update([
                    'status' => 'approved',
                    'approved_by' => $reviewerId,
                    'approved_at' => now(),
                ]);

                if ($urgent) {
                    $task->update([
                        'urgent_revision_used_at' => now(),
                        'urgent_revision_approved_by' => $reviewerId,
                    ]);
                    $this->queue->enqueue($task, TaskTypeEnum::URGENT_REVISION->value, $task->assigned_designer_id);
                    activity('odds')->performedOn($task)->event('urgent_revision_approved')->log($note ?? 'Urgent revision approved');
                } else {
                    $task->update([
                        'extra_revision_used_at' => now(),
                        'extra_revision_approved_by' => $reviewerId,
                    ]);
                    $this->queue->enqueue($task, TaskTypeEnum::EXTRA_REVISION->value, $task->assigned_designer_id);
                    activity('odds')->performedOn($task)->event('extra_revision_approved')->log($note ?? 'Extra revision approved');
                }
            } elseif ($urgent) {
                $revision->update(['status' => 'rejected', 'approved_by' => $reviewerId, 'approved_at' => now()]);
                $this->autoDone($task, 'Urgent revision rejected. Task auto done.');
            } else {
                $revision->update(['status' => 'rejected', 'approved_by' => $reviewerId, 'approved_at' => now()]);
                $task->update(['status' => TaskStatusEnum::REVISION_REJECTED_BY_SPV->value]);
            }

            return $revision->refresh();
        });
    }

    public function autoDone(Task $task, string $reason = 'Auto done'): Task
    {
        $task->update([
            'status' => TaskStatusEnum::DONE->value,
            'done_at' => now(),
            'finished_at' => $task->finished_at ?? now(),
        ]);

        activity('odds')->performedOn($task)->event('auto_done')->log($reason);
        $this->reporting->fillDailyReport($task->refresh());
        $this->reporting->recalculateRankings();

        return $task->refresh();
    }
}
