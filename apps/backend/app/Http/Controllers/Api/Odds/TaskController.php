<?php

namespace App\Http\Controllers\Api\Odds;

use App\Enums\Odds\TaskStatusEnum;
use App\Http\Controllers\Api\BaseApiController;
use App\Models\Odds\Task;
use App\Services\Odds\OddsBriefReviewService;
use App\Services\Odds\OddsEscalationService;
use App\Services\Odds\OddsTaskIntakeService;
use App\Services\Odds\OddsWorkReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class TaskController extends BaseApiController
{
    public function __construct(
        private OddsTaskIntakeService $intake,
        private OddsBriefReviewService $briefs,
        private OddsWorkReviewService $workReviews,
        private OddsEscalationService $escalations
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Task::query()->with(['category', 'requester', 'assignedDesigner', 'currentQueue']);

        if (! $user->can('view-all-odds-tasks')) {
            $query->where(function ($inner) use ($user) {
                $inner->where('requester_id', $user->id)
                    ->orWhere('assigned_designer_id', $user->id);
            });
        }

        $tasks = $query
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate((int) $request->query('per_page', 25));

        return $this->sendResponse($tasks, 'Task ODDS berhasil diambil.');
    }

    public function store(Request $request): JsonResponse
    {
        $task = $this->intake->create($request->validate($this->taskRules()), $request->user()->id);

        return $this->sendResponse($task, 'Task ODDS berhasil dibuat.', 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);

        return $this->sendResponse(
            $task->load([
                'category', 'requester', 'assignedDesigner', 'brief', 'currentQueue',
                'results.assetLinks', 'reviews', 'revisions', 'timeLogs', 'skipRequests', 'cancelRequests', 'assetLinks',
            ]),
            'Detail task ODDS berhasil diambil.'
        );
    }

    public function updateBrief(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        abort_unless($task->requester_id === $request->user()->id, 403);
        abort_unless($task->status === TaskStatusEnum::BRIEF_REVISION_REQUESTED->value, 422, 'Brief hanya bisa diperbarui setelah desainer meminta update.');

        $task = $this->intake->updateBrief($task, $request->validate([
            'brief_text' => ['required', 'string'],
            'reference_visual' => ['nullable', 'string'],
            'attachments' => ['sometimes', 'array'],
        ]), $request->user()->id);

        return $this->sendResponse($task, 'Brief ODDS berhasil diperbarui.');
    }

    public function returnBrief(Request $request, Task $task): JsonResponse
    {
        $task = $this->briefs->returnBrief($task, $request->validate(['note' => ['required', 'string']])['note'], $request->user()->id);

        return $this->sendResponse($task, 'Brief ODDS dikembalikan ke client.');
    }

    public function acceptBrief(Request $request, Task $task): JsonResponse
    {
        $task = $this->briefs->acceptBrief($task, $request->user()->id);

        return $this->sendResponse($task, 'Brief ODDS diterima dan masuk antrean.');
    }

    public function forceContinue(Request $request, Task $task): JsonResponse
    {
        return $this->sendResponse($this->briefs->forceContinue($task, $request->user()->id), 'Brief ODDS dipaksa lanjut ke antrean.');
    }

    public function cancelBrief(Request $request, Task $task): JsonResponse
    {
        $task = $this->briefs->cancelBySpv($task, $request->validate(['reason' => ['required', 'string']])['reason'], $request->user()->id);

        return $this->sendResponse($task, 'Task ODDS dibatalkan SPV.');
    }

    public function start(Request $request, Task $task): JsonResponse
    {
        return $this->sendResponse($this->workReviews->start($task, $request->user()->id), 'Task ODDS dimulai.');
    }

    public function submitResult(Request $request, Task $task): JsonResponse
    {
        $result = $this->workReviews->submitResult($task, $request->validate([
            'result_notes' => ['nullable', 'string'],
            'assets' => ['sometimes', 'array'],
            'assets.*.provider' => ['nullable', Rule::in(['google_drive', 'dropbox', 'onedrive', 'youtube', 'other'])],
            'assets.*.label' => ['required_with:assets', 'string', 'max:255'],
            'assets.*.url' => ['required_with:assets', 'url'],
        ]), $request->user()->id);

        return $this->sendResponse($result, 'Hasil ODDS berhasil dikirim ke SPV.', 201);
    }

    public function spvReview(Request $request, Task $task): JsonResponse
    {
        $task = $this->workReviews->spvReview($task, $request->validate([
            'decision' => ['required', Rule::in(['approved', 'revision'])],
            'notes' => ['nullable', 'string'],
        ]), $request->user()->id);

        return $this->sendResponse($task, 'Review SPV ODDS berhasil disimpan.');
    }

    public function clientReview(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        $task = $this->workReviews->clientReview($task, $request->validate([
            'decision' => ['required', Rule::in(['approved', 'revision'])],
            'revision_type' => ['sometimes', Rule::in(['normal', 'extra', 'urgent_final'])],
            'notes' => ['nullable', 'string'],
        ]), $request->user()->id);

        return $this->sendResponse($task, 'Review client ODDS berhasil disimpan.');
    }

    public function rate(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        $task = $this->workReviews->rate($task, $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'feedback' => ['nullable', 'string'],
        ]), $request->user()->id);

        return $this->sendResponse($task, 'Rating ODDS berhasil disimpan.');
    }

    public function requestCancel(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        $result = $this->escalations->requestCancel($task, $request->user()->id, $request->validate(['reason' => ['required', 'string']])['reason']);

        return $this->sendResponse($result, 'Permintaan cancel ODDS berhasil diproses.');
    }

    public function reassign(Request $request, Task $task): JsonResponse
    {
        $task = $this->escalations->reassign($task, $request->validate(['designer_id' => ['required', 'exists:users,id']])['designer_id'], $request->user()->id);

        return $this->sendResponse($task, 'Task ODDS berhasil direassign.');
    }

    public function extendDeadline(Request $request, Task $task): JsonResponse
    {
        $data = $request->validate([
            'deadline' => ['required', 'date', 'after:now'],
            'note' => ['nullable', 'string'],
        ]);
        $task = $this->escalations->extendDeadline($task, $data['deadline'], $data['note'] ?? null, $request->user()->id);

        return $this->sendResponse($task, 'Deadline ODDS berhasil diperpanjang.');
    }

    private function taskRules(): array
    {
        return [
            'request_type' => ['sometimes', Rule::in(['design'])],
            'category_id' => ['required', 'integer', 'exists:odds_categories,id'],
            'preferred_designer_id' => ['required', 'integer', 'exists:users,id'],
            'design_purpose' => ['required', 'string', 'max:255'],
            'brief_text' => ['required', 'string'],
            'reference_visual' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date', 'after:now'],
            'important_matrix' => ['nullable', 'string', 'max:20'],
            'attachment_notes' => ['nullable', 'string'],
            'attachments' => ['sometimes', 'array'],
        ];
    }

    private function authorizeTaskView(Request $request, Task $task): void
    {
        $user = $request->user();

        abort_unless(
            $user->can('view-all-odds-tasks')
            || ($user->can('view-own-odds-tasks') && $task->requester_id === $user->id)
            || ($user->can('view-assigned-odds-tasks') && $task->assigned_designer_id === $user->id),
            403
        );
    }
}
