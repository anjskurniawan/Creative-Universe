<?php

namespace App\Jobs\Pricetag;

use App\Models\Pricetag\PricetagBatch;
use App\Models\Pricetag\PricetagBatchItem;
use App\Models\Pricetag\PricetagProduct;
use App\Services\GoogleAppScript\PricetagGeneratorService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GeneratePricetagChunkJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private int $batchId;

    private array $items;

    private int $userId;

    private string $userName;

    /**
     * Create a new job instance.
     *
     * @param  array  $items  Array of items like [['product_id' => 123, 'discount_price' => 100], ...]
     */
    public function __construct(int $batchId, array $items, int $userId, string $userName)
    {
        $this->batchId = $batchId;
        $this->items = $items;
        $this->userId = $userId;
        $this->userName = $userName;
    }

    /**
     * Execute the job.
     */
    public function handle(PricetagGeneratorService $generatorService): void
    {
        $batch = PricetagBatch::find($this->batchId);
        if (! $batch) {
            Log::warning("[PRICETAG] Batch ID {$this->batchId} not found in queue job.");

            return;
        }

        // If batch is already marked as failed, don't continue
        if ($batch->status === 'failed') {
            Log::warning("[PRICETAG] Batch ID {$this->batchId} is marked as failed, skipping chunk.");

            return;
        }

        if ($batch->status === 'pending') {
            $batch->update(['status' => 'processing']);
        }

        $successCount = 0;
        $failureCount = 0;

        foreach ($this->items as $item) {
            $productId = $item['product_id'] ?? null;
            $discountPrice = $item['discount_price'] ?? null;

            $product = PricetagProduct::find($productId);
            if (! $product) {
                Log::error("[PRICETAG] Product ID {$productId} not found during batch processing.");
                $failureCount++;
                $batch->increment('processed_items');

                continue;
            }

            // Update discount price (which triggers Spatie LogsActivity)
            if ($discountPrice !== null) {
                $product->update(['discount_price' => (int) $discountPrice]);
            }

            // Generate pricetag image via GAS
            $generated = $generatorService->generate($product, $this->userId, $this->userName);

            $status = $generated ? 'success' : 'failed';
            $errorMessage = $generated ? null : 'Failed to communicate with GAS server';

            PricetagBatchItem::updateOrCreate(
                ['batch_id' => $this->batchId, 'product_id' => $productId],
                ['status' => $status, 'error_message' => $errorMessage]
            );

            if ($generated) {
                $successCount++;
            } else {
                Log::error("[PRICETAG] Failed to generate pricetag for Product ID: {$productId} in Batch ID {$this->batchId}");
                $failureCount++;
            }

            // Increment processed items
            $batch->increment('processed_items');
        }

        // Refresh batch to get the latest processed items count
        $batch->refresh();

        if ($batch->processed_items >= $batch->total_items) {
            $newStatus = ($failureCount > 0 && $successCount === 0) ? 'failed' : 'completed';
            $batch->update(['status' => $newStatus]);
            Log::info("[PRICETAG] Batch ID {$this->batchId} finished processing. Status: {$newStatus}");
        }
    }
}
