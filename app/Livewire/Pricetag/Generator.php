<?php

namespace App\Livewire\Pricetag;

use App\Jobs\Pricetag\GeneratePricetagChunkJob;
use App\Livewire\Forms\Pricetag\BulkUploadForm;
use App\Models\Pricetag\PricetagBatch;
use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use App\Services\GoogleAppScript\PricetagGeneratorService;
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\WithPagination;

class Generator extends Component
{
    use WithFileUploads, WithPagination;

    public BulkUploadForm $bulkForm;

    // Wizard state for Single Generator tab
    public int $wizardStep = 1;

    public ?int $wizardCategoryId = null;

    public ?string $wizardProductName = null;

    public ?int $wizardProductId = null;

    public ?int $wizardDiscountPrice = null;

    // Wizard search filters
    public string $wizardCategorySearch = '';

    public string $wizardProductSearch = '';

    public string $wizardVariantSearch = '';

    public ?PricetagProduct $selectedProductModel = null;

    // Output URL from single generate
    public ?string $generatedViewUrl = null;

    public ?string $generatedDownloadUrl = null;

    // Tab state: 'single', 'checklist', or 'bulk'
    public string $activeTab = 'single';

    // Checklist tab state
    public array $selectedVariants = [];

    public array $checklistPrices = [];

    public string $checklistBatchName = '';

    public string $checklistSearch = '';

    protected $queryString = [
        'activeTab' => ['except' => 'single'],
        'checklistSearch' => ['except' => ''],
    ];

    public function mount(): void
    {
        //
    }

    public function updatingChecklistSearch(): void
    {
        $this->resetPage();
    }

    /**
     * Wizard Navigation Methods
     */
    public function selectWizardCategory(int $categoryId): void
    {
        $this->wizardCategoryId = $categoryId;
        $this->wizardProductName = null;
        $this->wizardProductId = null;
        $this->wizardDiscountPrice = null;
        $this->selectedProductModel = null;

        $this->wizardProductSearch = '';
        $this->wizardVariantSearch = '';

        $this->wizardStep = 2;
    }

    public function selectWizardProduct(string $productName): void
    {
        $this->wizardProductName = $productName;
        $this->wizardProductId = null;
        $this->wizardDiscountPrice = null;
        $this->selectedProductModel = null;

        $this->wizardVariantSearch = '';

        // Fetch variant options under this category & product name
        $variants = PricetagProduct::where('category_id', $this->wizardCategoryId)
            ->where('name', $productName)
            ->orderBy('variant_name')
            ->get();

        // If there's only one variant, and its name is "Default" (or empty),
        // we can automatically select it and skip straight to Step 4
        if (count($variants) === 1) {
            $variant = $variants[0];
            if ($variant->variant_name === 'Default' || empty($variant->variant_name)) {
                $this->selectWizardVariant($variant->id);

                return;
            }
        }

        $this->wizardStep = 3;
    }

    public function selectWizardVariant(int $productId): void
    {
        $this->wizardProductId = $productId;
        $this->selectedProductModel = PricetagProduct::findOrFail($productId);
        $this->wizardDiscountPrice = $this->selectedProductModel->discount_price ?: 0;
        $this->wizardStep = 4;
    }

    public function backFromStep4(): void
    {
        $variants = PricetagProduct::where('category_id', $this->wizardCategoryId)
            ->where('name', $this->wizardProductName)
            ->orderBy('variant_name')
            ->get();

        if (count($variants) === 1) {
            $variant = $variants[0];
            if ($variant->variant_name === 'Default' || empty($variant->variant_name)) {
                $this->wizardStep = 2;

                return;
            }
        }
        $this->wizardStep = 3;
    }

    public function generateSingleWizard(): void
    {
        $this->validate([
            'wizardDiscountPrice' => 'required|integer|min:0',
        ], [
            'wizardDiscountPrice.required' => 'Harga promo wajib diisi.',
            'wizardDiscountPrice.integer' => 'Harga promo harus berupa angka.',
            'wizardDiscountPrice.min' => 'Harga promo tidak boleh kurang dari 0.',
        ]);

        $product = $this->selectedProductModel;
        $product->update([
            'discount_price' => (int) $this->wizardDiscountPrice,
        ]);

        $this->wizardStep = 5; // Go to Loading Bar step (instantly renders, then triggers processSingleGeneration)
    }

