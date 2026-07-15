<?php

use App\Http\Controllers\Api\Cai\CreativeAiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'app:cai', 'can:access-cai'])
    ->prefix('cai')
    ->group(function (): void {
        Route::post('/chat', [CreativeAiController::class, 'chat']);
    });
