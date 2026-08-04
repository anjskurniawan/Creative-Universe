<?php

namespace App\Http\Requests\CreativeReport;

use App\SubApps\CreativeReport\Models\Assessment;
use App\Models\AppSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssessmentRequest extends FormRequest
{
    public function rules(): array
    {
        $creativeScoreMax = $this->configuredCreativeScoreMaximum();

        return [
            'creative_scores' => ['required', 'array', 'size:10'],
            'creative_scores.*' => ['integer', 'min:0', "max:{$creativeScoreMax}"],
            'leave_count' => ['sometimes', 'integer', 'min:0'],
            'app_permission_count' => ['sometimes', 'integer', 'min:0'],
            'absence_count' => ['sometimes', 'integer', 'min:0'],
            'late_count' => ['sometimes', 'integer', 'min:0'],
            'hrd_review_history' => ['sometimes', 'array'],
            'hrd_review_history.leave_dates' => ['sometimes', 'array'],
            'hrd_review_history.leave_dates.*' => ['date'],
            'hrd_review_history.app_permission_dates' => ['sometimes', 'array'],
            'hrd_review_history.app_permission_dates.*' => ['date'],
            'hrd_review_history.absence_dates' => ['sometimes', 'array'],
            'hrd_review_history.absence_dates.*' => ['date'],
            'hrd_review_history.late_dates' => ['sometimes', 'array'],
            'hrd_review_history.late_dates.*' => ['date'],
            'status' => ['sometimes', Rule::in([Assessment::STATUS_DRAFT])],
        ];
    }

    private function configuredCreativeScoreMaximum(): int
    {
        $settings = AppSetting::query()
            ->whereIn('key', ['creative_report_collab_aspects', 'creative_report_perf_aspects'])
            ->pluck('value', 'key');

        $maxima = [];
        foreach ($settings as $value) {
            $aspects = json_decode((string) $value, true);
            if (! is_array($aspects)) {
                continue;
            }
            foreach ($aspects as $aspect) {
                if (is_array($aspect) && is_numeric($aspect['maxPoints'] ?? null)) {
                    $maxima[] = (int) $aspect['maxPoints'];
                }
            }
        }

        return $maxima ? max(10, ...$maxima) : 10;
    }

}
