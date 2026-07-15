<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Application extends Model
{
    protected $fillable = [
        'key',
        'name',
        'display_name',
        'type',
        'status',
        'frontend_path',
        'api_prefix',
        'table_prefix',
        'description',
        'sort_order',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('granted_by')
            ->withTimestamps();
    }

    public function permissionMetadata(): HasMany
    {
        return $this->hasMany(PermissionMetadata::class);
    }
}
