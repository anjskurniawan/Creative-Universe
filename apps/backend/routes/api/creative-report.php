<?php

use App\Http\Controllers\Api\CreativeReport\AssessmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'app:creative-report'])
    ->prefix('creative-reports')
    ->group(function () {
        Route::get('/', [AssessmentController::class, 'index']);
        Route::get('/users/{user}', [AssessmentController::class, 'userDetail']);
        Route::get('/{assessment}', [AssessmentController::class, 'show']);
        Route::patch('/{assessment}', [AssessmentController::class, 'update']);
        Route::post('/{assessment}/complete', [AssessmentController::class, 'complete']);
    });
