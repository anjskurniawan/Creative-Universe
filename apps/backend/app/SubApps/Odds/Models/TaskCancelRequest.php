<?php

namespace App\SubApps\Odds\Models;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskCancelRequest extends OddsModel
{
    protected $table = 'odds_task_cancel_requests';

    protected $fillable = [
        'task_id',
        'requested_by',
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

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
