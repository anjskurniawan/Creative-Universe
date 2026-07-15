<?php

namespace App\SubApps\Odds\Models;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskReview extends OddsModel
{
    protected $table = 'odds_task_reviews';

    protected $fillable = [
        'task_id',
        'result_id',
        'reviewer_id',
        'review_type',
        'decision',
        'notes',
        'rating',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function result(): BelongsTo
    {
        return $this->belongsTo(TaskResult::class, 'result_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
