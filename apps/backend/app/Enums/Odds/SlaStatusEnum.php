<?php

namespace App\Enums\Odds;

enum SlaStatusEnum: string
{
    case ON_TRACK = 'on_track';
    case AT_RISK = 'at_risk';
    case OVERDUE = 'overdue';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
