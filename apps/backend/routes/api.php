<?php

use App\Http\Controllers\Api\AIAgentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OtpPasswordController;
use App\Http\Controllers\Api\PricetagCategoryController;
use App\Http\Controllers\Api\PricetagGenerationController;
use App\Http\Controllers\Api\PricetagImportController;
use App\Http\Controllers\Api\PricetagProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProfileSessionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/health', [HealthController::class, 'index']);

// Guest Authentication Routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/password/otp', [OtpPasswordController::class, 'requestOtp']);
Route::post('/auth/password/otp/verify', [OtpPasswordController::class, 'verifyOtp']);
Route::post('/auth/password/reset', [OtpPasswordController::class, 'resetPassword']);

// Authenticated Routes (Sanctum SPA)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Protected Routes
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/ai/chat', [AIAgentController::class, 'chat'])->middleware('can:access-core');
    
    // Private Chat Routes
    Route::prefix('chat')->group(function () {
        Route::get('/conversations', [\App\Http\Controllers\Api\V1\ChatController::class, 'getConversations']);
        Route::get('/conversations/{id}/messages', [\App\Http\Controllers\Api\V1\ChatController::class, 'getMessages']);
        Route::post('/messages', [\App\Http\Controllers\Api\V1\ChatController::class, 'sendMessage']);
        Route::get('/contacts', [\App\Http\Controllers\Api\V1\ChatController::class, 'getContacts']);
    });
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::get('/profile/sessions', [ProfileSessionController::class, 'index']);
    Route::delete('/profile/sessions/{session}', [ProfileSessionController::class, 'destroy']);
    Route::get('/profile/activities', [ProfileController::class, 'activities']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'readAll']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'read']);

    Route::middleware(['can:access-pricetag'])->group(function () {
        Route::get('/pricetag/categories', [PricetagCategoryController::class, 'index']);
        Route::get('/pricetag/categories/{category}', [PricetagCategoryController::class, 'show']);
        Route::get('/pricetag/products', [PricetagProductController::class, 'index']);
        Route::get('/pricetag/products/{product}', [PricetagProductController::class, 'show']);

        // Pricetag Generation Routes
        Route::post('/pricetag/generations/single', [PricetagGenerationController::class, 'single']);
        Route::post('/pricetag/generations/checklist', [PricetagGenerationController::class, 'checklist']);
        Route::post('/pricetag/generations/csv', [PricetagGenerationController::class, 'csv']);
        Route::get('/pricetag/batches', [PricetagGenerationController::class, 'index']);
        Route::get('/pricetag/batches/{batch}', [PricetagGenerationController::class, 'show']);
        Route::get('/pricetag/batches/{batch}/download', [PricetagGenerationController::class, 'downloadZip']);

        Route::middleware(['can:pricetag.manage'])->group(function () {
            Route::post('/pricetag/categories', [PricetagCategoryController::class, 'store']);
            Route::patch('/pricetag/categories/{category}', [PricetagCategoryController::class, 'update']);
            Route::delete('/pricetag/categories/{category}', [PricetagCategoryController::class, 'destroy']);
            Route::post('/pricetag/products', [PricetagProductController::class, 'store']);
            Route::patch('/pricetag/products/{product}', [PricetagProductController::class, 'update']);
            Route::delete('/pricetag/products/{product}', [PricetagProductController::class, 'destroy']);
            Route::post('/pricetag/imports/products', [PricetagImportController::class, 'products']);
        });

        // Alias kompatibilitas M2; frontend baru wajib memakai route kanonis /pricetag/*.
        Route::get('/pricetag-categories', [PricetagCategoryController::class, 'index']);
        Route::get('/pricetag-categories/{category}', [PricetagCategoryController::class, 'show']);
    });

    // User Management Routes
    Route::middleware(['can:manage-users'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });

    Route::get('/users/options', [UserController::class, 'options'])
        ->middleware('permission:manage-users|approve-users');

    // Removed approve-users routes

    // Role & Permission Management Routes
    Route::middleware(['can:manage-roles'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::patch('/roles/{role}', [RoleController::class, 'update']);
        Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
        Route::get('/permissions', [RoleController::class, 'permissions']);
    });

    // Root-only Manager Whitelist Settings
    Route::get('/users/whitelist-manager-permissions', [UserController::class, 'getWhitelist'])->middleware('role:Root');
    Route::post('/users/whitelist-manager-permissions', [UserController::class, 'saveWhitelist'])->middleware('role:Root');

    // Maintenance API (Root-only / run-artisan permission)
    Route::middleware(['can:run-artisan'])->group(function () {
        Route::get('/maintenance/status', [MaintenanceController::class, 'status']);
        Route::post('/maintenance/commands', [MaintenanceController::class, 'run']);
    });

    Route::middleware(['can:manage-users'])->group(function () {
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::patch('/users/{user}', [UserController::class, 'update']);
        Route::get('/users/{user}/audit', [UserController::class, 'audit'])->middleware('role:Root');
        Route::get('/users/{user}/sessions', [UserController::class, 'sessions'])->middleware('role:Root');
        Route::delete('/users/{user}/sessions/{session}', [UserController::class, 'destroySession']);
    });

    // ODDS Sub-App Routes
    Route::middleware(['can:access-odds'])->prefix('odds')->group(function () {
        // Design Categories
        Route::get('/categories', [\App\Http\Controllers\Api\Odds\DesignCategoryController::class, 'index']);

        // Tickets
        Route::get('/tickets', [\App\Http\Controllers\Api\Odds\TicketController::class, 'index']);
        Route::post('/tickets', [\App\Http\Controllers\Api\Odds\TicketController::class, 'store'])->middleware('can:create-odds-tickets');
        Route::get('/tickets/{ticket}', [\App\Http\Controllers\Api\Odds\TicketController::class, 'show']);
        Route::patch('/tickets/{ticket}', [\App\Http\Controllers\Api\Odds\TicketController::class, 'update']);
        
        // Actions
        Route::post('/tickets/{ticket}/assign', [\App\Http\Controllers\Api\Odds\TicketController::class, 'assign'])->middleware('can:assign-odds-tickets');
        Route::post('/tickets/{ticket}/status', [\App\Http\Controllers\Api\Odds\TicketController::class, 'updateStatus']);
        Route::post('/tickets/{ticket}/output', [\App\Http\Controllers\Api\Odds\TicketController::class, 'submitOutput'])->middleware('can:submit-odds-output');
        Route::post('/tickets/{ticket}/review', [\App\Http\Controllers\Api\Odds\TicketController::class, 'review'])->middleware('can:approve-odds-tickets|request-odds-revision');
        Route::post('/tickets/{ticket}/rate', [\App\Http\Controllers\Api\Odds\TicketController::class, 'rate']);
        
        // AI Integration
        Route::post('/tickets/{ticket}/ai-brief-analyze', [\App\Http\Controllers\Api\Odds\TicketController::class, 'aiBriefAnalyze'])->middleware('can:use-odds-ai');
    });
});
