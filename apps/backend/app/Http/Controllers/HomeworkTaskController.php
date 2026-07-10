<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeworkTaskController extends Controller
{
    public function index()
    {
        $tasks = \App\Models\HomeworkTask::with('users')->latest()->get();
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
            'support_file' => 'nullable|file|max:10240',
            'draft_file' => 'nullable|file|max:10240',
        ]);

        $task = \App\Models\HomeworkTask::create([
            'task_given_date' => $validated['task_given_date'],
            'task_name' => $validated['task_name'],
            'pic_vendor' => $validated['pic_vendor'],
            'deadline_date' => $validated['deadline_date'],
            'status' => '0',
            'task_timestamps' => [],
        ]);

        if ($request->hasFile('support_file')) {
            $task->support_file_path = $request->file('support_file')->store('homework_tasks', 'public');
        }
        if ($request->hasFile('draft_file')) {
            $task->draft_file_path = $request->file('draft_file')->store('homework_tasks', 'public');
        }
        $task->save();

        $task->users()->sync($validated['assigned_to']);

        // Here we could trigger Notification to users...
        // foreach ($task->users as $user) {
        //     $user->notify(new \App\Notifications\HomeworkTaskAssigned($task));
        // }

        return response()->json($task->load('users'), 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = \App\Models\HomeworkTask::findOrFail($id);
        
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
        
        $request->validate([
            'support_file' => 'nullable|file|max:10240',
            'draft_file' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('support_file')) {
            $task->support_file_path = $request->file('support_file')->store('homework_tasks', 'public');
        }

        if ($request->hasFile('draft_file')) {
            $task->draft_file_path = $request->file('draft_file')->store('homework_tasks', 'public');
        }
        
        $task->save();

        return response()->json($task->load('users'));
    }

    public function destroy($id)
    {
        $task = \App\Models\HomeworkTask::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }
}
