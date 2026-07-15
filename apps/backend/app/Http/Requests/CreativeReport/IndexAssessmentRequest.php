<?php

namespace App\Http\Requests\CreativeReport;

use Illuminate\Foundation\Http\FormRequest;

class IndexAssessmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'month' => ['sometimes', 'date_format:Y-m'],
            'jobdesk' => ['sometimes', 'string', 'max:100'],
            'search' => ['sometimes', 'string', 'max:100'],
        ];
    }
}
