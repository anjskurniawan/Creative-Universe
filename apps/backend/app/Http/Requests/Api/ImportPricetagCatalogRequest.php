<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ImportPricetagCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'File CSV wajib diunggah.',
            'file.mimes' => 'Format file harus berupa CSV atau TXT.',
            'file.max' => 'Ukuran file CSV maksimal 2 MB.',
        ];
    }
}
