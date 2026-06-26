<?php

namespace App\Models\Odds;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DesignerRanking extends OddsModel
{
    protected $table = 'odds_designer_rankings';

    protected $fillable = [
        'period_type',
        'period_start',
        'period_end',
        'designer_id',
        'total_output',
        'total_score',
        'total_work_duration_seconds',
        'total_revision_duration_seconds',
        'total_revision_count',
        'overdue_count',
        'average_rating',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'total_score' => 'decimal:2',
        'average_rating' => 'decimal:2',
    ];

    public function designer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'designer_id');
    }
}
