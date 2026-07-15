<?php

namespace App\Http\Requests\Odds;

class SaveSystemRuleRequest extends OddsFormRequest
{
    public function rules(): array
    {
        $presence = $this->isMethod('PATCH') ? 'sometimes' : 'required';

        return [
            'key' => [$presence, 'string', 'max:120'],
            'value' => [$presence, 'array'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
