<?php

namespace App\Http\Requests\Odds;

class ReassignTaskRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return ['designer_id' => ['required', 'exists:users,id']];
    }
}
