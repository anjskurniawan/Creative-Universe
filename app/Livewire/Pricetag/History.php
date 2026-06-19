<?php

namespace App\Livewire\Pricetag;

use App\Models\Pricetag\PricetagBatch;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Livewire\Attributes\On;
use Livewire\Component;
use Livewire\WithPagination;

class History extends Component
{
    use WithPagination;

    /**
     * Download all successful generated images in a batch as a ZIP archive.
     */
    public function downloadZip($batchId)
    {
        if (! class_exists('ZipArchive')) {
            session()->flash('error', 'Ekstensi PHP zip (ZipArchive) tidak aktif di server ini. Silakan hubungi administrator.');

            return;
        }

        $batch = PricetagBatch::with('items.product.assetLinks')->findOrFail($batchId);

        if ($batch->status !== 'completed' && $batch->processed_items === 0) {
            session()->flash('error', 'Batch ini belum selesai diproses atau tidak memiliki item sukses.');

            return;
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
                        // Download the file from Google Drive
                        $response = Http::timeout(15)->get($downloadLink);
                        if ($response->successful()) {
                            $fileContent = $response->body();

                            // Check if the response is HTML (Google Drive page error / confirmation)
                            if (str_contains($response->header('Content-Type'), 'text/html')) {
                                Log::warning("[ZIP] Downloaded content for Product: {$product->name} is HTML instead of image data.");

                                continue;
                            }

                            $fileName = str($product->name . '-' . ($product->variant_name ?: 'Default'))->slug() . '.jpg';
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
                session()->flash('error', 'Gagal mengunduh gambar untuk semua item di kelompok ini (pastikan file hasil label dapat diakses).');
            }
        } else {
            session()->flash('error', 'Gagal membuat file ZIP di server.');
        }
    }

    #[On('pricetag-batch-updated')]
    public function refreshBatches(): void
    {
        // Re-render batches list
    }

    public function render()
    {
        $batches = PricetagBatch::query()
            ->with(['creator', 'items.product.assetLinks'])
            ->latest()
            ->paginate(10);

        // Check if there are any active (pending/processing) batches to trigger polling
        $hasActiveBatches = PricetagBatch::whereIn('status', ['pending', 'processing'])->exists();

        return view('livewire.pricetag.history', compact('batches', 'hasActiveBatches'));
    }
}
