<?php

namespace App\Enums\Odds;

enum ImportantMatrixEnum: string
{
    case QUADRANT_1 = 'Quadrant 1'; // Urgent & Important
    case QUADRANT_2 = 'Quadrant 2'; // Not Urgent & Important
    case QUADRANT_3 = 'Quadrant 3'; // Urgent & Not Important
    case QUADRANT_4 = 'Quadrant 4'; // Not Urgent & Not Important

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
