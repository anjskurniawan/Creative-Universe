<?php

namespace App\Http\Requests\Odds;

use Illuminate\Validation\Rule;

class SubmitResultRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return [
            'result_notes' => ['nullable', 'string'],
            'assets' => ['sometimes', 'array'],
            'assets.*.provider' => ['nullable', Rule::in(['google_drive', 'dropbox', 'onedrive', 'youtube', 'other'])],
            'assets.*.label' => ['required_with:assets', 'string', 'max:255'],
            'assets.*.url' => ['required_with:assets', 'string', 'max:2048'],
        ];
    }
}
