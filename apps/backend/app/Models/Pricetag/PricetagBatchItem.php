<?php

namespace App\Models\Pricetag;

use Illuminate\Database\Eloquent\Model;

class PricetagBatchItem extends Model
{
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
