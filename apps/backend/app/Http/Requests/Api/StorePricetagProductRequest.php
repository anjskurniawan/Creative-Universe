<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePricetagProductRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'variant_name' => trim((string) $this->input('variant_name')) ?: ' ',
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:pricetag_categories,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pricetag_products', 'name')
                    ->where(fn ($query) => $query->where('variant_name', $this->input('variant_name'))),
            ],
            'variant_name' => ['present', 'string', 'max:100'],
            'normal_price' => ['required', 'integer', 'min:0'],
            'discount_price' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak valid atau sudah dihapus.',
            'name.required' => 'Nama produk wajib diisi.',
            'name.unique' => 'Kombinasi nama produk dan varian ini sudah terdaftar.',
            'normal_price.required' => 'Harga normal wajib diisi.',
            'normal_price.integer' => 'Harga normal harus berupa bilangan bulat.',
            'normal_price.min' => 'Harga normal minimal 0.',
            'discount_price.integer' => 'Harga diskon harus berupa bilangan bulat.',
            'discount_price.min' => 'Harga diskon minimal 0.',
        ];
    }
}
