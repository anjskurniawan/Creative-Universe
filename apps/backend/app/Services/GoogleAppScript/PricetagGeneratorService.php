<?php

namespace App\Services\GoogleAppScript;

use App\Models\Core\AssetLink;
use App\Models\Pricetag\PricetagProduct;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PricetagGeneratorService
{
    private string $url;

    public function __construct()
    {
        $this->url = config('services.google.apps_script_pricetag_url', '');
    }

    /**
     * Generate pricetag image using GAS and save the links to asset_links table.
     */
    public function generate(PricetagProduct $product, int $userId, string $userName): bool
    {
        if (empty($this->url)) {
            Log::warning('[PRICETAG] Google Apps Script URL not configured');

            return false;
        }

        $category = $product->category;
        if (! $category) {
            Log::error("[PRICETAG] Product ID {$product->id} has no category relation");

            return false;
        }

        $fileName = str($product->name.'-'.($product->variant_name ?: ' '))->slug().'.jpg';

        $payload = [
            'user' => $userName,
            'category' => $category->name,
            'produk' => $product->name,
            'varian' => $product->variant_name ?: ' ',
            'hargaNormal' => (int) $product->normal_price,
            'hargaPotongan' => (int) $product->discount_price,
            'fileName' => $fileName,
        ];

        try {
            Log::info("[PRICETAG] Calling GAS API for Product: {$product->name} ({$product->variant_name})");

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->url, $payload);

            if (! $response->successful()) {
                Log::error('[PRICETAG] GAS API connection error', [
                    'product' => $product->name,
                    'variant' => $product->variant_name,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);

                return false;
            }

            $result = $response->json();

            if (! isset($result['status']) || $result['status'] !== 'success') {
                Log::error('[PRICETAG] GAS API error response', [
                    'product' => $product->name,
                    'variant' => $product->variant_name,
                    'response' => $result,
                ]);

                return false;
            }

            // Extract links
            $fileUrl = $result['file_url'] ?? '';
            $downloadUrl = $result['download_url'] ?? $fileUrl;

            if (empty($fileUrl)) {
                Log::error('[PRICETAG] GAS API returned empty file_url', [
                    'product' => $product->name,
                    'variant' => $product->variant_name,
                    'response' => $result,
                ]);

                return false;
            }

            // Remove existing asset links for this product
            $product->assetLinks()->delete();

            // Insert new asset links
            AssetLink::create([
                'linkable_type' => PricetagProduct::class,
                'linkable_id' => $product->id,
                'provider' => 'google_drive',
                'label' => 'Google Drive View Link',
                'url' => $fileUrl,
                'created_by' => $userId,
            ]);

            if (! empty($downloadUrl) && $downloadUrl !== $fileUrl) {
                AssetLink::create([
                    'linkable_type' => PricetagProduct::class,
                    'linkable_id' => $product->id,
                    'provider' => 'google_drive',
                    'label' => 'Google Drive Download Link',
                    'url' => $downloadUrl,
                    'created_by' => $userId,
                ]);
            }

            Log::info("[PRICETAG] Pricetag generated successfully for Product: {$product->name} ({$product->variant_name})");

            return true;

        } catch (\Exception $e) {
            Log::error('[PRICETAG] Exception during GAS API call: '.$e->getMessage(), [
                'product' => $product->name,
                'variant' => $product->variant_name,
            ]);

            return false;
        }
    }
}
