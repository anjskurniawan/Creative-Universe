<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['banner' => ['required', 'image', 'max:4096', 'mimes:jpeg,jpg,png,webp']];
    }
}
