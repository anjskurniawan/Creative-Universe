<?php

namespace App\Livewire\Pricetag;

use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\WithPagination;

class Database extends Component
{
    use WithFileUploads, WithPagination;

    public string $activeTab = 'categories';

    // CSV Import state
    public $updateCsvFile;

    // CRUD forms state
    // Category Form
    public string $categoryName = '';

    public ?int $selectedCategoryId = null;

    // Product Form
    public ?int $productCategoryId = null;

    public string $productName = '';

    public string $productVariantName = '';

    public ?int $productNormalPrice = null;

    public ?int $productDiscountPrice = null;

    public ?int $selectedProductId = null;

    public bool $isNewCategory = false;

    public string $newCategoryName = '';

    // Modals
    public bool $showCategoryModal = false;

    public bool $showProductModal = false;

    // Search query within the database tables
    public string $dbSearch = '';

    protected $queryString = [
        'activeTab' => ['except' => 'categories'],
        'dbSearch' => ['except' => ''],
    ];

    public function updatingDbSearch(): void
    {
        $this->resetPage();
    }

    public function selectTab(string $tab): void
    {
        $this->activeTab = $tab;
        $this->dbSearch = '';
        $this->resetPage();
        $this->resetValidation();
    }

    public function mount(): void
    {
        if (! auth()->user() || ! auth()->user()->can('pricetag.manage')) {
            abort(403, 'Kamu tidak memiliki akses ke halaman ini.');
        }
    }

    // --- Category CRUD Methods ---
    public function openCategoryModal(?int $id = null): void
    {
        $this->resetValidation();
        $this->selectedCategoryId = $id;

        if ($id) {
            $category = PricetagCategory::findOrFail($id);
            $this->categoryName = $category->name;
        } else {
            $this->categoryName = '';
        }

        $this->showCategoryModal = true;
    }

    public function saveCategory(): void
    {
        $this->validate([
            'categoryName' => 'required|string|max:255',
        ], [
            'categoryName.required' => 'Nama kategori wajib diisi.',
        ]);

        if ($this->selectedCategoryId) {
            $category = PricetagCategory::findOrFail($this->selectedCategoryId);
            $category->update(['name' => $this->categoryName]);
            session()->flash('success_db', "Kategori {$category->name} berhasil diperbarui.");
        } else {
            $category = PricetagCategory::create(['name' => $this->categoryName]);
            session()->flash('success_db', "Kategori {$category->name} berhasil dibuat.");
        }

        $this->showCategoryModal = false;
        $this->categoryName = '';
    }

    public function deleteCategory(int $id): void
    {
        $category = PricetagCategory::findOrFail($id);
        $name = $category->name;
        $category->delete();

        session()->flash('success_db', "Kategori {$name} berhasil dihapus.");
    }

    // --- Product CRUD Methods ---
    public function openProductModal(?int $id = null): void
    {
        $this->resetValidation();
        $this->selectedProductId = $id;
        $this->isNewCategory = false;
        $this->newCategoryName = '';

        if ($id) {
            $product = PricetagProduct::findOrFail($id);
            $this->productCategoryId = $product->category_id;
            $this->productName = $product->name;
            $this->productVariantName = $product->variant_name === 'Default' ? '' : $product->variant_name;
            $this->productNormalPrice = $product->normal_price;
            $this->productDiscountPrice = $product->discount_price;
        } else {
            $this->productCategoryId = null;
            $this->productName = '';
            $this->productVariantName = '';
            $this->productNormalPrice = null;
            $this->productDiscountPrice = null;
        }

        $this->showProductModal = true;
    }

    public function saveProduct(): void
    {
        $rules = [
            'productName' => 'required|string|max:255',
            'productNormalPrice' => 'required|numeric|min:0',
            'productDiscountPrice' => 'nullable|numeric|min:0',
        ];

        $messages = [
            'productName.required' => 'Nama produk wajib diisi.',
            'productNormalPrice.required' => 'Harga normal wajib diisi.',
            'productNormalPrice.numeric' => 'Harga normal harus berupa angka.',
            'productNormalPrice.min' => 'Harga normal minimal 0.',
            'productDiscountPrice.numeric' => 'Harga diskon harus berupa angka.',
            'productDiscountPrice.min' => 'Harga diskon minimal 0.',
        ];

        if ($this->isNewCategory) {
            $rules['newCategoryName'] = 'required|string|max:255|unique:pricetag_categories,name';
            $messages['newCategoryName.required'] = 'Nama kategori baru wajib diisi.';
            $messages['newCategoryName.unique'] = 'Kategori tersebut sudah terdaftar.';
        } else {
            $rules['productCategoryId'] = 'required|exists:pricetag_categories,id';
            $messages['productCategoryId.required'] = 'Kategori wajib dipilih.';
        }

        $this->validate($rules, $messages);

        $variant = trim($this->productVariantName) ?: 'Default';

        // Unique composite key validation: ['name', 'variant_name']
        $exists = PricetagProduct::where('name', $this->productName)
            ->where('variant_name', $variant)
            ->where('id', '!=', $this->selectedProductId)
            ->exists();

        if ($exists) {
            $this->addError('productVariantName', 'Kombinasi nama produk dan varian ini sudah terdaftar.');
            return;
        }

        if ($this->isNewCategory) {
            $category = PricetagCategory::create(['name' => $this->newCategoryName]);
            $this->productCategoryId = $category->id;
        }

        if ($this->selectedProductId) {
            $product = PricetagProduct::findOrFail($this->selectedProductId);
            $product->update([
                'category_id' => $this->productCategoryId,
                'name' => $this->productName,
                'variant_name' => $variant,
                'normal_price' => (int) $this->productNormalPrice,
                'discount_price' => (int) $this->productDiscountPrice,
            ]);
            session()->flash('success_db', "Produk {$product->name} berhasil diperbarui.");
        } else {
            $product = PricetagProduct::create([
                'category_id' => $this->productCategoryId,
                'name' => $this->productName,
                'variant_name' => $variant,
                'normal_price' => (int) $this->productNormalPrice,
                'discount_price' => (int) $this->productDiscountPrice,
            ]);
            session()->flash('success_db', "Produk {$product->name} berhasil dibuat.");
        }

        $this->showProductModal = false;
        $this->productCategoryId = null;
        $this->productName = '';
        $this->productVariantName = '';
        $this->productNormalPrice = null;
        $this->productDiscountPrice = null;
        $this->newCategoryName = '';
        $this->isNewCategory = false;
    }

