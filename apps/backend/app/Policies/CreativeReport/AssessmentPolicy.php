<?php

namespace App\Policies\CreativeReport;

use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\Assessment;

class AssessmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('creative-report.assessments.view');
    }

    public function view(User $user, Assessment $assessment): bool
    {
        return $user->can('creative-report.assessments.view');
    }

    public function update(User $user, Assessment $assessment): bool
    {
        return $user->can('creative-report.assessments.update');
    }

    public function complete(User $user, Assessment $assessment): bool
    {
        return $user->can('creative-report.assessments.update');
    }
}
