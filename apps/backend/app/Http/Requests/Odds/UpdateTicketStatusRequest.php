<?php

namespace App\Http\Requests\Odds;

use App\Enums\Odds\TicketStatusEnum;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:' . implode(',', TicketStatusEnum::getValues()),
        ];
    }
}
