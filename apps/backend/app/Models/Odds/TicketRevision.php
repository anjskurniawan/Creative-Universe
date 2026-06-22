<?php

namespace App\Models\Odds;

use App\Enums\Odds\RevisionTypeEnum;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketRevision extends Model
{
    use HasFactory;

    protected $table = 'odds_ticket_revisions';

    protected $fillable = [
        'ticket_id',
        'version_id',
        'requested_by',
        'revision_type',
        'notes',
        'revision_deadline',
        'status',
    ];

    protected $casts = [
        'revision_type' => RevisionTypeEnum::class,
        'revision_deadline' => 'datetime',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(TicketVersion::class, 'version_id');
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
