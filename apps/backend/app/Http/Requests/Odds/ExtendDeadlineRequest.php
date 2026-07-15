<?php

namespace App\Http\Requests\Odds;

class ExtendDeadlineRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return ['deadline' => ['required', 'date', 'after:now'], 'note' => ['nullable', 'string']];
    }
}
