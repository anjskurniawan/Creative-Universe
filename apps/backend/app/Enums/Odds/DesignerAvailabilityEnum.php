<?php

namespace App\Enums\Odds;

enum DesignerAvailabilityEnum: string
{
    case AVAILABLE = 'available';
    case OFF = 'off';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
