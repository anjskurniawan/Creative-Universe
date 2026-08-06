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
            'model' => ['sometimes', 'string', 'in:grok-4-5,gemini-3-6-flash,z-image'],
            'history' => ['nullable', 'array'],
            'history.*.role' => ['required', 'string', 'in:user,assistant'],
            'history.*.content' => ['required', 'string'],
            'memory' => ['sometimes', 'boolean'],
            'structured_outputs' => ['sometimes', 'boolean'],
            'function_calling' => ['sometimes', 'boolean'],
            'web_access' => ['sometimes', 'boolean'],
            'reasoning_effort' => ['sometimes', 'string', 'in:low,medium,high,xhigh'],
            'stream_response' => ['sometimes', 'boolean'],
            'aspect_ratio' => ['sometimes', 'string', 'in:1:1,4:3,3:4,16:9,9:16'],
        ];
    }
}
