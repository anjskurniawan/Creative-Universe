<?php

namespace App\SubApps\Odds\Services;

use App\SubApps\Odds\Models\Task;
use Carbon\Carbon;

class OddsTaskHistoryService
{
    public function build(Task $task): array
    {
        $events = [];
        $push = function (string $type, string $text, mixed $at, int $rank = 0, array $meta = []) use (&$events): void {
            if (! $at) return;
            $events[] = array_merge([
                'event_type' => $type,
                'text' => $text,
                'occurred_at' => $at,
                'rank' => $rank,
            ], $meta);
        };

        $push('task_created', 'TUGAS DIBUAT', $task->created_at, 1);

        $lastBriefReturnAt = null;
        $hasBriefUpdated = false;
        $revisionSources = [];
        $revisionCounters = ['CLIENT' => 0, 'SPV' => 0];
        foreach ($task->activities ?? [] as $activity) {
            if ($task->created_at && $activity->created_at < $task->created_at) continue;
            if ($activity->event === 'brief_returned') $lastBriefReturnAt = $activity->created_at;
            if ($activity->event === 'brief_updated') $hasBriefUpdated = true;
            match ($activity->event) {
                'brief_returned' => $push('brief_returned', 'DESIGNER MEMINTA REVISI BRIEF', $activity->created_at, 2),
                'brief_updated' => $push('brief_updated', 'CLIENT MEREVISI BRIEF', $activity->created_at, 3),
                'brief_accepted' => $push('brief_accepted', 'BRIEF DI-APPROVE', $activity->created_at, 4),
                'brief_forced_continue' => $push('brief_forced_continue', 'BRIEF DITERUSKAN KE ANTREAN', $activity->created_at, 4),
                'client_revision_requested' => (function () use (&$revisionSources): void {
                    $revisionSources[] = 'CLIENT';
                })(),
                'extra_revision_requested', 'urgent_final_revision_requested' => (function () use (&$revisionSources, $push, $activity): void {
                    // Extra/Urgent diajukan Client, lalu membutuhkan approval SPV.
                    // Jadi antreannya tetap dihitung sebagai revisi Client.
                    $revisionSources[] = 'CLIENT';
                    $push(
                        $activity->event === 'extra_revision_requested' ? 'extra_revision_requested' : 'urgent_revision_requested',
                        $activity->event === 'extra_revision_requested' ? 'CLIENT MEMINTA EXTRA REVISION' : 'CLIENT MEMINTA URGENT FINAL REVISION',
                        $activity->created_at,
                        7
                    );
                })(),
                'task_queued' => (function () use ($push, $task, $activity, &$revisionSources, &$revisionCounters): void {
                    $isRevisionQueue = $task->results->min('submitted_at') && $activity->created_at >= $task->results->min('submitted_at');
                    $revision = $isRevisionQueue ? $task->revisions->sortBy('created_at')->values()->first() : null;
                    $source = $isRevisionQueue
                        ? (array_shift($revisionSources) ?? match ($revision?->revision_type) {
                            'normal' => 'CLIENT',
                            'leader' => 'SPV',
                            'extra', 'urgent_final' => 'CLIENT',
                            default => 'CLIENT',
                        })
                        : null;
                    if ($isRevisionQueue) $revisionCounters[$source]++;
                    $sourceRevisionNumber = $isRevisionQueue ? $revisionCounters[$source] : null;
                    $push(
                        $isRevisionQueue ? 'revision_queued' : 'task_queued',
                        $isRevisionQueue ? "REVISI MASUK ANTREAN | DARI {$source} | REVISI KE-{$sourceRevisionNumber}" : 'TASK MASUK ANTREAN',
                        $activity->created_at,
                        $isRevisionQueue ? 80 : 4
                    );
                })(),
                'leader_revision_requested', 'leader_revision_requested' => $push('revision_requested', 'LEADER MEMINTA REVISI', $activity->created_at, 7),
                'extra_revision_approved' => $push('extra_revision_approved', 'EXTRA REVISION DISETUJUI SPV', $activity->created_at, 8),
                'urgent_revision_approved' => $push('urgent_revision_approved', 'URGENT FINAL REVISION DISETUJUI SPV', $activity->created_at, 8),
                'extra_revision_rejected' => $push('extra_revision_rejected', 'EXTRA REVISION DITOLAK SPV', $activity->created_at, 8),
                'urgent_revision_rejected' => $push('urgent_revision_rejected', 'URGENT FINAL REVISION DITOLAK SPV', $activity->created_at, 8),
                default => null,
            };
        }

        if (! $hasBriefUpdated && $lastBriefReturnAt) {
            $fallback = collect($task->activities ?? [])
                ->filter(fn ($activity) => $activity->event === 'updated' && $activity->created_at > $lastBriefReturnAt)
                ->sortBy('created_at')->first();
            if ($fallback) $push('brief_updated', 'CLIENT MEREVISI BRIEF', $fallback->created_at, 3);
        }

        foreach ($task->timeLogs ?? [] as $log) {
            $isWork = in_array($log->log_type, ['work', 'revision'], true);
            $label = strtoupper(str_replace('_', ' ', $log->log_type));
            $phaseOutput = $task->results
                ->filter(fn ($result) => $result->submitted_at && $result->submitted_at >= $log->started_at)
                ->sortBy('submitted_at')
                ->first();
            $latestOutput = $phaseOutput?->submitted_at;
            $phaseStartedAt = $log->started_at;
            if (! $isWork && $latestOutput && $phaseStartedAt <= $latestOutput) $phaseStartedAt = $latestOutput;
            $push('phase_started', "MULAI FASE: {$label}", $phaseStartedAt, $isWork ? 10 : 40, ['phase' => $log->log_type]);
            if ($log->stopped_at) {
                $phaseStoppedAt = $log->stopped_at;
                if ($isWork && $latestOutput && $phaseStoppedAt < $latestOutput) $phaseStoppedAt = $latestOutput;
                $reviewType = $log->log_type === 'leader_review' ? 'leader' : 'client';
                $latestReview = $task->reviews->where('review_type', $reviewType)->sortByDesc('created_at')->first()?->created_at;
                if (! $isWork && $latestReview && $phaseStoppedAt <= $latestReview) $phaseStoppedAt = Carbon::parse($latestReview)->addSecond();
                $push('phase_finished', "SELESAI FASE: {$label}", $phaseStoppedAt, $isWork ? 30 : 60, ['phase' => $log->log_type]);
            }
        }

        foreach ($task->results ?? [] as $result) {
            $push('output_submitted', "OUTPUT SUBMITTED (V{$result->version_number})", $result->submitted_at, 20, ['result_id' => $result->id]);
        }

        foreach ($task->reviews ?? [] as $review) {
            $push('review', 'REVIEW '.strtoupper($review->review_type), $review->created_at, 50, ['review_id' => $review->id, 'decision' => $review->decision]);
        }

        $events = collect($events)->unique(fn (array $event) => $event['event_type'].'|'.$event['occurred_at'].'|'.$event['text'])->values()->all();

        $lastRevisionAt = collect($events)->where('event_type', 'revision_requested')->sortByDesc('occurred_at')->first()['occurred_at'] ?? null;
        if ($lastRevisionAt) {
            foreach ($events as &$event) {
                if ($event['event_type'] === 'revision_requested') {
                    $event['occurred_at'] = Carbon::parse($lastRevisionAt)->addSecond();
                }
                if ($event['event_type'] === 'task_queued' && $event['rank'] >= 80) {
                    $event['occurred_at'] = Carbon::parse($lastRevisionAt)->addSeconds(2);
                }
            }
            unset($event);
        }
        $events = collect($events)->unique(fn (array $event) => $event['event_type'].'|'.$event['occurred_at'].'|'.$event['text'])->values()->all();

        if ($task->done_at) $push('task_done', 'TUGAS SELESAI', $task->done_at, 90);

        usort($events, function (array $a, array $b): int {
            $difference = $a['occurred_at']->getTimestamp() <=> $b['occurred_at']->getTimestamp();
            return $difference ?: ($a['rank'] <=> $b['rank']);
        });

        foreach ($events as $index => &$event) {
            $event['sequence'] = $index + 1;
            $event['occurred_at'] = $event['occurred_at']->toISOString();
            unset($event['rank']);
        }

        return $events;
    }
}
