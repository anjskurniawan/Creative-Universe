<?php

namespace App\SubApps\Odds\Services;

use App\Enums\Odds\TaskStatusEnum;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\Task;
use App\Models\Core\StoredFile;
use App\Services\Core\FileStorageService;
use App\SubApps\Odds\Support\BriefHtmlSanitizer;
use App\SubApps\Odds\Services\OddsScheduleService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OddsTaskIntakeService
{
    public function __construct(
        private OddsQueueService $queue,
        private OddsNotificationService $notifications,
        private FileStorageService $files,
        private BriefHtmlSanitizer $briefHtml,
        private OddsScheduleService $schedule,
    ) {}

    public function create(array $data, int $userId): Task
    {
        $data['brief_text'] = $this->briefHtml->sanitize($data['brief_text']);
        return DB::transaction(function () use ($data, $userId) {
            $category = Category::query()
                ->where('is_active', true)
                ->lockForUpdate()
                ->find($data['category_id']);

            if (! $category) {
                throw ValidationException::withMessages([
                    'category_id' => 'Kategori ODDS tidak aktif atau tidak ditemukan.',
                ]);
            }

            $attachmentIds = array_values(array_unique($data['attachment_ids'] ?? []));
            $attachments = StoredFile::query()
                ->whereIn('id', $attachmentIds)
                ->where('uploaded_by', $userId)
                ->where('application_key', 'odds')
                ->where('context_type', 'task_draft')
                ->get();
            if ($attachments->count() !== count($attachmentIds)) {
                throw ValidationException::withMessages(['attachment_ids' => 'Satu atau lebih lampiran ODDS tidak valid.']);
            }

            $preferredDesignerId = $data['preferred_designer_id'] ?? null;
            if ($preferredDesignerId) {
                $profile = DesignerProfile::where('user_id', $preferredDesignerId)
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->first();

                if (! $profile || $profile->status === 'off') {
                    throw ValidationException::withMessages([
                        'preferred_designer_id' => 'Desainer tidak tersedia untuk menerima task.',
                    ]);
                }

                $specializations = $profile->specializations ?? [];
                if (
                    $specializations !== []
                    && ! in_array($category->id, $specializations, true)
                    && ! in_array((string) $category->id, $specializations, true)
                    && ! in_array($category->name, $specializations, true)
                ) {
                    throw ValidationException::withMessages([
                        'preferred_designer_id' => 'Desainer tidak cocok dengan kategori request ini.',
                    ]);
                }

            }

            $task = Task::create([
                'task_number' => $this->nextTaskNumber(),
                'request_type' => $data['request_type'] ?? 'design',
                'category_id' => $category->id,
                'category_snapshot' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'score_weight' => (float) $category->score_weight,
                    'normal_revision_limit' => $category->normal_revision_limit,
                    'sla_minutes' => $category->sla_minutes,
                    'important_matrix' => $category->important_matrix ?? 'Q4',
                ],
                'requester_id' => $userId,
                'preferred_designer_id' => $preferredDesignerId,
                'assigned_designer_id' => $preferredDesignerId,
                'design_purpose' => $data['design_purpose'],
                'brief_text' => $data['brief_text'],
                'reference_visual' => $data['reference_visual'] ?? null,
                'deadline' => $data['deadline'] ?? $this->schedule->calculateDeadline(now()->toImmutable(), $category->sla_minutes),
                'important_matrix' => $category->important_matrix ?? 'Q4',
                'attachment_notes' => $data['attachment_notes'] ?? null,
                'status' => TaskStatusEnum::SUBMITTED->value,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            $attachmentPayload = $attachments->map(function (StoredFile $file) use ($task, $userId) {
                $path = $this->files->relocate($file->path, 'odds', 'task', $task->id, 'attachments', $userId, $file->disk);
                $file->refresh();
                return [
                    'id' => $file->id,
                    'name' => $file->original_name,
                    'path' => $path,
                    'mime_type' => $file->mime_type,
                    'size' => $file->size,
                ];
            })->values()->all();

            $task->brief()->create([
                'content' => $data['brief_text'],
                'reference_visual' => $data['reference_visual'] ?? null,
                'attachments' => $attachmentPayload ?: null,
                'updated_by' => $userId,
            ]);

            $this->notifications->send($task->requester, 'task_created', 'Permintaan ODDS dikirim', 'Permintaan desain berhasil dikirim.', $task);
            $this->notifications->send($task->assignedDesigner, 'task_created', 'Brief baru perlu diperiksa', 'Client mengirim brief ODDS baru untuk Anda.', $task);
            activity('odds')->performedOn($task)->event('task_created')->log('Task created');

            return $task->load(['brief', 'category', 'requester', 'preferredDesigner', 'assignedDesigner']);
        });
    }

    public function updateBrief(Task $task, array $data, int $userId): Task
    {
        $data['brief_text'] = $this->briefHtml->sanitize($data['brief_text']);
        $task->update([
            'brief_text' => $data['brief_text'],
            'reference_visual' => $data['reference_visual'] ?? $task->reference_visual,
            'status' => TaskStatusEnum::SUBMITTED->value,
            'updated_by' => $userId,
        ]);

        $task->brief()->updateOrCreate(
            ['task_id' => $task->id],
            [
                'content' => $data['brief_text'],
                'reference_visual' => $data['reference_visual'] ?? $task->reference_visual,
                'attachments' => $data['attachments'] ?? $task->brief?->attachments,
                'updated_by' => $userId,
            ]
        );

        $this->notifications->send($task->assignedDesigner, 'brief_updated', 'Brief ODDS diperbarui', 'Client memperbarui brief task.', $task);

        return $task->refresh()->load(['brief', 'category']);
    }

    public function submitToQueue(Task $task): Task
    {
        $queue = $this->queue->enqueue($task);

        return $queue->task->refresh()->load(['currentQueue', 'assignedDesigner']);
    }

    private function nextTaskNumber(): string
    {
        $prefix = 'ODDS-'.now()->format('ymd').'-';
        $count = Task::where('task_number', 'like', $prefix.'%')->count() + 1;

        return $prefix.str_pad((string) $count, 4, '0', STR_PAD_LEFT);
    }
}
