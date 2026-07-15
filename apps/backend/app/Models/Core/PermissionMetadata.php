<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Permission;

class PermissionMetadata extends Model
{
    protected $table = 'permission_metadata';

    protected $fillable = [
        'permission_id',
        'application_id',
        'display_name',
        'group_key',
        'description',
        'sort_order',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }
}
