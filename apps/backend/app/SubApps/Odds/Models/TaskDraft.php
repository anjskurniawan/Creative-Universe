<?php

namespace App\SubApps\Odds\Models;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskDraft extends OddsModel
{
    protected $table = 'odds_task_drafts';

    protected $fillable = [
        'requester_id',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }
}
