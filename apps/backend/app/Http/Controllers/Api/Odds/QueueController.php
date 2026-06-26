<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Odds\Task;
use App\Models\Odds\TaskQueue;
use App\Models\Odds\TaskSkipRequest;
use App\Services\Odds\OddsQueueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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

    public function requestSkip(Request $request, Task $task): JsonResponse
    {
        $skip = $this->queue->requestSkip($task, $request->user()->id, $request->validate(['reason' => ['required', 'string']])['reason']);

        return $this->sendResponse($skip, 'Permintaan skip ODDS berhasil dikirim.', 201);
    }

    public function reviewSkip(Request $request, TaskSkipRequest $skipRequest): JsonResponse
    {
        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'note' => ['nullable', 'string'],
        ]);

        return $this->sendResponse($this->queue->reviewSkip($skipRequest, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review skip ODDS berhasil disimpan.');
    }
}
