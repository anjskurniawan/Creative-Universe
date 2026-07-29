<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Odds\ReviewDecisionRequest;
use App\Http\Requests\Odds\StoreRevisionRequest;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskRevision;
use App\SubApps\Odds\Services\OddsRevisionService;
use App\SubApps\Odds\Services\OddsTaskRealtimeService;
use Illuminate\Http\JsonResponse;

class RevisionController extends BaseApiController
{
    public function __construct(
        private OddsRevisionService $revisions,
        private OddsTaskRealtimeService $realtime,
    ) {}

    public function requestRevision(StoreRevisionRequest $request, Task $task): JsonResponse
    {
        $revision = $this->revisions->request($task, $request->validated(), $request->user()->id);
        $this->realtime->publishUpdated($task);

        return $this->sendResponse($revision, 'Revisi ODDS berhasil dibuat.', 201);
    }

    public function reviewExtra(ReviewDecisionRequest $request, TaskRevision $revision): JsonResponse
    {
        $data = $request->validated();

        $taskId = $revision->task_id;
        $result = $this->revisions->reviewExtra($revision, $request->user()->id, $data['decision'], $data['note'] ?? null);
        $this->realtime->publishUpdated(Task::findOrFail($taskId));

        return $this->sendResponse($result, 'Review extra revision ODDS berhasil disimpan.');
    }

    public function reviewUrgent(ReviewDecisionRequest $request, TaskRevision $revision): JsonResponse
    {
        $data = $request->validated();

        $taskId = $revision->task_id;
        $result = $this->revisions->reviewUrgent($revision, $request->user()->id, $data['decision'], $data['note'] ?? null);
        $this->realtime->publishUpdated(Task::findOrFail($taskId));

        return $this->sendResponse($result, 'Review urgent revision ODDS berhasil disimpan.');
    }
}
