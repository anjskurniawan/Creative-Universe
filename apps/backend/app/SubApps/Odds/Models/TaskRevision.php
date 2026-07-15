<?php

namespace App\SubApps\Odds\Models;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskRevision extends OddsModel
{
    use SoftDeletes;

    protected $table = 'odds_task_revisions';

    protected $fillable = [
        'task_id',
        'result_id',
        'requested_by',
        'assigned_to',
        'revision_type',
        'notes',
        'status',
        'is_urgent_final',
        'approved_by',
        'approved_at',
        'completed_at',
    ];

    protected $casts = [
        'is_urgent_final' => 'boolean',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
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
