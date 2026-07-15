<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Odds\ReviewDecisionRequest;
use App\Http\Requests\Odds\StoreRevisionRequest;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskRevision;
use App\SubApps\Odds\Services\OddsRevisionService;
use Illuminate\Http\JsonResponse;

class RevisionController extends BaseApiController
{
    public function __construct(private OddsRevisionService $revisions) {}

    public function requestRevision(StoreRevisionRequest $request, Task $task): JsonResponse
    {
        $revision = $this->revisions->request($task, $request->validated(), $request->user()->id);

        return $this->sendResponse($revision, 'Revisi ODDS berhasil dibuat.', 201);
    }

    public function reviewExtra(ReviewDecisionRequest $request, TaskRevision $revision): JsonResponse
    {
        $data = $request->validated();

        return $this->sendResponse($this->revisions->reviewExtra($revision, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review extra revision ODDS berhasil disimpan.');
    }

    public function reviewUrgent(ReviewDecisionRequest $request, TaskRevision $revision): JsonResponse
    {
        $data = $request->validated();

        return $this->sendResponse($this->revisions->reviewUrgent($revision, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review urgent revision ODDS berhasil disimpan.');
    }
}
