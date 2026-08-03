<?php

namespace App\Http\Resources\Odds;

use App\SubApps\Odds\Services\OddsTaskHistoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge($this->resource->toArray(), [
            'history' => app(OddsTaskHistoryService::class)->build($this->resource),
        ]);
    }
}
