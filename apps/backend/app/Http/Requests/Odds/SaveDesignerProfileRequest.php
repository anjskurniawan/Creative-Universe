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
            'daily_capacity_points' => [$presence, 'integer', 'min:1'],
            'max_active_tasks' => [$presence, 'integer', 'min:1'],
            'assignment_priority' => ['sometimes', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
