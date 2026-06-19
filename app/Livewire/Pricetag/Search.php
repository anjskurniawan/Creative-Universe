<?php

namespace App\Livewire\Pricetag;

use App\Models\Pricetag\PricetagCategory;
use App\Models\Pricetag\PricetagProduct;
use Livewire\Component;
use Livewire\WithPagination;

class Search extends Component
{
    use WithPagination;

    public string $search = '';

    public ?int $selectedCategoryId = null;

    protected $queryString = [
        'search' => ['except' => ''],
        'selectedCategoryId' => ['except' => null],
    ];

    public function updatingSearch(): void
    {
        $this->resetPage();
    }

    public function selectCategory(?int $categoryId): void
    {
        $this->selectedCategoryId = $categoryId;
        $this->search = '';
        $this->resetPage();
    }

    public function render()
    {
        if ($this->selectedCategoryId === null) {
            $categories = PricetagCategory::query()
                ->withCount('products')
                ->when($this->search, function ($query) {
                    $query->where('name', 'like', '%'.$this->search.'%');
                })
                ->orderBy('name')
                ->paginate(12);

            return view('livewire.pricetag.search', [
                'categories' => $categories,
                'products' => null,
                'selectedCategory' => null,
            ]);
        }

        $selectedCategory = PricetagCategory::findOrFail($this->selectedCategoryId);

        $products = PricetagProduct::query()
            ->with(['category', 'assetLinks'])
            ->where('category_id', $this->selectedCategoryId)
            ->when($this->search, function ($query) {
                $query->where(function ($sub) {
                    $sub->where('name', 'like', '%'.$this->search.'%')
                        ->orWhere('variant_name', 'like', '%'.$this->search.'%');
                });
            })
            ->latest()
            ->paginate(12);

        return view('livewire.pricetag.search', [
            'categories' => null,
            'products' => $products,
            'selectedCategory' => $selectedCategory,
        ]);
    }
}

