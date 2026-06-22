<?php

namespace App\Http\Requests\Odds;

use Illuminate\Foundation\Http\FormRequest;

class SubmitOutputRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'notes' => 'nullable|string',
            'asset_url' => 'required|url',
        ];
    }
}
