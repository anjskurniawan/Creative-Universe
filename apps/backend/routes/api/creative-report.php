<?php

use App\Http\Controllers\Api\CreativeReport\AssessmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'app:creative-report'])
    ->prefix('creative-reports')
    ->group(function () {
        Route::get('/members/pending', [AssessmentController::class, 'pendingMembers']);
        Route::post('/members/historical', [AssessmentController::class, 'createHistoricalMember']);
        Route::post('/members/{member}/approve', [AssessmentController::class, 'approveMember']);
        Route::post('/members/{member}/reject', [AssessmentController::class, 'rejectMember']);
        Route::get('/', [AssessmentController::class, 'index']);
        Route::get('/users/{user}', [AssessmentController::class, 'userDetail']);
        Route::get('/{assessment}', [AssessmentController::class, 'show']);
        Route::patch('/{assessment}', [AssessmentController::class, 'update']);
        Route::post('/{assessment}/complete', [AssessmentController::class, 'complete']);
    });
