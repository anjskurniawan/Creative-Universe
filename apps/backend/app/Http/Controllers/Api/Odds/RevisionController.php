<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Odds\Task;
use App\Models\Odds\TaskRevision;
use App\Services\Odds\OddsRevisionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RevisionController extends BaseApiController
{
    public function __construct(private OddsRevisionService $revisions) {}

    public function requestRevision(Request $request, Task $task): JsonResponse
    {
        $revision = $this->revisions->request($task, $request->validate([
            'result_id' => ['nullable', 'exists:odds_task_results,id'],
            'revision_type' => ['sometimes', Rule::in(['normal', 'extra', 'urgent_final', 'leader'])],
            'notes' => ['required', 'string'],
        ]), $request->user()->id);

        return $this->sendResponse($revision, 'Revisi ODDS berhasil dibuat.', 201);
    }

    public function reviewExtra(Request $request, TaskRevision $revision): JsonResponse
    {
        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'note' => ['nullable', 'string'],
        ]);

        return $this->sendResponse($this->revisions->reviewExtra($revision, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review extra revision ODDS berhasil disimpan.');
    }

    public function reviewUrgent(Request $request, TaskRevision $revision): JsonResponse
    {
        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'note' => ['nullable', 'string'],
        ]);

        return $this->sendResponse($this->revisions->reviewUrgent($revision, $request->user()->id, $data['decision'], $data['note'] ?? null), 'Review urgent revision ODDS berhasil disimpan.');
    }
}
