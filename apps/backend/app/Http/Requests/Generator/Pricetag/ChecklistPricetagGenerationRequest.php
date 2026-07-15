<?php

declare(strict_types=1);

namespace App\Http\Requests\Generator\Pricetag;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistPricetagGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'batch_name' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:generator_pricetag_products,id',
            'items.*.discount_price' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'batch_name.required' => 'Nama kelompok promo wajib diisi.',
            'batch_name.string' => 'Nama kelompok promo harus berupa teks.',
            'batch_name.max' => 'Nama kelompok promo maksimal 255 karakter.',
            'items.required' => 'Pilih minimal satu produk.',
            'items.array' => 'Daftar produk harus berupa array.',
            'items.min' => 'Pilih minimal satu produk.',
            'items.*.product_id.required' => 'ID produk wajib diisi.',
            'items.*.product_id.exists' => 'Produk tidak ditemukan.',
            'items.*.discount_price.integer' => 'Harga promo harus berupa angka.',
            'items.*.discount_price.min' => 'Harga promo tidak boleh kurang dari 0.',
        ];
    }
}
