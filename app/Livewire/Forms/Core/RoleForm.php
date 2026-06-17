<?php

namespace App\Livewire\Forms\Core;

use Closure;
use Illuminate\Support\Str;
use Livewire\Form;

class RoleForm extends Form
{
    public string $name = '';

    /**
     * @var array<int, string>
     */
    public array $permissions = [];

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:roles,name',
                'regex:/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (Str::title((string) $value) !== $value) {
                        $fail('Nama role wajib menggunakan format Title Case, contoh: Koordinator Creative.');
                    }
                },
            ],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function permissionRules(): array
    {
        return [
            'form.permissions' => ['array'],
            'form.permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama role wajib diisi.',
            'name.unique' => 'Nama role sudah digunakan. Coba nama lain.',
            'name.max' => 'Nama role maksimal 100 karakter.',
            'name.regex' => 'Nama role hanya boleh berisi huruf, angka, dan spasi tunggal.',
            'permissions.*.exists' => 'Permission yang dipilih tidak valid.',
        ];
    }
}
