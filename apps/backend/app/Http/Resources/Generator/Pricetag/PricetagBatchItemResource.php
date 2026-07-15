<?php

declare(strict_types=1);

namespace App\Http\Resources\Generator\Pricetag;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricetagBatchItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'batch_id' => $this->batch_id,
            'product_id' => $this->product_id,
            'status' => $this->status,
            'error_message' => $this->error_message,
            'product' => $this->whenLoaded('product', function () {
                return new PricetagProductResource($this->product);
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
