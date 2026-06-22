<?php

namespace App\Enums\Odds;

enum RevisionTypeEnum: string
{
    case SPV = 'spv';
    case MANAGER = 'manager';
    case CLIENT = 'client';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
