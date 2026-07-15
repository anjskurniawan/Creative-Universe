<?php

namespace App\Http\Requests\Odds;

class UpdateBriefRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return [
            'brief_text' => ['required', 'string'],
            'reference_visual' => ['nullable', 'string'],
            'attachments' => ['sometimes', 'array'],
        ];
    }
}
