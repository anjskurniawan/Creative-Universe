<?php

namespace App\Http\Requests\Odds;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorization should be in controller
    }

    public function rules(): array
    {
        return [
            'design_purpose' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:odds_design_categories,id',
            'brand' => 'sometimes|string|max:100',
            'channel' => 'sometimes|string|max:100',
            'important_matrix' => 'sometimes|string|in:Quadrant 1,Quadrant 2,Quadrant 3,Quadrant 4',
            'description' => 'sometimes|string',
            'target_audience' => 'sometimes|string|max:255',
            'key_message' => 'sometimes|string',
            'required_outputs' => 'sometimes|array',
            'required_outputs.*' => 'string',
        ];
    }
}
