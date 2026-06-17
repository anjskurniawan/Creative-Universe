<?php

namespace App\Models\Core;

use Database\Factories\Core\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

/**
 * Model User — SRD v6.2 Seksi 6.1 / ERD v1.0 Seksi 5.1
 *
 * Mendukung SoftDeletes — kebijakan data abadi,
 * data karyawan resign tidak pernah dihapus permanen.
 */
class User extends Authenticatable
{
    use HasFactory, HasRoles, LogsActivity, Notifiable, SoftDeletes;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return UserFactory::new();
    }

    protected $fillable = [
        'name',
        'username',
        'email',
        'whatsapp_number',
        'password',
        'is_active',
        'registration_note',
        'approved_by',
        'approved_at',
        'avatar_path',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'approved_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ──────────────────────────────────────────────
    // Activity Log — SRD v6.2 Seksi 11.7
    // ──────────────────────────────────────────────

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->useLogName('core-user');
    }

    // ──────────────────────────────────────────────
    // Self-referencing Relations — ERD v1.0 Seksi 4.2
    // ──────────────────────────────────────────────

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function approvedUsers(): HasMany
    {
        return $this->hasMany(User::class, 'approved_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    // ──────────────────────────────────────────────
    // Other Relations — ERD v1.0 Seksi 5.1
    // ──────────────────────────────────────────────

    public function assetLinks(): HasMany
    {
        return $this->hasMany(AssetLink::class, 'created_by');
    }

    // ──────────────────────────────────────────────
    // Scopes — SRD v6.2 Seksi 5.4
    // ──────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_active', false);
    }
}
