<?php

namespace App\Http\Requests\Odds;

use Illuminate\Foundation\Http\FormRequest;

class RateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quality_score' => 'required|integer|min:1|max:5',
            'speed_score' => 'required|integer|min:1|max:5',
            'communication_score' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string',
        ];
    }
}
