<?php

namespace App\Models\Odds;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskQueue extends OddsModel
{
    protected $table = 'odds_task_queue';

    protected $fillable = [
        'task_id',
        'designer_id',
        'queue_status',
        'task_type',
        'priority_score',
        'estimated_start_at',
        'estimated_finish_at',
        'skip_reason',
        'skipped_at',
        'scheduled_at',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'priority_score' => 'decimal:2',
        'estimated_start_at' => 'datetime',
        'estimated_finish_at' => 'datetime',
        'skipped_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function designer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'designer_id');
    }
}
