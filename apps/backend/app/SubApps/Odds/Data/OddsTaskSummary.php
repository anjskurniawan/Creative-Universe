<?php

namespace App\SubApps\Odds\Data;

final readonly class OddsTaskSummary
{
    public function __construct(
        public int $id,
        public string $status,
        public int $requesterId,
        public ?int $assignedDesignerId,
        public ?string $doneAt,
    ) {}
}
