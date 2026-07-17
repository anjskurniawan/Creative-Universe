<?php

namespace App\SubApps\CreativeReport\Models;

use App\Models\Core\Position;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CreativeMember extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_RESIGNED = 'resigned';

    protected $table = 'creative_report_members';

    protected $fillable = [
        'user_id', 'name', 'position_id', 'position_name', 'status', 'joined_at',
        'resigned_at', 'reviewed_by', 'reviewed_at',
    ];

    protected function casts(): array
    {
        return ['joined_at' => 'datetime', 'resigned_at' => 'datetime', 'reviewed_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class, 'creative_report_member_id');
    }

    public function isManager(): bool
    {
        return $this->position_name === 'Manajer';
    }
}
