<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricetagProductResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $viewLink = $this->assetLinks->firstWhere('label', 'Google Drive View Link');
        $downloadLink = $this->assetLinks->firstWhere('label', 'Google Drive Download Link') ?? $viewLink;

        return [
            'id' => $this->id,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ],
            'name' => $this->name,
            'variant_name' => $this->variant_name ?: 'Default',
            'normal_price' => $this->normal_price,
            'discount_price' => $this->discount_price,
            'is_ready' => $viewLink !== null,
            'preview_url' => $viewLink?->url,
            'download_url' => $downloadLink?->url,
            'asset_updated_at' => $viewLink?->updated_at?->toIso8601String(),
            'generator_path' => "/pricetag/generator?product_id={$this->id}",
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
