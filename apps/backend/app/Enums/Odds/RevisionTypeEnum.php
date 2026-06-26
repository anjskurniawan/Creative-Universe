<?php

namespace App\Enums\Odds;

enum RevisionTypeEnum: string
{
    case NORMAL = 'normal';
    case EXTRA = 'extra';
    case URGENT_FINAL = 'urgent_final';
    case LEADER = 'leader';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
