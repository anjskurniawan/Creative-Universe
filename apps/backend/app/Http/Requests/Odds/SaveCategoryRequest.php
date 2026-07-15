<?php

namespace App\Http\Requests\Odds;

class SaveCategoryRequest extends OddsFormRequest
{
    public function rules(): array
    {
        $presence = $this->isMethod('PATCH') ? 'sometimes' : 'required';

        return [
            'name' => [$presence, 'string', 'max:120'],
            'score_weight' => [$presence, 'numeric', 'min:0'],
            'normal_revision_limit' => [$presence, 'integer', 'min:0'],
            'workload_point' => [$presence, 'integer', 'min:1'],
            'sla_days' => [$presence, 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
