<?php

namespace App\Models\Odds;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskSkipRequest extends OddsModel
{
    protected $table = 'odds_task_skip_requests';

    protected $fillable = [
        'task_id',
        'designer_id',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_note',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
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
