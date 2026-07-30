<?php

namespace App\SubApps\Odds\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends OddsModel
{
    protected $table = 'odds_products';

    protected $fillable = ['product_category_id', 'name', 'is_active', 'created_by', 'updated_by'];

    protected $casts = ['is_active' => 'boolean'];

    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }
}
