<?php

namespace App\Http\Requests\Odds;

use Illuminate\Validation\Rule;

class ClientReviewRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return [
            'decision' => ['required', Rule::in(['approved', 'revision'])],
            'revision_type' => ['sometimes', Rule::in(['normal', 'extra', 'urgent_final'])],
            'notes' => ['nullable', 'string'],
        ];
    }
}
