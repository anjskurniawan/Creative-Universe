<?php

use App\Http\Controllers\Api\KvRetail\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'app:kv-retail'])->group(function () {
    Route::get('/kv-retail/assignees', [TaskController::class, 'accessUsers'])->middleware('permission:kv-retail.tasks.create|kv-retail.settings.manage');
    Route::post('/kv-retail/uploads', [TaskController::class, 'uploadTempFile'])->middleware('permission:kv-retail.tasks.create');
    Route::get('/kv-retail/tasks', [TaskController::class, 'index'])->middleware('permission:kv-retail.tasks.view');
    Route::post('/kv-retail/tasks', [TaskController::class, 'store'])->middleware('permission:kv-retail.tasks.create');
    Route::patch('/kv-retail/tasks/{task}/status', [TaskController::class, 'updateStatus'])->middleware('permission:kv-retail.tasks.update-status');
    Route::post('/kv-retail/tasks/{task}/files', [TaskController::class, 'uploadFile'])->middleware('permission:kv-retail.tasks.update-status');
    Route::delete('/kv-retail/tasks/{task}', [TaskController::class, 'destroy'])->middleware('permission:kv-retail.tasks.delete');
});
