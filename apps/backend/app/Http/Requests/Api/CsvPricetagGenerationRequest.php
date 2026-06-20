<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CsvPricetagGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('access-pricetag');
    }

    public function rules(): array
    {
        return [
            'batch_name' => 'required|string|max:255',
            'file' => 'required|file|max:2048|mimes:csv,txt',
        ];
    }

    public function messages(): array
    {
        return [
            'batch_name.required' => 'Nama kelompok promo wajib diisi.',
            'batch_name.string' => 'Nama kelompok promo harus berupa teks.',
            'batch_name.max' => 'Nama kelompok promo maksimal 255 karakter.',
            'file.required' => 'File CSV wajib diunggah.',
            'file.file' => 'Input harus berupa file.',
            'file.max' => 'Ukuran file CSV maksimal 2 MB.',
            'file.mimes' => 'File harus bertipe CSV atau TXT.',
        ];
    }
}
