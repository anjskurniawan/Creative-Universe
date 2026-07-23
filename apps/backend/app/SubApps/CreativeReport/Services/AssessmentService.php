<?php

namespace App\SubApps\CreativeReport\Services;

use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\Assessment;

class AssessmentService
{
    public function saveDraft(Assessment $assessment, array $data): Assessment
    {
        if (isset($data['hrd_review_history'])) {
            $history = $data['hrd_review_history'];
            $data['leave_count'] = count($history['leave_dates'] ?? []);
            $data['absence_count'] = count($history['absence_dates'] ?? []);
            $data['late_count'] = count($history['late_dates'] ?? []);
        }

        $assessment->fill($data + [
            'status' => Assessment::STATUS_DRAFT,
            'completed_at' => null,
            'completed_by' => null,
        ])->save();

        return $assessment->fresh(['group', 'user.position.division']);
    }

    public function complete(Assessment $assessment, User $actor): Assessment
    {
        $assessment->update([
            'status' => Assessment::STATUS_COMPLETED,
            'completed_at' => now(),
            'completed_by' => $actor->id,
        ]);

        return $assessment->fresh(['group', 'user.position.division']);
    }
}
