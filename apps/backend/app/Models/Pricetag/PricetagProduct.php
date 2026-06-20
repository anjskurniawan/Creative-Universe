<?php

namespace App\Models\Pricetag;

use App\Models\Core\AssetLink;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PricetagProduct extends Model
{
    use LogsActivity, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'variant_name',
        'normal_price',
        'discount_price',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (auth()->check() && ! $model->created_by) {
                $model->created_by = auth()->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });

        static::deleting(function ($model) {
            if (auth()->check()) {
                $model->deleted_by = auth()->id();
                $model->save();
            }
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->useLogName('pricetag')
            ->setDescriptionForEvent(fn (string $eventName) => "[PRICETAG] Product {$eventName}");
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PricetagCategory::class, 'category_id');
    }

    public function assetLinks(): MorphMany
    {
        return $this->morphMany(AssetLink::class, 'linkable');
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