    public function deleteProduct(int $id): void
    {
        $product = PricetagProduct::findOrFail($id);
        $name = $product->name;
        $product->delete();

        session()->flash('success_db', "Produk {$name} berhasil dihapus.");
    }

    // --- Bulk CSV Import Method ---
    public function importCsv(): void
    {
        $this->validate([
            'updateCsvFile' => 'required|file|mimes:csv,txt|max:2048',
        ], [
            'updateCsvFile.required' => 'File CSV wajib diunggah.',
            'updateCsvFile.mimes' => 'Format file harus berupa CSV.',
        ]);

        $path = $this->updateCsvFile->getRealPath();
        $file = fopen($path, 'r');

        if (! $file) {
            session()->flash('error_db', 'Gagal membuka file CSV.');

            return;
        }

        // Parse header
        $header = fgetcsv($file, 1000, ',');
        if (count($header) <= 1 && str_contains($header[0] ?? '', ';')) {
            rewind($file);
            $header = fgetcsv($file, 1000, ';');
            $separator = ';';
        } else {
            $separator = ',';
        }

        $header = array_map(function ($h) {
            return strtolower(trim(preg_replace('/[\x{00EF}\x{00BB}\x{00BF}]/u', '', $h)));
        }, $header);

        // Find standard headers (supports Indonesian & English variations)
        $catIdx = $this->findHeaderIndex($header, ['category', 'category_name', 'kategori']);
        $prodIdx = $this->findHeaderIndex($header, ['product', 'product_name', 'produk']);
        $varNameIdx = $this->findHeaderIndex($header, ['variant_name', 'variant', 'varian', 'nama_varian']);
        $normalIdx = $this->findHeaderIndex($header, ['normal_price', 'harga_normal']);
        $discountIdx = $this->findHeaderIndex($header, ['discount_price', 'harga_diskon']);

        if ($catIdx === false || $prodIdx === false || $normalIdx === false) {
            fclose($file);
            $this->addError('updateCsvFile', 'File CSV minimal harus berisi kolom: kategori, produk, harga_normal.');

            return;
        }

        $importedCount = 0;
        $lineNum = 1;

        while (($row = fgetcsv($file, 1000, $separator)) !== false) {
            $lineNum++;
            if (empty($row) || count($row) < max($catIdx, $prodIdx, $normalIdx) + 1) {
                continue;
            }

            $categoryName = trim($row[$catIdx]);
            $productName = trim($row[$prodIdx]);
            $variantName = $varNameIdx !== false ? (trim($row[$varNameIdx]) ?: 'Default') : 'Default';
            $normalPrice = trim($row[$normalIdx]);
            $discountPrice = $discountIdx !== false ? trim($row[$discountIdx]) : '0';

            if (empty($categoryName) || empty($productName)) {
                continue;
            }

            // Find or create category
            $category = PricetagCategory::firstOrCreate(['name' => $categoryName]);

            // Create or update product directly (restore if soft-deleted)
            PricetagProduct::withTrashed()->updateOrCreate(
                [
                    'name' => $productName,
                    'variant_name' => $variantName,
                ],
                [
                    'category_id' => $category->id,
                    'normal_price' => (int) $normalPrice,
                    'discount_price' => (int) $discountPrice,
                    'deleted_at' => null,
                ]
            );

            $importedCount++;
        }

        fclose($file);

        if ($importedCount > 0) {
            session()->flash('success_db', "Berhasil memasukkan {$importedCount} data kategori dan produk.");
            $this->updateCsvFile = null;
        } else {
            session()->flash('error_db', 'Tidak ada data yang berhasil diimpor.');
        }
    }

    private function findHeaderIndex(array $header, array $possibleNames)
    {
        foreach ($possibleNames as $name) {
            $idx = array_search(strtolower($name), $header);
            if ($idx !== false) {
                return $idx;
            }
        }

        return false;
    }

    public function render()
    {
        // Load options for select dropdowns inside modals
        $allCategories = PricetagCategory::orderBy('name')->get();

        // Query database table records
        $categoriesList = [];
        $productsList = [];

        if ($this->activeTab === 'categories') {
            $categoriesList = PricetagCategory::query()
                ->where('name', 'like', '%'.$this->dbSearch.'%')
                ->orderBy('name')
                ->paginate(10);
        } elseif ($this->activeTab === 'products') {
            $productsList = PricetagProduct::query()
                ->with('category')
                ->where(function ($query) {
                    $query->where('name', 'like', '%'.$this->dbSearch.'%')
                        ->orWhereHas('category', function ($cQuery) {
                            $cQuery->where('name', 'like', '%'.$this->dbSearch.'%');
                        });
                })
                ->orderBy('name')
                ->paginate(10);
        }

        return view('livewire.pricetag.database', compact(
            'categoriesList',
            'productsList',
            'allCategories'
        ));
    }
}
