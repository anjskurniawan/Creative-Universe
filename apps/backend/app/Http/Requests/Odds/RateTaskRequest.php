<?php

namespace App\Http\Requests\Odds;

class RateTaskRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return ['rating' => ['required', 'integer', 'min:1', 'max:5'], 'feedback' => ['nullable', 'string']];
    }
}
