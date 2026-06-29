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
        'avatar_path',
        'settings',
        'is_onboarded',
        'division_id',
        'position_id',
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
            'password' => 'hashed',
            'settings' => 'array',
            'is_onboarded' => 'boolean',
        ];
    }

    // ──────────────────────────────────────────────
    // Activity Log — SRD v6.2 Seksi 11.7
    // ──────────────────────────────────────────────

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'name',
                'username',
                'email',
                'whatsapp_number',
                'avatar_path',
                'created_by',
                'updated_by',
                'deleted_by',
            ])
            ->logOnlyDirty()
            ->useLogName('core-user');
    }

    // ──────────────────────────────────────────────
    // Self-referencing Relations — ERD v1.0 Seksi 4.2
    // ──────────────────────────────────────────────

    // Removed approvedBy and approvedUsers relations

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

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    // ──────────────────────────────────────────────
    // Scopes — SRD v6.2 Seksi 5.4
    // ──────────────────────────────────────────────

    // Removed scopeActive and scopePending

    // ──────────────────────────────────────────────
    // Settings Helper Methods
    // ──────────────────────────────────────────────

    public function getSetting(string $key, $default = null)
    {
        return data_get($this->settings, $key, $default);
    }

    public function setSetting(string $key, $value): void
    {
        $settings = $this->settings ?? [];
        data_set($settings, $key, $value);
        $this->settings = $settings;
        $this->save();
    }
}
