<?php

namespace App\Http\Controllers\Api\KvRetail;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Core\User;
use App\Services\Core\FileStorageService;
use App\SubApps\KvRetail\Events\KvRetailTaskAssigned;
use App\SubApps\KvRetail\Events\KvRetailTaskUpdated;
use App\SubApps\KvRetail\Services\KvRetailTaskTimingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class TaskController extends BaseApiController
{
    public function __construct(private readonly FileStorageService $files) {}

    public function index()
    {
        $user = auth()->user();
        $this->ensureTaskRouteAccess($user);
        $query = \App\SubApps\KvRetail\Models\KvRetailTask::with('users');

        if ($user && ! $user->hasRole(['Root', 'Manajer', 'SPV'])) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }

        $tasks = $query->orderByRaw("CASE WHEN status = 'Done' THEN 1 ELSE 0 END ASC")
            ->orderByDesc('task_given_date')
            ->latest()
            ->get();

        return $this->sendResponse($tasks, 'Task KV Retail berhasil diambil.');
    }

    public function store(Request $request)
    {
        $this->ensureTaskRouteAccess($request->user());
        $validated = $request->validate([
            'task_given_date' => 'required|date',
            'task_name' => 'required|string|max:255',
            'pic_vendor' => 'required|string|in:Mireco,Fushion',
            'deadline_date' => 'required|date',
            'assigned_to' => 'required|array',
            'assigned_to.*' => 'exists:users,id',
            'support_file' => 'nullable|array|max:3',
            'support_file.*' => 'string',
            'draft_file' => 'nullable|array|max:3',
            'draft_file.*' => 'string',
        ]);

        $task = \App\SubApps\KvRetail\Models\KvRetailTask::create([
            'task_given_date' => $validated['task_given_date'],
            'task_name' => $validated['task_name'],
            'pic_vendor' => $validated['pic_vendor'],
            'deadline_date' => $validated['deadline_date'],
            'status' => '0',
            'task_timestamps' => [],
            'created_by' => auth()->id(),
        ]);

        $supportFilePath = [null, null, null];
        if ($request->has('support_file') && is_array($request->input('support_file'))) {
            foreach ($request->input('support_file') as $index => $tempPath) {
                if ($index < 3 && $tempPath) {
                    if (\Storage::disk('public')->exists($tempPath)) {
                        $supportFilePath[$index] = $this->files->relocate(
                            $tempPath, 'kv-retail', 'tasks', $task->id, 'references', $request->user()->id
                        );
                    }
                }
            }
        }
        $task->support_file_path = $supportFilePath;

        $draftFilePath = [null, null, null];
        if ($request->has('draft_file') && is_array($request->input('draft_file'))) {
            foreach ($request->input('draft_file') as $index => $tempPath) {
                if ($index < 3 && $tempPath) {
                    if (\Storage::disk('public')->exists($tempPath)) {
                        $draftFilePath[$index] = $this->files->relocate(
                            $tempPath, 'kv-retail', 'tasks', $task->id, 'drafts', $request->user()->id
                        );
                    }
                }
            }
        }
        $task->draft_file_path = $draftFilePath;

        $task->save();

        $task->users()->sync($validated['assigned_to']);

        $this->broadcastTaskAssigned($task->load('users'), array_map('intval', $validated['assigned_to']));

        return $this->sendResponse($task->load('users'), 'Task KV Retail berhasil dibuat.', 201);
    }

    public function updateStatus(Request $request, $id, KvRetailTaskTimingService $timing)
    {
        $this->ensureTaskRouteAccess($request->user());
        $task = \App\SubApps\KvRetail\Models\KvRetailTask::findOrFail($id);
        $user = auth()->user();

        if ($user && ! $user->hasRole(['Root', 'Manajer', 'SPV']) && ! $task->users()->whereKey($user->id)->exists()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|string',
            'task_timestamps' => 'nullable|array',
            'file_link' => 'nullable|string|max:2048',
            'delay_reason' => 'nullable|string|max:2000',
        ]);

        $reasonStage = $timing->requiredReasonStage($task, $validated['status']);
        if ($reasonStage && blank($validated['delay_reason'] ?? null)) {
            throw ValidationException::withMessages([
                'delay_reason' => "Alasan keterlambatan tahap {$reasonStage} wajib diisi sebelum melanjutkan task.",
            ]);
        }

        $delayReasons = $task->delay_reasons ?? [];
        if ($reasonStage) {
            $delayReasons[$reasonStage] = [
                'reason' => $validated['delay_reason'],
                'recorded_at' => now()->toIso8601String(),
            ];
        }

        $task->update([
            'status' => $validated['status'],
            'task_timestamps' => $validated['task_timestamps'] ?? $task->task_timestamps,
            'file_link' => $validated['file_link'] ?? $task->file_link,
            'delay_reasons' => $delayReasons,
        ]);

        // Broadcast ke semua user yang di-assign
        $assignedUserIds = $task->users->pluck('id')->map(fn ($id) => (int) $id)->toArray();
        if (! empty($assignedUserIds)) {
            $this->broadcastTaskUpdated($task, $assignedUserIds);
        }

        return $this->sendResponse($task->load('users'), 'Status task KV Retail berhasil diperbarui.');
    }

    public function uploadFile(Request $request, $id)
    {
        $this->ensureTaskRouteAccess($request->user());
        $task = \App\SubApps\KvRetail\Models\KvRetailTask::findOrFail($id);
        $user = auth()->user();

        if ($user && ! $user->hasRole(['Root', 'Manajer', 'SPV']) && ! $task->users()->whereKey($user->id)->exists()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'support_file' => 'nullable|file|max:10240',
            'draft_file' => 'nullable|file|max:10240',
            'file_index' => 'nullable|integer|min:0|max:2',
        ]);

        $fileIndex = $request->input('file_index', 0);

        if ($request->hasFile('support_file')) {
            $path = $this->files->store(
                $request->file('support_file'), 'kv-retail', 'tasks', $task->id, 'references', $request->user()->id
            )->path;
            $files = $task->support_file_path ?? [null, null, null];
            // Ensure it's a 3-element array
            $files = array_pad((array) $files, 3, null);
            $files[$fileIndex] = $path;
            // Re-index to ensure it is encoded as a JSON array, not object
            $task->support_file_path = array_values($files);
        }

        if ($request->hasFile('draft_file')) {
            $path = $this->files->store(
                $request->file('draft_file'), 'kv-retail', 'tasks', $task->id, 'drafts', $request->user()->id
            )->path;
            $files = $task->draft_file_path ?? [null, null, null];
            $files = array_pad((array) $files, 3, null);
            $files[$fileIndex] = $path;
            $task->draft_file_path = array_values($files);
        }

        $task->save();

        // Broadcast ke semua user yang di-assign
        $assignedUserIds = $task->users->pluck('id')->map(fn ($id) => (int) $id)->toArray();
        if (! empty($assignedUserIds)) {
            $this->broadcastTaskUpdated($task, $assignedUserIds);
        }

        return $this->sendResponse($task->load('users'), 'File task KV Retail berhasil disimpan.');
    }

    public function destroy($id)
    {
        $this->ensureTaskRouteAccess(request()->user());
        $task = \App\SubApps\KvRetail\Models\KvRetailTask::findOrFail($id);
        $user = auth()->user();

        if ($user && ! $user->hasRole(['Root', 'Manajer', 'SPV']) && $task->created_by !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $task->delete();

        return $this->sendResponse(null, 'Task KV Retail berhasil dihapus.');
    }

    public function uploadTempFile(Request $request)
    {
        $this->ensureTaskRouteAccess($request->user());
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $file = $request->file('file');
        $storedFile = $this->files->store(
            $file, 'kv-retail', 'temporary-uploads', $request->user()->id, 'pending', $request->user()->id
        );

        return $this->sendResponse([
            'path' => $storedFile->path,
            'original_name' => $storedFile->original_name,
        ], 'File sementara berhasil disimpan.');
    }

    private function broadcastTaskAssigned(\App\SubApps\KvRetail\Models\KvRetailTask $task, array $userIds): void
    {
        try {
            KvRetailTaskAssigned::dispatch($task, $userIds);
        } catch (Throwable $e) {
            Log::warning('Homework task assignment broadcast failed.', [
                'task_id' => $task->id,
                'user_ids' => $userIds,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function accessUsers(Request $request)
    {
        $user = $request->user();
        abort_unless($user?->hasRole(['Root', 'Manajer']), 403);

        return $this->sendResponse(
            User::query()
                ->whereHas('applications', fn ($query) => $query->where('key', 'kv-retail'))
                ->whereDoesntHave('roles', fn ($query) => $query->where('name', 'Root'))
                ->orderBy('name')
                ->get(['users.id', 'users.name'])
                ->values(),
            'Daftar pengguna KV Retail berhasil diambil.',
        );
    }

    private function ensureTaskRouteAccess(?User $user): void
    {
        abort_unless($user, 401);
    }

    private function broadcastTaskUpdated(\App\SubApps\KvRetail\Models\KvRetailTask $task, array $userIds): void
    {
        try {
            KvRetailTaskUpdated::dispatch($task, $userIds);
        } catch (Throwable $e) {
            Log::warning('Homework task update broadcast failed.', [
                'task_id' => $task->id,
                'user_ids' => $userIds,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
