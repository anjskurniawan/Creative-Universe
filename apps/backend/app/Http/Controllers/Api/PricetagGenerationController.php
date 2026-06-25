<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\ChecklistPricetagGenerationRequest;
use App\Http\Requests\Api\CsvPricetagGenerationRequest;
use App\Http\Requests\Api\SinglePricetagGenerationRequest;
use App\Http\Resources\PricetagBatchResource;
use App\Http\Resources\PricetagProductResource;
use App\Jobs\Pricetag\GeneratePricetagChunkJob;
use App\Models\Pricetag\PricetagBatch;
use App\Models\Pricetag\PricetagProduct;
use App\Services\GoogleAppScript\PricetagGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PricetagGenerationController extends BaseApiController
{
    /**
     * Generate a single product pricetag synchronously.
     */
    public function single(SinglePricetagGenerationRequest $request, PricetagGeneratorService $generatorService): JsonResponse
    {
        $productId = $request->integer('product_id');
        $discountPrice = $request->integer('discount_price');

        $product = PricetagProduct::findOrFail($productId);
        $user = $request->user();

        // Update discount price (triggers activity logging via Spatie LogsActivity)
        $product->update([
            'discount_price' => $discountPrice,
        ]);

        // Call Google Apps Script Service
        $success = $generatorService->generate($product, $user->id, $user->name);

        // Record history
        $batchName = $product->name.($product->variant_name !== ' ' ? ' - '.$product->variant_name : '');
        $batch = PricetagBatch::create([
            'batch_name' => $batchName,
            'status' => $success ? 'completed' : 'failed',
            'total_items' => 1,
            'processed_items' => $success ? 1 : 0,
            'created_by' => $user->id,
        ]);

        $batch->items()->create([
            'product_id' => $product->id,
            'status' => $success ? 'success' : 'failed',
            'error_message' => $success ? null : 'Gagal memproses gambar label harga promo.',
        ]);

        if (! $success) {
            return $this->sendError('Gagal membuat gambar label promo. Silakan coba beberapa saat lagi.', [], 500);
        }

        $product->refresh();
        $product->load(['category', 'assetLinks']);

        return $this->sendResponse(
            new PricetagProductResource($product),
            "Label harga untuk produk {$product->name} berhasil dibuat."
        );
    }

    /**
     * Generate pricetags from a checklist selection asynchronously.
     */
    public function checklist(ChecklistPricetagGenerationRequest $request): JsonResponse
    {
        $user = $request->user();
        $n = PricetagBatch::where('created_by', $user->id)->count();
        $batchName = 'Pritag #'.($n + 1);
        $itemsInput = $request->input('items');

        $itemsToProcess = [];
        foreach ($itemsInput as $item) {
            $prod = PricetagProduct::find($item['product_id']);
            if ($prod) {
                $discountPrice = isset($item['discount_price']) ? (int) $item['discount_price'] : $prod->discount_price;
                $itemsToProcess[] = [
                    'product_id' => $prod->id,
                    'discount_price' => $discountPrice,
                ];
            }
        }

        if (empty($itemsToProcess)) {
            return $this->sendError('Tidak ada produk valid yang dipilih.', [], 400);
        }

        // Create batch record
        $batch = PricetagBatch::create([
            'batch_name' => $batchName,
            'status' => 'pending',
            'total_items' => count($itemsToProcess),
            'processed_items' => 0,
            'created_by' => $user->id,
        ]);

        // Create pending batch items
        foreach ($itemsToProcess as $item) {
            $batch->items()->create([
                'product_id' => $item['product_id'],
                'status' => 'pending',
            ]);
        }

        // Chunk items into groups of 5
        $chunks = array_chunk($itemsToProcess, 5);

        foreach ($chunks as $chunk) {
            GeneratePricetagChunkJob::dispatch($batch->id, $chunk, $user->id, $user->name);
        }

        return $this->sendResponse(
            new PricetagBatchResource($batch),
            "Pembuatan label untuk kelompok '{$batch->batch_name}' ({$batch->total_items} produk) telah masuk antrean.",
            201
        );
    }

    /**
     * Generate pricetags from a CSV file upload asynchronously.
     */
    public function csv(CsvPricetagGenerationRequest $request): JsonResponse
    {
        $user = $request->user();
        $n = PricetagBatch::where('created_by', $user->id)->count();
        $batchName = 'CSV #'.($n + 1);
        $uploadedFile = $request->file('file');

        $path = $uploadedFile->getRealPath();
        $file = fopen($path, 'r');

        if (! $file) {
            return $this->sendError('Gagal membuka file CSV.', [], 400);
        }

        // Parse header
        $header = fgetcsv($file, 1000, ',');

        // If not comma-separated, check for semicolon
        if (count($header) <= 1 && str_contains($header[0] ?? '', ';')) {
            rewind($file);
            $header = fgetcsv($file, 1000, ';');
            $separator = ';';
        } else {
            $separator = ',';
        }

        // Normalize header columns
        $header = array_map(function ($h) {
            return strtolower(trim(preg_replace('/[\x{00EF}\x{00BB}\x{00BF}]/u', '', $h)));
        }, $header);

        $prodIdx = array_search('product', $header);
        if ($prodIdx === false) {
            $prodIdx = array_search('produk', $header);
        }
        if ($prodIdx === false) {
            $prodIdx = array_search('product_name', $header);
        }
        if ($prodIdx === false) {
            $prodIdx = array_search('nama_produk', $header);
        }

        $varIdx = array_search('variant', $header);
        if ($varIdx === false) {
            $varIdx = array_search('varian', $header);
        }
        if ($varIdx === false) {
            $varIdx = array_search('variant_name', $header);
        }
        if ($varIdx === false) {
            $varIdx = array_search('nama_varian', $header);
        }
        if ($varIdx === false) {
            $varIdx = array_search('variant', $header);
        }

        $discountIdx = array_search('discount_price', $header);
        if ($discountIdx === false) {
            $discountIdx = array_search('harga_diskon', $header);
        }
        if ($discountIdx === false) {
            $discountIdx = array_search('harga_promo', $header);
        }
        if ($discountIdx === false) {
            $discountIdx = array_search('harga diskon', $header);
        }

        if ($prodIdx === false || $discountIdx === false) {
            fclose($file);

            return $this->sendError('File CSV harus memiliki kolom "produk" dan "harga diskon".', [
                'file' => ['File CSV harus memiliki kolom "produk" dan "harga diskon".'],
            ], 422);
        }

        $itemsToProcess = [];
        $invalidProducts = [];
        $lineNum = 1;

        while (($row = fgetcsv($file, 1000, $separator)) !== false) {
            $lineNum++;
            if (empty($row) || count($row) < max($prodIdx, $discountIdx) + 1) {
                continue;
            }

            $productName = trim($row[$prodIdx]);
            $variantName = $varIdx !== false ? trim($row[$varIdx]) : ' ';
            $discountPrice = trim($row[$discountIdx]);

            if (empty($productName)) {
                continue;
            }

            // Verify product existence
            $productModel = PricetagProduct::where('name', $productName)
                ->where('variant_name', $variantName ?: ' ')
                ->first();

            if (! $productModel) {
                $invalidProducts[] = "{$productName} Varian: ".($variantName ?: ' ')." (baris {$lineNum})";
            } else {
                $itemsToProcess[] = [
                    'product_id' => $productModel->id,
                    'discount_price' => (int) $discountPrice,
                ];
            }
        }

        fclose($file);

        if (! empty($invalidProducts)) {
            return $this->sendError('Produk berikut tidak terdaftar di database: '.implode(', ', $invalidProducts), [
                'file' => ['Produk berikut tidak terdaftar di database: '.implode(', ', $invalidProducts)],
            ], 422);
        }

        if (empty($itemsToProcess)) {
            return $this->sendError('File CSV tidak memiliki data yang valid.', [
                'file' => ['File CSV tidak memiliki data yang valid.'],
            ], 422);
        }

        // Create batch record
        $batch = PricetagBatch::create([
            'batch_name' => $batchName,
            'status' => 'pending',
            'total_items' => count($itemsToProcess),
            'processed_items' => 0,
            'created_by' => $user->id,
        ]);

        // Create pending batch items
        foreach ($itemsToProcess as $item) {
            $batch->items()->create([
                'product_id' => $item['product_id'],
                'status' => 'pending',
            ]);
        }

        // Chunk items into groups of 5
        $chunks = array_chunk($itemsToProcess, 5);

        foreach ($chunks as $chunk) {
            GeneratePricetagChunkJob::dispatch($batch->id, $chunk, $user->id, $user->name);
        }

        return $this->sendResponse(
            new PricetagBatchResource($batch),
            "Pembuatan label massal '{$batch->batch_name}' ({$batch->total_items} produk) telah masuk antrean.",
            201
        );
    }

    /**
     * Get list of pricetag generation batches.
     * History scope: creator sees their own, Root can see all.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = PricetagBatch::query()->with(['creator', 'items.product.assetLinks']);

        if (! $user->hasRole('Root')) {
            $query->where('created_by', $user->id);
        }

        $sortBy = in_array($request->input('sort_by'), ['id', 'batch_name', 'status', 'total_items', 'processed_items', 'created_at'], true)
            ? (string) $request->input('sort_by')
            : 'created_at';
        $sortOrder = strtolower((string) $request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $perPage = min(max($request->integer('per_page', 10), 1), 100);

        $batches = $query->orderBy($sortBy, $sortOrder)->paginate($perPage);

        return $this->sendResponse(
            PricetagBatchResource::collection($batches->items()),
            'Daftar riwayat batch berhasil diambil.',
            200,
            [
                'current_page' => $batches->currentPage(),
                'last_page' => $batches->lastPage(),
                'per_page' => $batches->perPage(),
                'total' => $batches->total(),
            ]
        );
    }

    /**
     * View batch details and items.
     * Restricted to creator or Root.
     */
    public function show(PricetagBatch $batch, Request $request): JsonResponse
    {
        $user = $request->user();

        if ($batch->created_by !== $user->id && ! $user->hasRole('Root')) {
            return $this->sendError('Akses ditolak.', [], 403);
        }

        $batch->load(['creator', 'items.product.assetLinks', 'items.product.category']);

        return $this->sendResponse(
            new PricetagBatchResource($batch),
            'Detail batch berhasil diambil.'
        );
    }

    /**
     * Download all successfully generated pricetags in a batch as a ZIP.
     */
    public function downloadZip(PricetagBatch $batch, Request $request)
    {
        $user = $request->user();

        // Authorization check
        if ($batch->created_by !== $user->id && ! $user->hasRole('Root')) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak.',
            ], 403);
        }

        if (! class_exists('ZipArchive')) {
            return response()->json([
                'success' => false,
                'message' => 'Ekstensi PHP zip (ZipArchive) tidak aktif di server ini.',
            ], 500);
        }

        $batch->load('items.product.assetLinks');

        if ($batch->status !== 'completed' && $batch->processed_items === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Batch ini belum selesai diproses atau tidak memiliki item sukses.',
            ], 400);
        }

        $zipFileName = 'pricetag-batch-'.Str::slug($batch->batch_name).'-'.$batch->id.'.zip';
        $zipPath = storage_path('app/public/'.$zipFileName);

        $zip = new \ZipArchive;
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            $hasFiles = false;

            foreach ($batch->items as $item) {
                if ($item->status !== 'success') {
                    continue;
                }

                $product = $item->product;
                if (! $product) {
                    continue;
                }

                $downloadLink = $product->assetLinks->firstWhere('label', 'Google Drive Download Link')?->url;
                if (! $downloadLink) {
                    $downloadLink = $product->assetLinks->firstWhere('label', 'Google Drive View Link')?->url;
                }

                if ($downloadLink) {
                    // Convert Drive View URL to Direct Download link if necessary
                    if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $downloadLink, $matches)) {
                        $downloadLink = 'https://drive.google.com/uc?export=download&id='.$matches[1];
                    }

                    try {
                        // Download the file from Google Drive (timeout 15 seconds)
                        $response = Http::timeout(15)->get($downloadLink);
                        if ($response->successful()) {
                            $fileContent = $response->body();

                            // Ensure it's not an HTML page (like drive error confirmation page)
                            if (str_contains($response->header('Content-Type', ''), 'text/html')) {
                                Log::warning("[ZIP] Downloaded content for Product: {$product->name} is HTML instead of image data.");

                                continue;
                            }

                            $fileName = str($product->name.'-'.($product->variant_name ?: ' '))->slug().'.jpg';
                            $zip->addFromString($fileName, $fileContent);
                            $hasFiles = true;
                        } else {
                            Log::error("[ZIP] Failed to fetch file for Product: {$product->name}. Status: ".$response->status());
                        }
                    } catch (\Exception $e) {
                        Log::error("[ZIP] Exception downloading file for Product: {$product->name}: ".$e->getMessage());
                    }
                }
            }

            $zip->close();

            if ($hasFiles) {
                return response()->download($zipPath)->deleteFileAfterSend(true);
            } else {
                if (file_exists($zipPath)) {
                    @unlink($zipPath);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengunduh gambar untuk semua item di kelompok ini.',
                ], 400);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat file ZIP di server.',
            ], 500);
        }
    }
}
