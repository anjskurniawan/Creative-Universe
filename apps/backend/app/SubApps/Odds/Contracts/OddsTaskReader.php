<?php

namespace App\SubApps\Odds\Contracts;

use App\SubApps\Odds\Data\OddsTaskSummary;

interface OddsTaskReader
{
    public function findSummary(int $taskId): ?OddsTaskSummary;
}
