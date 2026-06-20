<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Validation\Rule;

class UpdatePricetagProductRequest extends StorePricetagProductRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        $rules = parent::rules();
        $product = $this->route('product');

        $rules['name'] = [
            'required',
            'string',
            'max:255',
            Rule::unique('pricetag_products', 'name')
                ->where(fn ($query) => $query->where('variant_name', $this->input('variant_name')))
                ->ignore($product),
        ];

        return $rules;
    }
}
