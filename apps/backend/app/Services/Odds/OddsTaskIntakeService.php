<?php

namespace App\Services\Odds;

use App\Enums\Odds\TaskStatusEnum;
use App\Models\Odds\Category;
use App\Models\Odds\DesignerProfile;
use App\Models\Odds\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OddsTaskIntakeService
{
    public function __construct(
        private OddsQueueService $queue,
        private OddsNotificationService $notifications
    ) {}

    public function create(array $data, int $userId): Task
    {
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

                if ($category->workload_point > $profile->daily_capacity_points) {
                    throw ValidationException::withMessages([
                        'preferred_designer_id' => 'Workload kategori melebihi daily capacity desainer.',
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
                    'workload_point' => $category->workload_point,
                    'sla_days' => $category->sla_days,
                ],
                'requester_id' => $userId,
                'preferred_designer_id' => $preferredDesignerId,
                'assigned_designer_id' => $preferredDesignerId,
                'design_purpose' => $data['design_purpose'],
                'brief_text' => $data['brief_text'],
                'reference_visual' => $data['reference_visual'] ?? null,
                'deadline' => $data['deadline'] ?? now()->addDays($category->sla_days),
                'important_matrix' => $data['important_matrix'] ?? 'normal',
                'attachment_notes' => $data['attachment_notes'] ?? null,
                'status' => TaskStatusEnum::SUBMITTED->value,
                'workload_point' => $category->workload_point,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            $task->brief()->create([
                'content' => $data['brief_text'],
                'reference_visual' => $data['reference_visual'] ?? null,
                'attachments' => $data['attachments'] ?? null,
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
