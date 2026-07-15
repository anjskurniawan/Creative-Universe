<?php

namespace App\SubApps\Generator\Pricetag\Models;

use Illuminate\Database\Eloquent\Model;

class PricetagBatchItem extends Model
{
    protected $table = 'generator_pricetag_batch_items';

    protected $fillable = [
        'batch_id',
        'product_id',
        'status',
        'error_message',
    ];

    public function batch()
    {
        return $this->belongsTo(PricetagBatch::class, 'batch_id');
    }

    public function product()
    {
        return $this->belongsTo(PricetagProduct::class, 'product_id');
    }
}
