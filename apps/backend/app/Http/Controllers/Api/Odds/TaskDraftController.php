<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\SubApps\Odds\Models\TaskDraft;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskDraftController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        return $this->sendResponse(
            TaskDraft::query()
                ->where('requester_id', $request->user()->id)
                ->latest('updated_at')
                ->get(),
            'Draft request ODDS berhasil diambil.'
        );
    }

    public function show(Request $request, TaskDraft $draft): JsonResponse
    {
        $this->authorizeDraft($request, $draft);

        return $this->sendResponse($draft, 'Draft request ODDS berhasil diambil.');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['payload' => ['required', 'array']]);
        $draft = TaskDraft::create([
            'requester_id' => $request->user()->id,
            'payload' => $validated['payload'],
        ]);

        return $this->sendResponse($draft, 'Draft request berhasil disimpan.', 201);
    }

    public function update(Request $request, TaskDraft $draft): JsonResponse
    {
        $this->authorizeDraft($request, $draft);
        $validated = $request->validate(['payload' => ['required', 'array']]);
        $draft->update(['payload' => $validated['payload']]);

        return $this->sendResponse($draft->refresh(), 'Draft request berhasil diperbarui.');
    }

    public function destroy(Request $request, TaskDraft $draft): JsonResponse
    {
        $this->authorizeDraft($request, $draft);
        $draft->delete();

        return $this->sendResponse(null, 'Draft request berhasil dihapus.');
    }

    private function authorizeDraft(Request $request, TaskDraft $draft): void
    {
        abort_unless($draft->requester_id === $request->user()->id, 403);
    }
}
