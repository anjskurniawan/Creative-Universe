<?php

namespace App\Models\Odds;

use App\Enums\Odds\ImportantMatrixEnum;
use App\Enums\Odds\SlaStatusEnum;
use App\Enums\Odds\TicketStatusEnum;
use App\Models\Core\AssetLink;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Ticket extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    protected $table = 'odds_tickets';

    protected $fillable = [
        'ticket_number',
        'design_purpose',
        'requester_id',
        'assigned_to',
        'category_id',
        'brand',
        'channel',
        'important_matrix',
        'deadline',
        'status',
        'brief_score',
        'sla_status',
        'approved_at',
        'created_by',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'approved_at' => 'datetime',
        'important_matrix' => ImportantMatrixEnum::class,
        'status' => TicketStatusEnum::class,
        'sla_status' => SlaStatusEnum::class,
        'brief_score' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    // RELATIONS

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function assignedDesigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(DesignCategory::class, 'category_id');
    }

    public function brief(): HasOne
    {
        return $this->hasOne(TicketBrief::class, 'ticket_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(TicketVersion::class, 'ticket_id');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(TicketRevision::class, 'ticket_id');
    }

    public function rating(): HasOne
    {
        return $this->hasOne(TicketRating::class, 'ticket_id');
    }

    public function assetLinks(): MorphMany
    {
        return $this->morphMany(AssetLink::class, 'linkable');
    }
}
