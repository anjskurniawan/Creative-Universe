<?php

namespace App\Http\Requests\Odds;

use Illuminate\Foundation\Http\FormRequest;

class ReviewTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => 'required|in:approve,reject',
            'notes' => 'required_if:action,reject|string',
            'revision_deadline' => 'required_if:action,reject|date|after:today',
        ];
    }
}
