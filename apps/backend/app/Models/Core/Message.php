<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'reply_to_id',
        'body',
        'attachments',
        'mentioned_user_ids',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'attachments' => 'array',
        'mentioned_user_ids' => 'array',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function replyTo()
    {
        return $this->belongsTo(self::class, 'reply_to_id');
    }

    public function reads()
    {
        return $this->hasMany(MessageRead::class);
    }
}
