<?php

namespace App\Http\Controllers\Api\CreativeReport;

use App\Http\Controllers\Api\BaseApiController;
use App\SubApps\CreativeReport\Models\InternalClientFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InternalClientFeedbackController extends BaseApiController
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'division' => ['required', 'string', 'max:255'],
            'problems' => ['nullable', 'string', 'max:5000'],
            'suggestions' => ['nullable', 'string', 'max:5000'],
            'satisfaction' => ['required', 'integer', 'between:1,10'],
        ]);
        $feedback = InternalClientFeedback::create($data);
        return $this->sendResponse(['id' => $feedback->id], 'Feedback berhasil disimpan.');
    }

    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()?->hasAnyRole(['Root', 'Manajer', 'SPV']), 403);
        return $this->sendResponse(InternalClientFeedback::query()->latest()->get(), 'Data feedback berhasil diambil.');
    }

    public function destroy(Request $request, InternalClientFeedback $feedback): JsonResponse
    {
        abort_unless($request->user()?->hasAnyRole(['Root', 'Manajer', 'SPV']), 403);
        $feedback->delete();

        return $this->sendResponse(null, 'Feedback berhasil dihapus.');
    }
}
