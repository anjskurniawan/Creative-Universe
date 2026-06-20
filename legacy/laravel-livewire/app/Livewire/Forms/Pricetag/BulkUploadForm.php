<?php

namespace App\Livewire\Forms\Pricetag;

use Livewire\Form;

class BulkUploadForm extends Form
{
    public $csvFile;

    public string $batchName = '';

    public function rules(): array
    {
        return [
            'batchName' => 'required|string|max:255',
            'csvFile' => 'required|file|mimes:csv,txt|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'batchName.required' => 'Nama batch wajib diisi.',
            'batchName.string' => 'Nama batch harus berupa teks.',
            'batchName.max' => 'Nama batch maksimal 255 karakter.',
            'csvFile.required' => 'File CSV wajib diunggah.',
            'csvFile.file' => 'Input harus berupa file.',
            'csvFile.mimes' => 'Format file harus berupa CSV.',
            'csvFile.max' => 'Ukuran file maksimal 2MB.',
        ];
    }
}
