<?php

namespace App\Http\Requests\Odds;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'design_purpose' => 'required|string|max:255',
            'category_id' => 'required|exists:odds_design_categories,id',
            'brand' => 'required|string|max:100',
            'channel' => 'required|string|max:100',
            'important_matrix' => 'required|string|in:Quadrant 1,Quadrant 2,Quadrant 3,Quadrant 4',
            'description' => 'required|string',
            'target_audience' => 'required|string|max:255',
            'key_message' => 'required|string',
            'required_outputs' => 'required|array',
            'required_outputs.*' => 'string',
            'deadline' => 'nullable|date|after:today',
        ];
    }
}
