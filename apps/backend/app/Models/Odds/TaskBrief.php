<?php

namespace App\Models\Odds;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskBrief extends OddsModel
{
    protected $table = 'odds_task_briefs';

    protected $fillable = [
        'task_id',
        'content',
        'reference_visual',
        'attachments',
        'last_return_note',
        'ai_summary',
        'updated_by',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