    public function processSingleGeneration(PricetagGeneratorService $generatorService): void
    {
        if ($this->wizardStep !== 5) {
            return;
        }

        $product = $this->selectedProductModel;
        $user = auth()->user();

        // Trigger external system process
        $success = $generatorService->generate($product, $user->id, $user->name);

        // Record history
        $batch = PricetagBatch::create([
            'batch_name' => 'Single: '.$product->name.($product->variant_name !== 'Default' ? ' ('.$product->variant_name.')' : ''),
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

        if ($success) {
            $product->refresh();
            $viewLink = $product->assetLinks->firstWhere('label', 'Google Drive View Link');
            $downloadLink = $product->assetLinks->firstWhere('label', 'Google Drive Download Link');

            $this->generatedViewUrl = $viewLink ? $viewLink->url : null;
            $this->generatedDownloadUrl = $downloadLink ? $downloadLink->url : ($viewLink ? $viewLink->url : null);

            $this->wizardStep = 6; // Go to Result step
            session()->flash('success_single', "Label harga untuk produk {$product->name} berhasil dibuat!");
        } else {
            $this->wizardStep = 4; // Return to Input Price step on failure
            session()->flash('error_single', 'Gagal membuat gambar label promo. Silakan coba beberapa saat lagi.');
        }
    }

    public function resetWizard(): void
    {
        $this->wizardStep = 1;
        $this->wizardCategoryId = null;
        $this->wizardProductName = null;
        $this->wizardProductId = null;
        $this->wizardDiscountPrice = null;
        $this->selectedProductModel = null;
        $this->generatedViewUrl = null;
        $this->generatedDownloadUrl = null;
        $this->wizardCategorySearch = '';
        $this->wizardProductSearch = '';
        $this->wizardVariantSearch = '';
    }

    /**
     * Handle bulk generation for selected checkbox items.
     */
    public function generateChecklist(): void
    {
        $this->validate([
            'checklistBatchName' => 'required|string|max:255',
            'selectedVariants' => 'required|array|min:1',
        ], [
            'checklistBatchName.required' => 'Nama kelompok promo wajib diisi.',
            'selectedVariants.required' => 'Pilih minimal satu produk untuk dibuat labelnya.',
            'selectedVariants.min' => 'Pilih minimal satu produk untuk dibuat labelnya.',
        ]);

        $productsToProcess = PricetagProduct::whereIn('id', $this->selectedVariants)->get();

        $items = [];
        foreach ($productsToProcess as $prod) {
            $inputPrice = $this->checklistPrices[$prod->id] ?? null;
            $discountPrice = ($inputPrice !== null && $inputPrice !== '') ? (int) $inputPrice : $prod->discount_price;

            $items[] = [
                'product_id' => $prod->id,
                'discount_price' => $discountPrice,
            ];
        }

        if (empty($items)) {
            session()->flash('error_checklist', 'Tidak ada item valid yang dipilih.');

            return;
        }

        // Create batch record
        $user = auth()->user();
        $batch = PricetagBatch::create([
            'batch_name' => $this->checklistBatchName,
            'status' => 'pending',
            'total_items' => count($items),
            'processed_items' => 0,
            'created_by' => $user->id,
        ]);

        // Chunk items into groups of 5
        $chunks = array_chunk($items, 5);

        foreach ($chunks as $chunk) {
            GeneratePricetagChunkJob::dispatch($batch->id, $chunk, $user->id, $user->name);
        }

        // Reset state
        $this->selectedVariants = [];
        $this->checklistPrices = [];
        $this->checklistBatchName = '';
        $this->checklistSearch = '';
        $this->resetPage();

        session()->flash('success_checklist', "Pembuatan label untuk kelompok '{$batch->batch_name}' (sebanyak ".count($items).' produk) telah berhasil masuk antrean sistem!');

        // Redirect to history page to view progress
        $this->redirect(route('pricetag.history'), navigate: true);
    }

    /**
     * Handle bulk CSV upload & job queue distribution.
     */
    public function generateBulk(): void
    {
        $this->bulkForm->validate();

        $path = $this->bulkForm->csvFile->getRealPath();
        $file = fopen($path, 'r');

        if (! $file) {
            session()->flash('error_bulk', 'Gagal membuka file CSV.');

            return;
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

        // Normalize header columns (remove whitespace and BOM if present)
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

        $discountIdx = array_search('discount_price', $header);
        if ($discountIdx === false) {
            $discountIdx = array_search('harga_diskon', $header);
        }
        if ($discountIdx === false) {
            $discountIdx = array_search('harga_promo', $header);
        }

        if ($prodIdx === false || $discountIdx === false) {
            fclose($file);
            $this->addError('bulkForm.csvFile', 'File CSV harus memiliki kolom "produk" dan "harga_diskon".');

            return;
        }

        $items = [];
        $invalidProducts = [];
        $lineNum = 1;

        while (($row = fgetcsv($file, 1000, $separator)) !== false) {
            $lineNum++;
            if (empty($row) || count($row) < max($prodIdx, $discountIdx) + 1) {
                continue;
            }

            $productName = trim($row[$prodIdx]);
            $variantName = $varIdx !== false ? trim($row[$varIdx]) : 'Default';
            $discountPrice = trim($row[$discountIdx]);

            if (empty($productName)) {
                continue;
            }

            // Verify product existence
            $productModel = PricetagProduct::where('name', $productName)
                ->where('variant_name', $variantName ?: 'Default')
                ->first();

            if (! $productModel) {
                $invalidProducts[] = "{$productName} Varian: ".($variantName ?: 'Default')." (baris {$lineNum})";
            } else {
                $items[] = [
                    'product_id' => $productModel->id,
                    'discount_price' => (int) $discountPrice,
                ];
            }
        }

        fclose($file);

        if (! empty($invalidProducts)) {
            $this->addError('bulkForm.csvFile', 'Produk berikut tidak terdaftar di database: '.implode(', ', $invalidProducts));

            return;
        }

        if (empty($items)) {
            $this->addError('bulkForm.csvFile', 'File CSV tidak memiliki data yang valid.');

            return;
        }

        // Create batch record
        $user = auth()->user();
        $batch = PricetagBatch::create([
            'batch_name' => $this->bulkForm->batchName,
            'status' => 'pending',
            'total_items' => count($items),
            'processed_items' => 0,
            'created_by' => $user->id,
        ]);

        // Chunk items into groups of 5 (Google execution limit safety margin)
        $chunks = array_chunk($items, 5);

        foreach ($chunks as $chunk) {
            GeneratePricetagChunkJob::dispatch($batch->id, $chunk, $user->id, $user->name);
        }

        // Reset bulk form state
        $this->bulkForm->reset();

        session()->flash('success_bulk', "Pembuatan label massal '{$batch->batch_name}' (sebanyak ".count($items).' produk) telah berhasil masuk antrean sistem!');

        // Redirect to history page to view progress
        $this->redirect(route('pricetag.history'), navigate: true);
    }

    public function selectTab(string $tab): void
    {
        $this->activeTab = $tab;
        $this->resetPage();
    }

    public function render()
    {
        $checklistVariants = [];
        if ($this->activeTab === 'checklist') {
            $checklistVariants = PricetagProduct::query()
                ->with(['category'])
                ->where(function ($query) {
                    $query->where('name', 'like', '%'.$this->checklistSearch.'%')
                        ->orWhereHas('category', function ($cQuery) {
                            $cQuery->where('name', 'like', '%'.$this->checklistSearch.'%');
                        });
                })
                ->latest()
                ->paginate(10);
        }

        $wizardCategoriesList = [];
        $wizardProductsList = [];
        $wizardVariantsList = [];

        if ($this->activeTab === 'single') {
            if ($this->wizardStep === 1) {
                $wizardCategoriesList = PricetagCategory::query()
                    ->when($this->wizardCategorySearch, function ($q) {
                        $q->where('name', 'like', '%'.$this->wizardCategorySearch.'%');
                    })
                    ->orderBy('name')
                    ->get();
            } elseif ($this->wizardStep === 2) {
                $wizardProductsList = PricetagProduct::where('category_id', $this->wizardCategoryId)
                    ->when($this->wizardProductSearch, function ($q) {
                        $q->where('name', 'like', '%'.$this->wizardProductSearch.'%');
                    })
                    ->distinct()
                    ->orderBy('name')
                    ->pluck('name')
                    ->toArray();
            } elseif ($this->wizardStep === 3) {
                $wizardVariantsList = PricetagProduct::where('category_id', $this->wizardCategoryId)
                    ->where('name', $this->wizardProductName)
                    ->when($this->wizardVariantSearch, function ($q) {
                        $q->where(function ($sq) {
                            $sq->where('variant_name', 'like', '%'.$this->wizardVariantSearch.'%');
                        });
                    })
                    ->orderBy('variant_name')
                    ->get();
            }
        }

        return view('livewire.pricetag.generator', compact(
            'checklistVariants',
            'wizardCategoriesList',
            'wizardProductsList',
            'wizardVariantsList'
        ));
    }
}
