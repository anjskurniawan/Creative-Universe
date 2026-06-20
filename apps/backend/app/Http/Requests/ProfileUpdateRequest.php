<?php

namespace App\Http\Requests;

use App\Models\Core\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'username' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'whatsapp_number' => [
                'nullable',
                'string',
                'regex:/^62[0-9]{8,13}$/',
            ],
            'avatar' => [
                'nullable',
                'image',
                'max:2048',
                'mimes:jpeg,png,jpg,webp',
            ],
            'settings' => ['nullable', 'array'],
            'settings.theme' => ['nullable', 'string', 'in:light,dark,system'],
            'settings.navbar_variant' => ['nullable', 'string', 'in:solid,glass,dark-glass'],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'whatsapp_number.regex' => 'Format nomor WhatsApp harus diawali dengan kode negara 62 (contoh: 628123456789) tanpa tanda + atau spasi.',
            'avatar.max' => 'Ukuran foto profil tidak boleh melebihi 2MB.',
            'avatar.image' => 'Berkas yang diunggah harus berupa gambar.',
            'avatar.mimes' => 'Format gambar harus berupa jpeg, png, jpg, atau webp.',
        ];
    }
}
