<?php

namespace App\Models\Odds;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DesignerDailyReport extends OddsModel
{
    protected $table = 'odds_designer_daily_reports';

    protected $fillable = [
        'report_date',
        'designer_id',
        'task_id',
        'category_id',
        'output_done',
        'active_work_duration_seconds',
        'revision_duration_seconds',
        'review_waiting_duration_seconds',
        'revision_count',
        'overdue',
        'quality_issue_flag',
        'rating',
        'final_status',
        'done_at',
        'score',
    ];

    protected $casts = [
        'report_date' => 'date',
        'output_done' => 'boolean',
        'overdue' => 'boolean',
        'quality_issue_flag' => 'boolean',
        'done_at' => 'datetime',
        'score' => 'decimal:2',
    ];

    public function designer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'designer_id');
    }
}
