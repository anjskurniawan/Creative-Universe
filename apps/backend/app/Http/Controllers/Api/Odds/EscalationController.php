<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Odds\ReviewDecisionRequest;
use App\SubApps\Odds\Models\TaskCancelRequest;
use App\SubApps\Odds\Services\OddsEscalationService;
use Illuminate\Http\JsonResponse;

class EscalationController extends BaseApiController
{
    public function __construct(private OddsEscalationService $escalations) {}

    public function reviewCancel(ReviewDecisionRequest $request, TaskCancelRequest $cancelRequest): JsonResponse
    {
        $data = $request->validated();

        return $this->sendResponse($this->escalations->reviewCancel($cancelRequest, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review cancel ODDS berhasil disimpan.');
    }
}
