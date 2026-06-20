<?php

namespace App\Http\Requests\Api;

use App\Models\Core\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:100',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'whatsapp_number' => ['nullable', 'string', 'regex:/^62[0-9]{8,13}$/'],
            'settings' => ['sometimes', 'array'],
            'settings.theme' => ['nullable', 'string', 'in:light,dark,system'],
            'settings.navbar_variant' => ['nullable', 'string', 'in:solid,glass,dark-glass'],
            'settings.redirect_to' => ['nullable', 'string', 'in:/,/dashboard,/profile,/pricetag/search,/pricetag/generator'],
        ];
    }

    public function messages(): array
    {
        return [
            'whatsapp_number.regex' => 'Nomor WhatsApp harus diawali 62 dan hanya berisi angka.',
            'username.unique' => 'Username sudah digunakan.',
            'email.unique' => 'Email sudah digunakan.',
        ];
    }
}
