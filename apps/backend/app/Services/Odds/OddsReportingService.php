<?php

namespace App\Services\Odds;

use App\Models\Odds\DesignerDailyReport;
use App\Models\Odds\DesignerRanking;
use App\Models\Odds\Task;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class OddsReportingService
{
    public function __construct(private OddsTimeLogService $timeLogs) {}

    public function fillDailyReport(Task $task): DesignerDailyReport
    {
        $task->loadMissing(['reviews', 'revisions', 'category', 'timeLogs']);
        $doneAt = $task->done_at ?? now();
        $rating = $task->reviews()->where('review_type', 'client')->whereNotNull('rating')->latest()->value('rating');
        $score = $task->status === 'done' ? (float) data_get($task->category_snapshot, 'score_weight', 1) : 0;

        return DesignerDailyReport::updateOrCreate(
            [
                'report_date' => $doneAt->toDateString(),
                'task_id' => $task->id,
            ],
            [
                'designer_id' => $task->assigned_designer_id,
                'category_id' => $task->category_id,
                'output_done' => $task->status === 'done',
                'active_work_duration_seconds' => $this->timeLogs->duration($task, 'work'),
                'revision_duration_seconds' => $this->timeLogs->duration($task, 'revision'),
                'review_waiting_duration_seconds' => $this->timeLogs->duration($task, 'review_waiting'),
                'revision_count' => $task->revisions()->count(),
                'overdue' => $doneAt->greaterThan($task->deadline),
                'quality_issue_flag' => $task->quality_issue_flag,
                'rating' => $rating,
                'final_status' => $task->status,
                'done_at' => $doneAt,
                'score' => $score,
            ]
        );
    }

    public function recalculateRankings(?Carbon $date = null): void
    {
        $date ??= now();
        $periods = [
            'daily' => [$date->copy()->startOfDay(), $date->copy()->endOfDay()],
            'monthly' => [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()],
            'yearly' => [$date->copy()->startOfYear(), $date->copy()->endOfYear()],
        ];

        foreach ($periods as $periodType => [$start, $end]) {
            $rows = DesignerDailyReport::query()
                ->select('designer_id')
                ->selectRaw('COUNT(CASE WHEN output_done = 1 THEN 1 END) as total_output')
                ->selectRaw('SUM(score) as total_score')
                ->selectRaw('SUM(active_work_duration_seconds) as total_work_duration_seconds')
                ->selectRaw('SUM(revision_duration_seconds) as total_revision_duration_seconds')
                ->selectRaw('SUM(revision_count) as total_revision_count')
                ->selectRaw('SUM(CASE WHEN overdue = 1 THEN 1 ELSE 0 END) as overdue_count')
                ->selectRaw('AVG(rating) as average_rating')
                ->whereDate('report_date', '>=', $start->toDateString())
                ->whereDate('report_date', '<=', $end->toDateString())
                ->groupBy('designer_id')
                ->get();

            foreach ($rows as $row) {
                DesignerRanking::updateOrCreate(
                    [
                        'period_type' => $periodType,
                        'period_start' => $start->toDateString(),
                        'designer_id' => $row->designer_id,
                    ],
                    [
                        'period_end' => $end->toDateString(),
                        'total_output' => (int) $row->total_output,
                        'total_score' => (float) $row->total_score,
                        'total_work_duration_seconds' => (int) $row->total_work_duration_seconds,
                        'total_revision_duration_seconds' => (int) $row->total_revision_duration_seconds,
                        'total_revision_count' => (int) $row->total_revision_count,
                        'overdue_count' => (int) $row->overdue_count,
                        'average_rating' => $row->average_rating ? round((float) $row->average_rating, 2) : null,
                    ]
                );
            }
        }
    }

    public function summary(array $filters = []): array
    {
        $from = $filters['from'] ?? now()->startOfMonth()->toDateString();
        $to = $filters['to'] ?? now()->endOfMonth()->toDateString();
        $query = DesignerDailyReport::whereBetween('report_date', [$from, $to]);

        return [
            'from' => $from,
            'to' => $to,
            'total_output' => (int) (clone $query)->where('output_done', true)->count(),
            'total_score' => (float) (clone $query)->sum('score'),
            'overdue_count' => (int) (clone $query)->where('overdue', true)->count(),
            'quality_issue_count' => (int) (clone $query)->where('quality_issue_flag', true)->count(),
            'average_rating' => round((float) (clone $query)->avg('rating'), 2),
            'revision_count' => (int) (clone $query)->sum('revision_count'),
            'ai_insight' => 'Insight AI bersifat ringkasan pendukung, bukan sumber kebenaran laporan.',
        ];
    }
}
