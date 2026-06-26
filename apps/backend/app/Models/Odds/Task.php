<?php

namespace App\Models\Odds;

use App\Models\Core\AssetLink;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends OddsModel
{
    use SoftDeletes;

    protected $table = 'odds_tasks';

    protected $fillable = [
        'task_number',
        'request_type',
        'category_id',
        'category_snapshot',
        'requester_id',
        'preferred_designer_id',
        'assigned_designer_id',
        'design_purpose',
        'brief_text',
        'reference_visual',
        'deadline',
        'important_matrix',
        'attachment_notes',
        'status',
        'task_type',
        'workload_point',
        'priority_score',
        'brief_return_count',
        'leader_revision_count',
        'quality_issue_flag',
        'quality_issue_note',
        'normal_revision_count',
        'extra_revision_used_at',
        'extra_revision_approved_by',
        'urgent_revision_used_at',
        'urgent_revision_approved_by',
        'started_at',
        'finished_at',
        'approved_at',
        'done_at',
        'cancelled_at',
        'cancel_reason',
        'current_queue_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'category_snapshot' => 'array',
        'deadline' => 'datetime',
        'priority_score' => 'decimal:2',
        'brief_return_count' => 'integer',
        'leader_revision_count' => 'integer',
        'quality_issue_flag' => 'boolean',
        'normal_revision_count' => 'integer',
        'workload_point' => 'integer',
        'extra_revision_used_at' => 'datetime',
        'urgent_revision_used_at' => 'datetime',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'approved_at' => 'datetime',
        'done_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function preferredDesigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'preferred_designer_id');
    }

    public function assignedDesigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_designer_id');
    }

    public function brief(): HasOne
    {
        return $this->hasOne(TaskBrief::class, 'task_id');
    }

    public function queueEntries(): HasMany
    {
        return $this->hasMany(TaskQueue::class, 'task_id');
    }

    public function currentQueue(): BelongsTo
    {
        return $this->belongsTo(TaskQueue::class, 'current_queue_id');
    }

    public function timeLogs(): HasMany
    {
        return $this->hasMany(TaskTimeLog::class, 'task_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(TaskResult::class, 'task_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(TaskReview::class, 'task_id');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(TaskRevision::class, 'task_id');
    }

    public function skipRequests(): HasMany
    {
        return $this->hasMany(TaskSkipRequest::class, 'task_id');
    }

    public function cancelRequests(): HasMany
    {
        return $this->hasMany(TaskCancelRequest::class, 'task_id');
    }

    public function assetLinks(): MorphMany
    {
        return $this->morphMany(AssetLink::class, 'linkable');
    }
}
