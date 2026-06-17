<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Model AssetLink — SRD v6.2 Seksi 7.2 / ERD v1.0 Seksi 5.7
 *
 * Tabel polymorphic shared untuk menyimpan referensi URL
 * ke file eksternal (cloud link). Digunakan oleh semua Sub-App.
 */
class AssetLink extends Model
{
    use LogsActivity, SoftDeletes;

    protected $fillable = [
        'linkable_type',
        'linkable_id',
        'provider',
        'label',
        'url',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->useLogName('core-asset-link');
    }

    // ──────────────────────────────────────────────
    // Relations — ERD v1.0 Seksi 7.1
    // ──────────────────────────────────────────────

    public function linkable(): MorphTo
    {
        return $this->morphTo();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
