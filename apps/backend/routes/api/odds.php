<?php

use App\Http\Controllers\Api\Odds\ConfigController;
use App\Http\Controllers\Api\Odds\EscalationController;
use App\Http\Controllers\Api\Odds\QueueController;
use App\Http\Controllers\Api\Odds\ReportController;
use App\Http\Controllers\Api\Odds\RevisionController;
use App\Http\Controllers\Api\Odds\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'app:odds', 'can:access-odds'])->prefix('odds')->group(function () {
    Route::get('/categories', [ConfigController::class, 'categories']);
    Route::post('/categories', [ConfigController::class, 'storeCategory'])->middleware('can:manage-odds-config');
    Route::patch('/categories/{category}', [ConfigController::class, 'updateCategory'])->middleware('can:manage-odds-config');
    Route::delete('/categories/{category}', [ConfigController::class, 'deleteCategory'])->middleware('can:manage-odds-config');
    Route::get('/designer-profiles', [ConfigController::class, 'designerProfiles']);
    Route::post('/designer-profiles', [ConfigController::class, 'storeDesignerProfile'])->middleware('can:manage-odds-config');
    Route::patch('/designer-profiles/{designerProfile}', [ConfigController::class, 'updateDesignerProfile'])->middleware('can:manage-odds-config');
    Route::delete('/designer-profiles/{designerProfile}', [ConfigController::class, 'deleteDesignerProfile'])->middleware('can:manage-odds-config');
    Route::get('/system-rules', [ConfigController::class, 'systemRules'])->middleware('can:manage-odds-config');
    Route::post('/system-rules', [ConfigController::class, 'storeSystemRule'])->middleware('can:manage-odds-config');
    Route::patch('/system-rules/{systemRule}', [ConfigController::class, 'updateSystemRule'])->middleware('can:manage-odds-config');
    Route::delete('/system-rules/{systemRule}', [ConfigController::class, 'deleteSystemRule'])->middleware('can:manage-odds-config');

    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store'])->middleware('can:create-odds-tasks');
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::get('/tasks/{task}/conversation', [TaskController::class, 'conversation']);
    Route::patch('/tasks/{task}/brief', [TaskController::class, 'updateBrief'])->middleware('can:create-odds-tasks');
    Route::post('/tasks/{task}/brief/return', [TaskController::class, 'returnBrief'])->middleware('can:review-odds-briefs');
    Route::post('/tasks/{task}/brief/accept', [TaskController::class, 'acceptBrief'])->middleware('can:review-odds-briefs');
    Route::post('/tasks/{task}/brief/force-continue', [TaskController::class, 'forceContinue'])->middleware('can:review-odds-spv');
    Route::post('/tasks/{task}/brief/cancel', [TaskController::class, 'cancelBrief'])->middleware('can:review-odds-spv');

    Route::get('/queue', [QueueController::class, 'index'])->middleware('can:manage-odds-queue');
    Route::get('/queue/next', [QueueController::class, 'next'])->middleware('can:manage-odds-queue');
    Route::post('/tasks/{task}/skip-requests', [QueueController::class, 'requestSkip'])->middleware('can:request-odds-queue-skip');
    Route::post('/skip-requests/{skipRequest}/review', [QueueController::class, 'reviewSkip'])->middleware('can:review-odds-queue-skip');
    Route::post('/tasks/{task}/start', [TaskController::class, 'start'])->middleware('can:start-odds-tasks');
    Route::post('/tasks/{task}/results', [TaskController::class, 'submitResult'])->middleware('can:submit-odds-results');
    Route::post('/tasks/{task}/spv-review', [TaskController::class, 'spvReview'])->middleware('can:review-odds-spv');
    Route::post('/tasks/{task}/client-review', [TaskController::class, 'clientReview'])->middleware('can:review-odds-client');
    Route::post('/tasks/{task}/rating', [TaskController::class, 'rate'])->middleware('can:review-odds-client');
    Route::post('/tasks/{task}/revisions', [RevisionController::class, 'requestRevision'])->middleware('can:request-odds-revisions');
    Route::post('/revisions/{revision}/extra-review', [RevisionController::class, 'reviewExtra'])->middleware('can:approve-odds-extra-revisions');
    Route::post('/revisions/{revision}/urgent-review', [RevisionController::class, 'reviewUrgent'])->middleware('can:approve-odds-urgent-revisions');
    Route::post('/tasks/{task}/cancel-requests', [TaskController::class, 'requestCancel'])->middleware('can:cancel-odds-tasks');
    Route::post('/cancel-requests/{cancelRequest}/review', [EscalationController::class, 'reviewCancel'])->middleware('can:manage-odds-escalations');
    Route::post('/tasks/{task}/reassign', [TaskController::class, 'reassign'])->middleware('can:manage-odds-escalations');
    Route::post('/tasks/{task}/extend-deadline', [TaskController::class, 'extendDeadline'])->middleware('can:manage-odds-escalations');
    Route::get('/reports/daily', [ReportController::class, 'daily'])->middleware('can:view-odds-reports');
    Route::get('/reports/summary', [ReportController::class, 'summary'])->middleware('can:view-odds-reports');
    Route::get('/rankings', [ReportController::class, 'rankings'])->middleware('can:view-odds-rankings');
});
