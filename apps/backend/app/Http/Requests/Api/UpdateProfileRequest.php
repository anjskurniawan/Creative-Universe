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
                'nullable',
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
            'settings.redirect_to' => ['nullable', 'string', 'in:/,/dashboard,/profile,/generator/pricetag,/generator/pricetag/search'],
            'settings.language' => ['nullable', 'string', 'in:id,en'],
            'settings.timezone' => ['nullable', 'string', 'max:100'],
            'settings.reduce_motion' => ['nullable', 'boolean'],
            'settings.high_contrast' => ['nullable', 'boolean'],
            'settings.notification_in_app' => ['nullable', 'boolean'],
            'settings.notification_whatsapp' => ['nullable', 'boolean'],
            'settings.notification_task_updates' => ['nullable', 'boolean'],
            'settings.notification_mentions' => ['nullable', 'boolean'],
            'settings.notification_deadlines' => ['nullable', 'boolean'],
            'settings.notification_quiet_start' => ['nullable', 'date_format:H:i'],
            'settings.notification_quiet_end' => ['nullable', 'date_format:H:i'],
            'settings.profile_show_applications' => ['nullable', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('whatsapp_number') && $this->whatsapp_number) {
            $wa = preg_replace('/[^0-9]/', '', $this->whatsapp_number);
            if (str_starts_with($wa, '0')) {
                $wa = '62' . substr($wa, 1);
            }
            $this->merge(['whatsapp_number' => $wa]);
        }
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
