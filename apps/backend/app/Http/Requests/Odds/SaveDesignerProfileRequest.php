<?php

namespace App\Http\Requests\Odds;

use App\Enums\Odds\DesignerAvailabilityEnum;
use Illuminate\Validation\Rule;

class SaveDesignerProfileRequest extends OddsFormRequest
{
    public function rules(): array
    {
        $presence = $this->isMethod('PATCH') ? 'sometimes' : 'required';
        $profile = $this->route('designerProfile');

        return [
            'user_id' => [
                $presence,
                'integer',
                'exists:users,id',
                Rule::unique('odds_designer_profiles', 'user_id')->ignore($profile?->id)->whereNull('deleted_at'),
            ],
            'status' => [$presence, Rule::in(DesignerAvailabilityEnum::values())],
            'specializations' => ['sometimes', 'array'],
            'leave_dates' => ['sometimes', 'array'],
            'leave_dates.*' => ['date_format:Y-m-d'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
