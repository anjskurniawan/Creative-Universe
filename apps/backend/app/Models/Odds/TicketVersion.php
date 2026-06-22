<?php

namespace App\Models\Odds;

use App\Enums\Odds\TicketStatusEnum;
use App\Models\Core\AssetLink;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class TicketVersion extends Model
{
    use HasFactory;

    protected $table = 'odds_ticket_versions';

    protected $fillable = [
        'ticket_id',
        'version_number',
        'submitted_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'version_number' => 'integer',
        'status' => TicketStatusEnum::class,
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(TicketRevision::class, 'version_id');
    }

    public function assetLinks(): MorphMany
    {
        return $this->morphMany(AssetLink::class, 'linkable');
    }
}
