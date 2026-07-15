<?php

namespace App\Http\Requests\Odds;

class ReasonRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return ['reason' => ['required', 'string']];
    }
}
