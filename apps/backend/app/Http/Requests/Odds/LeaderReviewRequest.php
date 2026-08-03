<?php

namespace App\Http\Requests\Odds;

use Illuminate\Validation\Rule;

class LeaderReviewRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return ['decision' => ['required', Rule::in(['approved', 'revision'])], 'notes' => ['nullable', 'string']];
    }
}
