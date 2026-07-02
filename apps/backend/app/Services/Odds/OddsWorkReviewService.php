<?php

namespace App\Services\Odds;

use App\Enums\Odds\TaskStatusEnum;
use App\Enums\Odds\TaskTypeEnum;
use App\Models\Core\AssetLink;
use App\Models\Odds\DesignerProfile;
use App\Models\Odds\SystemRule;
use App\Models\Odds\Task;
use App\Models\Odds\TaskResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OddsWorkReviewService
{
    public function __construct(
        private OddsQueueService $queue,
        private OddsTimeLogService $timeLogs,
        private OddsRevisionService $revisions,
        private OddsReportingService $reporting,
        private OddsTaskConversationService $conversations,
        private OddsNotificationService $notifications
    ) {}

    public function start(Task $task, int $designerId): Task
    {
        return DB::transaction(function () use ($task, $designerId) {
            if ($task->assigned_designer_id !== $designerId) {
                throw ValidationException::withMessages(['task_id' => 'Task ini bukan assignment desainer tersebut.']);
            }

            $this->queue->assertIsNext($task, $designerId);

            $profile = $task->assignedDesigner
                ? DesignerProfile::where('user_id', $designerId)->first()
                : null;
            $active = Task::where('assigned_designer_id', $designerId)->where('status', TaskStatusEnum::IN_PROGRESS->value)->count();
            if ($profile && $active >= $profile->max_active_tasks) {
                $this->notifications->send($task->assignedDesigner, 'capacity_full', 'Kapasitas ODDS penuh', 'Max active task sudah tercapai.', $task);
                throw ValidationException::withMessages(['capacity' => 'Kapasitas desainer hari ini penuh.']);
            }

            $task->currentQueue?->update([
                'queue_status' => 'ready_to_start',
                'started_at' => now(),
            ]);

            $task->update([
                'status' => TaskStatusEnum::IN_PROGRESS->value,
                'started_at' => $task->started_at ?? now(),
            ]);

            $this->timeLogs->start(
                $task,
                $task->task_type === 'new_task' ? 'work' : 'revision',
                $designerId
            );

            activity('odds')->performedOn($task)->event('task_started')->log('Task started');

            return $task->refresh()->load('currentQueue');
        });
    }

    public function submitResult(Task $task, array $data, int $designerId): TaskResult
    {
        return DB::transaction(function () use ($task, $data, $designerId) {
            if ($task->assigned_designer_id !== $designerId) {
                throw ValidationException::withMessages(['task_id' => 'Task ini bukan assignment desainer tersebut.']);
            }

            if ($task->status !== TaskStatusEnum::IN_PROGRESS->value) {
                throw ValidationException::withMessages(['task_id' => 'Output hanya bisa dikirim saat task sedang dikerjakan.']);
            }

            $this->timeLogs->stopOpen($task, 'work');
            $this->timeLogs->stopOpen($task, 'revision');

            $version = ((int) $task->results()->max('version_number')) + 1;
            $requiresSpvReview = in_array($task->task_type, [
                TaskTypeEnum::NEW_TASK->value,
                TaskTypeEnum::LEADER_REVISION->value,
            ], true);
            $result = $task->results()->create([
                'version_number' => $version,
                'submitted_by' => $designerId,
                'result_notes' => $data['result_notes'] ?? null,
                'status' => $requiresSpvReview ? 'pending_spv' : 'pending_client',
                'submitted_at' => now(),
            ]);

            foreach ($data['assets'] ?? [] as $asset) {
                AssetLink::create([
                    'linkable_type' => TaskResult::class,
                    'linkable_id' => $result->id,
                    'provider' => $asset['provider'] ?? 'other',
                    'label' => $asset['label'],
                    'url' => $asset['url'],
                    'created_by' => $designerId,
                ]);
            }

            $task->update([
                'status' => $requiresSpvReview ? TaskStatusEnum::SPV_REVIEW->value : TaskStatusEnum::CLIENT_REVIEW->value,
                'finished_at' => now(),
            ]);
            $task->currentQueue?->update(['queue_status' => 'completed', 'completed_at' => now()]);
            activity('odds')->performedOn($task)->event('task_finished')->log('Task work submitted');

            if ($requiresSpvReview) {
                $this->notifications->sendToRoles(['Manajer', 'SPV'], 'spv_review_waiting', 'Hasil ODDS menunggu review', 'Hasil desain menunggu review SPV.', $task);
                activity('odds')->performedOn($task)->event('result_submitted_to_spv')->log('Result submitted to SPV');
            } else {
                $this->notifications->send($task->requester, 'client_review_waiting', 'Hasil ODDS siap ditinjau', 'Hasil revisi desain siap direview client.', $task);
                activity('odds')->performedOn($task)->event('result_submitted_to_client')->log('Revision result submitted to client');
            }

            return $result->load('assetLinks');
        });
    }

    public function spvReview(Task $task, array $data, int $reviewerId): Task
    {
        return DB::transaction(function () use ($task, $data, $reviewerId) {
            if ($task->status !== TaskStatusEnum::SPV_REVIEW->value) {
                throw ValidationException::withMessages(['task_id' => 'Review SPV hanya bisa dilakukan saat status spv_review.']);
            }

            $result = $task->results()->latest('version_number')->first();
            $decision = $data['decision'];
            $task->reviews()->create([
                'result_id' => $result?->id,
                'reviewer_id' => $reviewerId,
                'review_type' => 'spv',
                'decision' => $decision,
                'notes' => $data['notes'] ?? null,
            ]);

            if ($decision === 'approved') {
                $result?->update(['status' => 'approved_by_spv']);
                $task->update(['status' => TaskStatusEnum::CLIENT_REVIEW->value]);
                $this->notifications->send($task->requester, 'client_review_waiting', 'Hasil ODDS siap ditinjau', 'Hasil desain siap direview client.', $task);
                activity('odds')->performedOn($task)->event('spv_approved')->log($data['notes'] ?? 'Approved');
            } else {
                $result?->update(['status' => 'revision_requested']);
                $task->update(['status' => TaskStatusEnum::LEADER_REVISION_REQUESTED->value]);
                $this->revisions->request($task, [
                    'revision_type' => 'leader',
                    'result_id' => $result?->id,
                    'notes' => $data['notes'] ?? 'Revisi SPV.',
                ], $reviewerId);
                $this->flagQualityIssueIfNeeded($task->refresh(), $data['notes'] ?? null);
                activity('odds')->performedOn($task)->event('spv_revision_requested')->log($data['notes'] ?? 'Revision requested');
            }

            return $task->refresh()->load(['reviews', 'revisions']);
        });
    }

    public function clientReview(Task $task, array $data, int $reviewerId): Task
    {
        return DB::transaction(function () use ($task, $data, $reviewerId) {
            if ($task->status !== TaskStatusEnum::CLIENT_REVIEW->value) {
                throw ValidationException::withMessages(['task_id' => 'Review client hanya bisa dilakukan saat status client_review.']);
            }

            $result = $task->results()->latest('version_number')->first();
            $decision = $data['decision'];
            $task->reviews()->create([
                'result_id' => $result?->id,
                'reviewer_id' => $reviewerId,
                'review_type' => 'client',
                'decision' => $decision,
                'notes' => $data['notes'] ?? null,
            ]);

            if ($decision === 'approved') {
                $task->update(['approved_at' => now()]);
                activity('odds')->performedOn($task)->event('client_approved')->log($data['notes'] ?? 'Client approved');
            } else {
                if ($task->task_type === 'urgent_revision') {
                    $this->revisions->autoDone($task, 'Urgent final already used. Client revision request converted to done.');
                } else {
                    $this->revisions->request($task, [
                        'revision_type' => $data['revision_type'] ?? 'normal',
                        'result_id' => $result?->id,
                        'notes' => $data['notes'] ?? 'Revisi client.',
                    ], $reviewerId);
                    activity('odds')->performedOn($task)->event('client_revision_requested')->log($data['notes'] ?? 'Client revision');
                }
            }

            return $task->refresh()->load(['reviews', 'revisions']);
        });
    }

    private function flagQualityIssueIfNeeded(Task $task, ?string $note = null): void
    {
        $limit = (int) data_get(
            SystemRule::query()
                ->where('key', 'leader_revision_quality_issue_limit')
                ->where('is_active', true)
                ->value('value'),
            'count',
            2
        );

        if ($task->leader_revision_count <= $limit || $task->quality_issue_flag) {
            return;
        }

        $task->update([
            'quality_issue_flag' => true,
            'quality_issue_note' => $note ?: "Leader revision melewati batas wajar {$limit} kali.",
        ]);

        activity('odds')->performedOn($task)->event('quality_issue_flagged')->log($task->quality_issue_note);
    }

    public function rate(Task $task, array $data, int $reviewerId): Task
    {
        return DB::transaction(function () use ($task, $data, $reviewerId) {
            if ($task->status !== TaskStatusEnum::CLIENT_REVIEW->value) {
                throw ValidationException::withMessages(['task_id' => 'Rating hanya bisa diberikan saat status client_review.']);
            }

            $task->reviews()->create([
                'result_id' => $task->results()->latest('version_number')->value('id'),
                'reviewer_id' => $reviewerId,
                'review_type' => 'client',
                'decision' => 'rated',
                'notes' => $data['feedback'] ?? null,
                'rating' => $data['rating'],
            ]);

            $task->update([
                'status' => TaskStatusEnum::DONE->value,
                'done_at' => now(),
            ]);

            activity('odds')->performedOn($task)->event('task_done')->log('Task rated and done');
            $this->conversations->closeForTask($task->refresh(), 'Task selesai dan rating masuk.');
            $this->notifications->send($task->assignedDesigner, 'task_done', 'Task ODDS selesai', 'Task selesai dan rating masuk.', $task);
            $this->reporting->fillDailyReport($task->refresh());
            $this->reporting->recalculateRankings();

            return $task->refresh()->load(['reviews']);
        });
    }
}
