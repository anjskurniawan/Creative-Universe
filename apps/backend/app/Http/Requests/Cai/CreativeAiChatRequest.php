<?php

namespace App\Http\Requests\Cai;

use Illuminate\Foundation\Http\FormRequest;

class CreativeAiChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:10000'],
            'history' => ['nullable', 'array'],
            'history.*.role' => ['required', 'string', 'in:user,assistant'],
            'history.*.content' => ['required', 'string'],
        ];
    }
}
