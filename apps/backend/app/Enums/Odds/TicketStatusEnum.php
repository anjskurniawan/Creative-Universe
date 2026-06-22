<?php

namespace App\Enums\Odds;

enum TicketStatusEnum: string
{
    case DRAFT = 'draft';
    case SUBMITTED = 'submitted';
    case WAITING_ASSIGNMENT = 'waiting_assignment';
    case ASSIGNED = 'assigned';
    case IN_PROGRESS = 'in_progress';
    case BLOCKED = 'blocked';
    case WAITING_SPV = 'waiting_spv';
    case WAITING_CLIENT = 'waiting_client';
    case REVISION = 'revision';
    case DELIVERED = 'delivered';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
