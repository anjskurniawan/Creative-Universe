<?php

namespace App\Models\Odds;

use Illuminate\Database\Eloquent\SoftDeletes;

class SystemRule extends OddsModel
{
    use SoftDeletes;

    protected $table = 'odds_system_rules';

    protected $fillable = [
        'key',
        'value',
        'description',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'value' => 'array',
        'is_active' => 'boolean',
    ];
}
