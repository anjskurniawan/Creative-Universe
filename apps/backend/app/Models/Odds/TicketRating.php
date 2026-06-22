<?php

namespace App\Models\Odds;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketRating extends Model
{
    use HasFactory;

    protected $table = 'odds_ticket_ratings';

    protected $fillable = [
        'ticket_id',
        'rater_id',
        'quality_score',
        'speed_score',
        'communication_score',
        'overall_score',
        'feedback',
    ];

    protected $casts = [
        'quality_score' => 'integer',
        'speed_score' => 'integer',
        'communication_score' => 'integer',
        'overall_score' => 'decimal:2',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function rater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rater_id');
    }
}
