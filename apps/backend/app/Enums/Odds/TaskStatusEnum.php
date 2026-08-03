<?php

namespace App\Enums\Odds;

enum TaskStatusEnum: string
{
    case SUBMITTED = 'submitted';
    case BRIEF_REVISION_REQUESTED = 'brief_revision_requested';
    case QUEUED = 'queued';
    case SCHEDULED = 'scheduled';
    case READY_TO_START = 'ready_to_start';
    case IN_PROGRESS = 'in_progress';
    case LEADER_REVIEW = 'leader_review';
    case LEADER_REVISION_REQUESTED = 'leader_revision_requested';
    case CLIENT_REVIEW = 'client_review';
    case REVISION_REJECTED_BY_LEADER = 'revision_rejected_by_leader';
    case DONE = 'done';
    case CANCELLED = 'cancelled';
    case CANCELLED_BY_LEADER = 'cancelled_by_leader';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
