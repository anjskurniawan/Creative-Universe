<?php

namespace App\Livewire\Pricetag;

use App\Models\Pricetag\PricetagProduct;
use Livewire\Component;
use Livewire\WithPagination;

class Search extends Component
{
    use WithPagination;

    public string $search = '';

    protected $queryString = [
        'search' => ['except' => ''],
    ];

    public function updatingSearch(): void
    {
        $this->resetPage();
    }

    public function render()
    {
        $products = PricetagProduct::query()
            ->with(['category', 'assetLinks'])
            // Only show products that have at least one generated asset link
            ->whereHas('assetLinks')
            ->where(function ($query) {
                $query->where('name', 'like', '%'.$this->search.'%')
                    ->orWhere('variant_name', 'like', '%'.$this->search.'%')
                    ->orWhereHas('category', function ($cQuery) {
                        $cQuery->where('name', 'like', '%'.$this->search.'%');
                    });
            })
            ->latest()
            ->paginate(12);

        return view('livewire.pricetag.search', compact('products'));
    }
}
