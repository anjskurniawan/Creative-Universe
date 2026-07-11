<?php

namespace App\Http\Controllers;

use App\Events\HomeworkTaskAssigned;
use Illuminate\Http\Request;

class HomeworkTaskController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = \App\Models\HomeworkTask::with('users');

        if ($user && !$user->hasRole(['Root', 'Manajer', 'SPV'])) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereHas('users', function ($q2) use ($user) {
                      $q2->where('users.id', $user->id);
                  });
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

        HomeworkTaskAssigned::dispatch($task->load('users'), array_map('intval', $validated['assigned_to']));

        return response()->json($task->load('users'), 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = \App\Models\HomeworkTask::findOrFail($id);
        $user = auth()->user();
        
        if ($user && !$user->hasRole(['Root', 'Manajer', 'SPV']) && $task->created_by !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|string',
            'task_timestamps' => 'nullable|array',
            'file_link' => 'nullable|string|max:2048',
        ]);

        $task->update([
            'status' => $validated['status'],
            'task_timestamps' => $validated['task_timestamps'] ?? $task->task_timestamps,
            'file_link' => $validated['file_link'] ?? $task->file_link,
        ]);

        return response()->json($task->load('users'));
    }

    public function uploadFile(Request $request, $id)
    {
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

        return response()->json($task->load('users'));
    }

    public function destroy($id)
    {
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
}
