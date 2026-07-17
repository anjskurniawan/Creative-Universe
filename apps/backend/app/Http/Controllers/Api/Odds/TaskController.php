<?php

namespace App\Http\Controllers\Api\Odds;

use App\Enums\Odds\TaskStatusEnum;
use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Odds\ClientReviewRequest;
use App\Http\Requests\Odds\ExtendDeadlineRequest;
use App\Http\Requests\Odds\NoteRequest;
use App\Http\Requests\Odds\RateTaskRequest;
use App\Http\Requests\Odds\ReasonRequest;
use App\Http\Requests\Odds\ReassignTaskRequest;
use App\Http\Requests\Odds\SpvReviewRequest;
use App\Http\Requests\Odds\StoreTaskRequest;
use App\Http\Requests\Odds\SubmitResultRequest;
use App\Http\Requests\Odds\UpdateBriefRequest;
use App\Http\Resources\Odds\TaskResource;
use App\Models\Core\StoredFile;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Services\OddsBriefReviewService;
use App\SubApps\Odds\Services\OddsEscalationService;
use App\SubApps\Odds\Services\OddsQueueService;
use App\SubApps\Odds\Services\OddsTaskConversationService;
use App\SubApps\Odds\Services\OddsTaskIntakeService;
use App\SubApps\Odds\Services\OddsWorkReviewService;
use App\Services\Core\FileStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TaskController extends BaseApiController
{
    public function __construct(
        private OddsTaskIntakeService $intake,
        private OddsBriefReviewService $briefs,
        private OddsWorkReviewService $workReviews,
        private OddsEscalationService $escalations,
        private OddsQueueService $queue,
        private OddsTaskConversationService $conversations
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Task::query()->with(['category', 'requester', 'assignedDesigner', 'currentQueue', 'revisions', 'skipRequests', 'cancelRequests']);

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

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->intake->create($request->validated(), $request->user()->id);

        return $this->sendResponse($task, 'Task ODDS berhasil dibuat.', 201);
    }

    public function uploadAttachment(Request $request, FileStorageService $files): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,webp,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,zip',
        ]);

        $file = $files->store(
            $request->file('file'), 'odds', 'task_draft', $request->user()->id, 'attachments', $request->user()->id, 'public',
        );

        return $this->sendResponse([
            'id' => $file->id,
            'name' => $file->original_name,
            'path' => $file->path,
            'mime_type' => $file->mime_type,
            'size' => $file->size,
        ], 'Lampiran ODDS siap dikirim.', 201);
    }

    public function attachmentContent(Request $request, StoredFile $storedFile): StreamedResponse
    {
        abort_unless($storedFile->application_key === 'odds', 404);

        if ($storedFile->uploaded_by !== $request->user()->id) {
            abort_unless($storedFile->context_type === 'task' && $storedFile->context_id, 403);
            $this->authorizeTaskView($request, Task::findOrFail($storedFile->context_id));
        }

        abort_unless(Storage::disk($storedFile->disk)->exists($storedFile->path), 404);

        return Storage::disk($storedFile->disk)->response(
            $storedFile->path,
            $storedFile->original_name,
            ['Content-Disposition' => 'inline'],
        );
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        if ($task->assigned_designer_id) {
            $this->queue->refreshEstimates($task->assigned_designer_id);
        }

        return $this->sendResponse(
            TaskResource::make($task->load([
                'category', 'requester', 'assignedDesigner', 'brief', 'currentQueue',
                'results.assetLinks', 'reviews', 'revisions', 'timeLogs', 'skipRequests', 'cancelRequests', 'assetLinks',
            ]))->resolve($request),
            'Detail task ODDS berhasil diambil.'
        );
    }

    public function conversation(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);

        return $this->sendResponse(
            $this->conversations->payloadForTask($task, $request->user()),
            'Conversation task ODDS berhasil diambil.'
        );
    }

    public function updateBrief(UpdateBriefRequest $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        abort_unless($task->requester_id === $request->user()->id, 403);
        abort_unless($task->status === TaskStatusEnum::BRIEF_REVISION_REQUESTED->value, 422, 'Brief hanya bisa diperbarui setelah desainer meminta update.');

        $task = $this->intake->updateBrief($task, $request->validated(), $request->user()->id);

        return $this->sendResponse($task, 'Brief ODDS berhasil diperbarui.');
    }

    public function returnBrief(NoteRequest $request, Task $task): JsonResponse
    {
        $task = $this->briefs->returnBrief($task, $request->string('note')->toString(), $request->user()->id);

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

    public function cancelBrief(ReasonRequest $request, Task $task): JsonResponse
    {
        $task = $this->briefs->cancelBySpv($task, $request->string('reason')->toString(), $request->user()->id);

        return $this->sendResponse($task, 'Task ODDS dibatalkan SPV.');
    }

    public function start(Request $request, Task $task): JsonResponse
    {
        return $this->sendResponse($this->workReviews->start($task, $request->user()->id), 'Task ODDS dimulai.');
    }

    public function submitResult(SubmitResultRequest $request, Task $task): JsonResponse
    {
        $result = $this->workReviews->submitResult($task, $request->validated(), $request->user()->id);

        return $this->sendResponse($result, 'Hasil ODDS berhasil dikirim ke SPV.', 201);
    }

    public function spvReview(SpvReviewRequest $request, Task $task): JsonResponse
    {
        $task = $this->workReviews->spvReview($task, $request->validated(), $request->user()->id);

        return $this->sendResponse($task, 'Review SPV ODDS berhasil disimpan.');
    }

    public function clientReview(ClientReviewRequest $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        $task = $this->workReviews->clientReview($task, $request->validated(), $request->user()->id);

        return $this->sendResponse($task, 'Review client ODDS berhasil disimpan.');
    }

    public function rate(RateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        $task = $this->workReviews->rate($task, $request->validated(), $request->user()->id);

        return $this->sendResponse($task, 'Rating ODDS berhasil disimpan.');
    }

    public function requestCancel(ReasonRequest $request, Task $task): JsonResponse
    {
        $this->authorizeTaskView($request, $task);
        $result = $this->escalations->requestCancel($task, $request->user()->id, $request->string('reason')->toString());

        return $this->sendResponse($result, 'Permintaan cancel ODDS berhasil diproses.');
    }

    public function reassign(ReassignTaskRequest $request, Task $task): JsonResponse
    {
        $task = $this->escalations->reassign($task, $request->integer('designer_id'), $request->user()->id);

        return $this->sendResponse($task, 'Task ODDS berhasil direassign.');
    }

    public function extendDeadline(ExtendDeadlineRequest $request, Task $task): JsonResponse
    {
        $data = $request->validated();
        $task = $this->escalations->extendDeadline($task, $data['deadline'], $data['note'] ?? null, $request->user()->id);

        return $this->sendResponse($task, 'Deadline ODDS berhasil diperpanjang.');
    }

    private function authorizeTaskView(Request $request, Task $task): void
    {
        Gate::forUser($request->user())->authorize('view', $task);
    }
}
