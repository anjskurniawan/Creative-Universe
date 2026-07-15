<?php

namespace App\Http\Requests\Api;

use App\Models\Core\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userModel = $this->route('user');
        $userId = $userModel ? $userModel->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($userId),
            ],
            'whatsapp_number' => ['nullable', 'string', 'regex:/^62[0-9]{8,13}$/'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],

            'roles' => ['present', 'array'],
            'roles.*' => ['string', 'exists:roles,name'],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
            'applications' => ['sometimes', 'array'],
            'applications.*' => ['string', 'distinct', 'exists:applications,key'],
        ];
    }

    public function messages(): array
    {
        return [
            'whatsapp_number.regex' => 'Nomor WhatsApp harus diawali 62 dan hanya berisi angka.',
            'email.unique' => 'Email sudah digunakan oleh akun lain.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',

        ];
    }
}
