<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'avatar' => ['required', 'image', 'max:2048', 'mimes:jpeg,jpg,png,webp'],
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.required' => 'Pilih gambar profil yang akan diunggah.',
            'avatar.image' => 'Berkas avatar harus berupa gambar.',
            'avatar.max' => 'Ukuran avatar maksimal 2 MB.',
            'avatar.mimes' => 'Format avatar harus JPG, JPEG, PNG, atau WEBP.',
        ];
    }
}
