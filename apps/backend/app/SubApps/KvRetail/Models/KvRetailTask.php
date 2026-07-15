<?php

namespace App\SubApps\KvRetail\Models;

use App\Models\Core\User;
use App\SubApps\KvRetail\Services\KvRetailTaskTimingService;
use Illuminate\Database\Eloquent\Model;

class KvRetailTask extends Model
{
    protected $table = 'kv_retail_tasks';

    protected $fillable = [
        'legacy_source',
        'legacy_id',
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
        'legacy_id' => 'integer',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'kv_retail_task_user', 'kv_retail_task_id', 'user_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getTimingEvaluationAttribute(): array
    {
        return app(KvRetailTaskTimingService::class)->evaluate($this);
    }

    protected $appends = ['timing_evaluation'];
}
