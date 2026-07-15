<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Odds\ReasonRequest;
use App\Http\Requests\Odds\ReviewDecisionRequest;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Models\TaskQueue;
use App\SubApps\Odds\Models\TaskSkipRequest;
use App\SubApps\Odds\Services\OddsQueueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QueueController extends BaseApiController
{
    public function __construct(private OddsQueueService $queue) {}

    public function index(Request $request): JsonResponse
    {
        $this->queue->refreshEstimates($request->user()->can('view-all-odds-tasks') ? null : $request->user()->id);

        $query = TaskQueue::query()->with(['task', 'designer:id,name,email,username']);

        if (! $request->user()->can('view-all-odds-tasks')) {
            $query->where('designer_id', $request->user()->id);
        }

        return $this->sendResponse($query->orderByDesc('priority_score')->paginate((int) $request->query('per_page', 25)), 'Antrean ODDS berhasil diambil.');
    }

    public function next(Request $request): JsonResponse
    {
        return $this->sendResponse($this->queue->nextForDesigner($request->user()->id), 'Task prioritas berikutnya berhasil diambil.');
    }

    public function requestSkip(ReasonRequest $request, Task $task): JsonResponse
    {
        $skip = $this->queue->requestSkip($task, $request->user()->id, $request->string('reason')->toString());

        return $this->sendResponse($skip, 'Permintaan skip ODDS berhasil dikirim.', 201);
    }

    public function reviewSkip(ReviewDecisionRequest $request, TaskSkipRequest $skipRequest): JsonResponse
    {
        $data = $request->validated();

        return $this->sendResponse($this->queue->reviewSkip($skipRequest, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review skip ODDS berhasil disimpan.');
    }
}
