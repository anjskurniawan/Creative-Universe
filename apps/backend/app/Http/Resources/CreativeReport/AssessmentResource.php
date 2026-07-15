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
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_path' => $this->user->avatar_path,
                'position' => $this->user->position?->name,
                'division' => $this->user->position?->division?->name,
            ],
            'creative_scores' => $this->creative_scores,
            'hrd_review' => ['leave' => $this->leave_count, 'absence' => $this->absence_count, 'late' => $this->late_count, 'score' => $this->hrdScore()],
            'totals' => ['score_30' => $this->score30(), 'score_50' => $this->score50(), 'final' => $this->finalScore()],
        ];
    }
}
