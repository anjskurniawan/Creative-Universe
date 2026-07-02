<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    public const CONTEXT_DIRECT = 'direct';

    public const CONTEXT_ODDS_TASK = 'odds_task';

    public const STATUS_OPEN = 'open';

    public const STATUS_CLOSED = 'closed';

    protected $fillable = [
        'context_type',
        'context_id',
        'status',
        'closed_at',
        'closed_reason',
    ];

    protected $casts = [
        'closed_at' => 'datetime',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
