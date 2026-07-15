<?php

namespace App\Http\Requests\Odds;

use Illuminate\Foundation\Http\FormRequest;

abstract class OddsFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
}
