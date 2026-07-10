<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeworkTask extends Model
{
    protected $fillable = [
        'task_given_date',
        'task_name',
        'pic_vendor',
        'support_file_path',
        'deadline_date',
        'draft_file_path',
        'file_link',
        'status',
        'task_timestamps',
    ];

    protected $casts = [
        'task_given_date' => 'date',
        'deadline_date' => 'date',
        'task_timestamps' => 'array',
    ];

    public function users()
    {
        return $this->belongsToMany(\App\Models\Core\User::class, 'homework_task_user');
    }
}
