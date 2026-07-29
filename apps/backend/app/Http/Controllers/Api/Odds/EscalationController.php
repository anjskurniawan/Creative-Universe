<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Odds\ReviewDecisionRequest;
use App\SubApps\Odds\Models\TaskCancelRequest;
use App\SubApps\Odds\Services\OddsEscalationService;
use App\SubApps\Odds\Services\OddsTaskRealtimeService;
use App\SubApps\Odds\Models\Task;
use Illuminate\Http\JsonResponse;

class EscalationController extends BaseApiController
{
    public function __construct(
        private OddsEscalationService $escalations,
        private OddsTaskRealtimeService $realtime,
    ) {}

    public function reviewCancel(ReviewDecisionRequest $request, TaskCancelRequest $cancelRequest): JsonResponse
    {
        $data = $request->validated();

        $taskId = $cancelRequest->task_id;
        $result = $this->escalations->reviewCancel($cancelRequest, $request->user()->id, $data['decision'], $data['note'] ?? null);
        $this->realtime->publishUpdated(Task::findOrFail($taskId));

        return $this->sendResponse($result, 'Review cancel ODDS berhasil disimpan.');
    }
}
