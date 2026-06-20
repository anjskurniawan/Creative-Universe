<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:100|unique:users,username|alpha_dash',
            'email' => 'required|email|max:255|unique:users,email',
            'whatsapp_number' => 'nullable|string|max:20|regex:/^628[0-9]{8,12}$/',
            'password' => 'required|string|min:8|confirmed',
            'registration_note' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan. Coba username lain.',
            'username.alpha_dash' => 'Username hanya boleh berisi huruf, angka, dan tanda hubung.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan. Coba email lain.',
            'whatsapp_number.regex' => 'Format nomor WhatsApp harus diawali 628, contoh: 6281234567890.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'registration_note.max' => 'Catatan registrasi maksimal 500 karakter.',
        ];
    }
}
