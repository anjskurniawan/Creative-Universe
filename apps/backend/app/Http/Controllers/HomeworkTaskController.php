<?php

namespace App\Http\Controllers;

use App\Events\HomeworkTaskAssigned;
use App\Events\HomeworkTaskUpdated;
use App\Models\AppSetting;
use App\Models\Core\User;
use App\Services\HomeworkTaskTimingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class HomeworkTaskController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $this->ensureTaskRouteAccess($user);
        $query = \App\Models\HomeworkTask::with('users');

        if ($user && !$user->hasRole(['Root', 'Manajer', 'SPV'])) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }

        $tasks = $query->orderByRaw("CASE WHEN status = 'Done' THEN 1 ELSE 0 END ASC")
            ->orderByDesc('task_given_date')
            ->latest()
            ->get();
            
        return response()->json($tasks);
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

        $task = \App\Models\HomeworkTask::create([
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
                    $originalName = basename($tempPath);
                    // Extract original name by removing the prepended random string (e.g. 1690000000_65a123_filename.ext)
                    // If we stored it as {uniqid}_{originalName}, we can try to strip it, but it's fine to just use basename
                    // Wait, the user wants [id_task]_[dd-mm-yyyy]_[nama_asli_file].
                    // Let's pass the original name from frontend or just extract it.
                    // Assuming temp path is: temp_uploads/{random}_{originalName}
                    $parts = explode('_', basename($tempPath), 2);
                    $originalName = count($parts) > 1 ? $parts[1] : basename($tempPath);
                    $finalName = $task->id . '_' . date('d-m-Y') . '_' . $originalName;
                    
                    if (\Storage::disk('public')->exists($tempPath)) {
                        \Storage::disk('public')->move($tempPath, 'homework_tasks/' . $finalName);
                        $supportFilePath[$index] = 'homework_tasks/' . $finalName;
                    }
                }
            }
        }
        $task->support_file_path = $supportFilePath;

        $draftFilePath = [null, null, null];
        if ($request->has('draft_file') && is_array($request->input('draft_file'))) {
            foreach ($request->input('draft_file') as $index => $tempPath) {
                if ($index < 3 && $tempPath) {
                    $parts = explode('_', basename($tempPath), 2);
                    $originalName = count($parts) > 1 ? $parts[1] : basename($tempPath);
                    $finalName = $task->id . '_' . date('d-m-Y') . '_' . $originalName;
                    
                    if (\Storage::disk('public')->exists($tempPath)) {
                        \Storage::disk('public')->move($tempPath, 'homework_tasks/' . $finalName);
                        $draftFilePath[$index] = 'homework_tasks/' . $finalName;
                    }
                }
            }
        }
        $task->draft_file_path = $draftFilePath;

        $task->save();

        $task->users()->sync($validated['assigned_to']);

        $this->broadcastTaskAssigned($task->load('users'), array_map('intval', $validated['assigned_to']));

        return response()->json($task->load('users'), 201);
    }

    public function updateStatus(Request $request, $id, HomeworkTaskTimingService $timing)
    {
        $this->ensureTaskRouteAccess($request->user());
        $task = \App\Models\HomeworkTask::findOrFail($id);
        $user = auth()->user();
        
        if ($user && !$user->hasRole(['Root', 'Manajer', 'SPV']) && $task->created_by !== $user->id) {
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
        if (!empty($assignedUserIds)) {
            $this->broadcastTaskUpdated($task, $assignedUserIds);
        }

        return response()->json($task->load('users'));
    }

    public function uploadFile(Request $request, $id)
    {
        $this->ensureTaskRouteAccess($request->user());
        $task = \App\Models\HomeworkTask::findOrFail($id);
        $user = auth()->user();
        
        if ($user && !$user->hasRole(['Root', 'Manajer', 'SPV']) && $task->created_by !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'support_file' => 'nullable|file|max:10240',
            'draft_file' => 'nullable|file|max:10240',
            'file_index' => 'nullable|integer|min:0|max:2',
        ]);

        $fileIndex = $request->input('file_index', 0);

        if ($request->hasFile('support_file')) {
            $path = $request->file('support_file')->store('homework_tasks', 'public');
            $files = $task->support_file_path ?? [null, null, null];
            // Ensure it's a 3-element array
            $files = array_pad((array)$files, 3, null);
            $files[$fileIndex] = $path;
            // Re-index to ensure it is encoded as a JSON array, not object
            $task->support_file_path = array_values($files);
        }

        if ($request->hasFile('draft_file')) {
            $path = $request->file('draft_file')->store('homework_tasks', 'public');
            $files = $task->draft_file_path ?? [null, null, null];
            $files = array_pad((array)$files, 3, null);
            $files[$fileIndex] = $path;
            $task->draft_file_path = array_values($files);
        }
        
        $task->save();

        // Broadcast ke semua user yang di-assign
        $assignedUserIds = $task->users->pluck('id')->map(fn ($id) => (int) $id)->toArray();
        if (!empty($assignedUserIds)) {
            $this->broadcastTaskUpdated($task, $assignedUserIds);
        }

        return response()->json($task->load('users'));
    }

    public function destroy($id)
    {
        $this->ensureTaskRouteAccess(request()->user());
        $task = \App\Models\HomeworkTask::findOrFail($id);
        $user = auth()->user();
        
        if ($user && !$user->hasRole(['Root', 'Manajer', 'SPV']) && $task->created_by !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    public function uploadTempFile(Request $request)
    {
        $this->ensureTaskRouteAccess($request->user());
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        // Prepend uniqid to avoid collisions in temp folder
        $filename = uniqid() . '_' . $originalName;
        $path = $file->storeAs('temp_uploads', $filename, 'public');

        return response()->json([
            'path' => $path,
            'original_name' => $originalName
        ]);
    }

    private function broadcastTaskAssigned(\App\Models\HomeworkTask $task, array $userIds): void
    {
        try {
            HomeworkTaskAssigned::dispatch($task, $userIds);
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

        return response()->json(
            User::query()
                ->whereDoesntHave('roles', fn ($query) => $query->whereIn('name', ['Root', 'Manajer', 'SPV']))
                ->orderBy('name')
                ->pluck('name')
                ->unique()
                ->values(),
        );
    }

    private function ensureTaskRouteAccess(?User $user): void
    {
        abort_unless($user, 401);
        if ($user->hasRole(['Root', 'Manajer', 'SPV'])) {
            return;
        }

        if (HomeworkTask::query()->whereHas('users', fn ($query) => $query->where('users.id', $user->id))->exists()) {
            return;
        }

        $rawNames = AppSetting::query()->where('key', 'task_route_allowed_names')->value('value');
        $allowedNames = is_string($rawNames) ? json_decode($rawNames, true) : [];
        $allowedNames = is_array($allowedNames) ? $allowedNames : [];

        abort_unless(in_array($user->name, $allowedNames, true), 403, 'Anda tidak memiliki akses ke halaman Task.');
    }

    private function broadcastTaskUpdated(\App\Models\HomeworkTask $task, array $userIds): void
    {
        try {
            HomeworkTaskUpdated::dispatch($task, $userIds);
        } catch (Throwable $e) {
            Log::warning('Homework task update broadcast failed.', [
                'task_id' => $task->id,
                'user_ids' => $userIds,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
