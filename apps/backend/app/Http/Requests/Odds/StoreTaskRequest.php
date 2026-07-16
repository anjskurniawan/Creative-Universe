<?php

namespace App\Http\Requests\Odds;

use Illuminate\Validation\Rule;

class StoreTaskRequest extends OddsFormRequest
{
    public function rules(): array
    {
        return [
            'request_type' => ['sometimes', Rule::in(['design'])],
            'category_id' => ['required', 'integer', 'exists:odds_categories,id'],
            'preferred_designer_id' => ['required', 'integer', 'exists:users,id'],
            'design_purpose' => ['required', 'string', 'max:255'],
            'brief_text' => ['required', 'string'],
            'reference_visual' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date', 'after_or_equal:today'],
            'important_matrix' => ['nullable', 'string', 'max:20'],
            'attachment_notes' => ['nullable', 'string'],
            'attachment_ids' => ['nullable', 'array', 'max:8'],
            'attachment_ids.*' => ['integer', 'exists:stored_files,id'],
        ];
    }
}
