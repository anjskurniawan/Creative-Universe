<?php

namespace App\Models\Odds;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends OddsModel
{
    use SoftDeletes;

    protected $table = 'odds_categories';

    protected $fillable = [
        'name',
        'score_weight',
        'normal_revision_limit',
        'workload_point',
        'sla_days',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'score_weight' => 'decimal:2',
        'normal_revision_limit' => 'integer',
        'workload_point' => 'integer',
        'sla_days' => 'integer',
        'is_active' => 'boolean',
    ];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
