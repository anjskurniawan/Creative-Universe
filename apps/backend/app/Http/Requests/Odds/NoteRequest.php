<?php

namespace App\Http\Requests\Odds;

class NoteRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return ['note' => ['required', 'string']];
    }
}
