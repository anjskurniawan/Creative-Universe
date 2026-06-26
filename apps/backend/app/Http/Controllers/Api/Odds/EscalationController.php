<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Odds\TaskCancelRequest;
use App\Services\Odds\OddsEscalationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EscalationController extends BaseApiController
{
    public function __construct(private OddsEscalationService $escalations) {}

    public function reviewCancel(Request $request, TaskCancelRequest $cancelRequest): JsonResponse
    {
        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'note' => ['nullable', 'string'],
        ]);

        return $this->sendResponse($this->escalations->reviewCancel($cancelRequest, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review cancel ODDS berhasil disimpan.');
    }
}
