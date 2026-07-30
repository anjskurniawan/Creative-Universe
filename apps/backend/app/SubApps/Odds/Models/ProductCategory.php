<?php

namespace App\SubApps\Odds\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends OddsModel
{
    protected $table = 'odds_product_categories';

    protected $fillable = ['name', 'is_active', 'created_by', 'updated_by'];

    protected $casts = ['is_active' => 'boolean'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'product_category_id');
    }
}
