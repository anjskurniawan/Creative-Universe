<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SinglePricetagGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|integer|exists:pricetag_products,id',
            'discount_price' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'ID produk wajib diisi.',
            'product_id.integer' => 'ID produk harus berupa angka.',
            'product_id.exists' => 'Produk tidak ditemukan.',
            'discount_price.required' => 'Harga promo wajib diisi.',
            'discount_price.integer' => 'Harga promo harus berupa angka.',
            'discount_price.min' => 'Harga promo tidak boleh kurang dari 0.',
        ];
    }
}
