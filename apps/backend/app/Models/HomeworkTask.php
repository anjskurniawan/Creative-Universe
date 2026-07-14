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
        'delay_reasons',
        'created_by',
    ];

    protected $casts = [
        'task_given_date' => 'date',
        'deadline_date' => 'date',
        'task_timestamps' => 'array',
        'delay_reasons' => 'array',
        'support_file_path' => 'array',
        'draft_file_path' => 'array',
    ];

    public function users()
    {
        return $this->belongsToMany(\App\Models\Core\User::class, 'homework_task_user');
    }

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\Core\User::class, 'created_by');
    }

    public function getTimingEvaluationAttribute(): array
    {
        return app(\App\Services\HomeworkTaskTimingService::class)->evaluate($this);
    }

    protected $appends = ['timing_evaluation'];
}
