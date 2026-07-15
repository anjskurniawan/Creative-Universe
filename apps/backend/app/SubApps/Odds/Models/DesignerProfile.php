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
        'daily_capacity_points',
        'max_active_tasks',
        'assignment_priority',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'specializations' => 'array',
        'daily_capacity_points' => 'integer',
        'max_active_tasks' => 'integer',
        'assignment_priority' => 'integer',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
