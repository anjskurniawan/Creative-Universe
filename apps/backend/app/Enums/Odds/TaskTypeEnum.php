<?php

namespace App\Enums\Odds;

enum TaskTypeEnum: string
{
    case NEW_TASK = 'new_task';
    case LEADER_REVISION = 'leader_revision';
    case CLIENT_REVISION = 'client_revision';
    case EXTRA_REVISION = 'extra_revision';
    case URGENT_REVISION = 'urgent_revision';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
