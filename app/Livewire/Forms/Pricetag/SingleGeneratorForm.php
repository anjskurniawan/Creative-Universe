<?php

namespace App\Livewire\Forms\Pricetag;

use Livewire\Form;

class SingleGeneratorForm extends Form
{
    public ?int $categoryId = null;

    public ?int $productId = null;

    public ?int $discountPrice = null;

    public function rules(): array
    {
        return [
            'categoryId' => 'required|exists:pricetag_categories,id',
            'productId' => 'required|exists:pricetag_products,id',
            'discountPrice' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'categoryId.required' => 'Kategori wajib dipilih.',
            'productId.required' => 'Produk wajib dipilih.',
            'discountPrice.required' => 'Harga diskon wajib diisi.',
            'discountPrice.integer' => 'Harga diskon harus berupa angka.',
            'discountPrice.min' => 'Harga diskon tidak boleh kurang dari 0.',
        ];
    }
}
