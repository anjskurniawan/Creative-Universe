<?php

namespace App\Http\Resources\CreativeReport;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'group' => ['id' => $this->group->id, 'name' => $this->group->name],
            'period' => $this->period->format('Y-m'),
            'user' => [
                'id' => $this->member?->id ?? $this->user?->id,
                'name' => $this->user?->name ?? $this->member?->name,
                'avatar_path' => $this->user?->avatar_path,
                'card_image_path' => $this->member?->card_image_path,
                'position' => $this->member?->position_name ?? $this->user?->position?->name,
                'division' => 'Creative',
            ],
            'creative_scores' => $this->creative_scores,
            'hrd_review' => [
                'leave' => $this->leave_count,
                'app_permission' => $this->app_permission_count,
                'absence' => $this->absence_count,
                'late' => $this->late_count,
                'score' => $this->hrdScore(),
                'history' => $this->hrd_review_history ?? [
                    'leave_dates' => [],
                    'app_permission_dates' => [],
                    'absence_dates' => [],
                    'late_dates' => [],
                ]
            ],
            'totals' => ['score_30' => $this->score30(), 'score_50' => $this->score50(), 'final' => $this->finalScore()],
        ];
    }
}
