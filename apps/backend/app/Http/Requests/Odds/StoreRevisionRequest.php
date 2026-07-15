<?php

namespace App\Http\Requests\Odds;

use Illuminate\Validation\Rule;

class StoreRevisionRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return [
            'result_id' => ['nullable', 'exists:odds_task_results,id'],
            'revision_type' => ['sometimes', Rule::in(['normal', 'extra', 'urgent_final', 'leader'])],
            'notes' => ['required', 'string'],
        ];
    }
}
