<?php

namespace App\SubApps\Odds\Models;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DesignerProfile extends OddsModel
{
    use SoftDeletes;

    protected $table = 'odds_designer_profiles';

    protected $fillable = [
        'user_id',
        'status',
        'specializations',
        'leave_dates',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'specializations' => 'array',
        'leave_dates' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'current_load_minutes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_designer_id', 'user_id');
    }

    public function getCurrentLoadMinutesAttribute(): int
    {
        return $this->tasks()
            ->whereIn('status', ['queued', 'ready_to_start', 'in_progress'])
            ->get()
            ->sum(function ($task) {
                return $task->category_snapshot['sla_minutes'] ?? 0;
            });
    }
}
