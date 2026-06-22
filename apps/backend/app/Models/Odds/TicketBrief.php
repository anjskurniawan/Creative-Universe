<?php

namespace App\Models\Odds;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketBrief extends Model
{
    use HasFactory;

    protected $table = 'odds_ticket_briefs';

    protected $fillable = [
        'ticket_id',
        'description',
        'target_audience',
        'key_message',
        'required_outputs',
        'ai_summary',
    ];

    protected $casts = [
        'required_outputs' => 'array',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }
}
