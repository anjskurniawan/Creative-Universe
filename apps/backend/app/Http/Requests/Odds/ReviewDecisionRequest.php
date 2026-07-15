<?php

namespace App\Http\Requests\Odds;

use Illuminate\Validation\Rule;

class ReviewDecisionRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return ['decision' => ['required', Rule::in(['approved', 'rejected'])], 'note' => ['nullable', 'string']];
    }
}
