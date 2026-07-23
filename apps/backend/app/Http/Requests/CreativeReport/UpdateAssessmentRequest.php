<?php

namespace App\Http\Requests\CreativeReport;

use App\SubApps\CreativeReport\Models\Assessment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateAssessmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'creative_scores' => ['required', 'array', 'size:10'],
            'creative_scores.*' => ['integer', 'min:0', 'max:10'],
            'leave_count' => ['sometimes', 'integer', 'min:0'],
            'absence_count' => ['sometimes', 'integer', 'min:0'],
            'late_count' => ['sometimes', 'integer', 'min:0'],
            'hrd_review_history' => ['sometimes', 'array'],
            'hrd_review_history.leave_dates' => ['sometimes', 'array'],
            'hrd_review_history.leave_dates.*' => ['date'],
            'hrd_review_history.absence_dates' => ['sometimes', 'array'],
            'hrd_review_history.absence_dates.*' => ['date'],
            'hrd_review_history.late_dates' => ['sometimes', 'array'],
            'hrd_review_history.late_dates.*' => ['date'],
            'status' => ['sometimes', Rule::in([Assessment::STATUS_DRAFT])],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            foreach (array_slice($this->input('creative_scores', []), 0, 5) as $score) {
                if (is_numeric($score) && (int) $score > 6) {
                    $validator->errors()->add('creative_scores', 'Nilai aspek 30% maksimal 6.');
                    break;
                }
            }
        }];
    }
}
