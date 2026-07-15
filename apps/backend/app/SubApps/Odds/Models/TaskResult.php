<?php

namespace App\SubApps\Odds\Models;

use App\Models\Core\AssetLink;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskResult extends OddsModel
{
    use SoftDeletes;

    protected $table = 'odds_task_results';

    protected $fillable = [
        'task_id',
        'version_number',
        'submitted_by',
        'result_notes',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'version_number' => 'integer',
        'submitted_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function assetLinks(): MorphMany
    {
        return $this->morphMany(AssetLink::class, 'linkable');
    }
}
