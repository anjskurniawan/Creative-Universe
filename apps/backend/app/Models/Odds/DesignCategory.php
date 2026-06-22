<?php

namespace App\Models\Odds;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DesignCategory extends Model
{
    use HasFactory;

    protected $table = 'odds_design_categories';

    protected $fillable = [
        'name',
        'sla_days',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sla_days' => 'integer',
    ];

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'category_id');
    }
}
