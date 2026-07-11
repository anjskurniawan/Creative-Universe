<?php

use App\Http\Controllers\Api\AIAgentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Odds\ConfigController as OddsConfigController;
use App\Http\Controllers\Api\Odds\EscalationController as OddsEscalationController;
use App\Http\Controllers\Api\Odds\QueueController as OddsQueueController;
use App\Http\Controllers\Api\Odds\ReportController as OddsReportController;
use App\Http\Controllers\Api\Odds\RevisionController as OddsRevisionController;
use App\Http\Controllers\Api\Odds\TaskController as OddsTaskController;
use App\Http\Controllers\Api\OtpPasswordController;
use App\Http\Controllers\Api\PricetagCategoryController;
use App\Http\Controllers\Api\PricetagGenerationController;
use App\Http\Controllers\Api\PricetagImportController;
use App\Http\Controllers\Api\PricetagProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProfileSessionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AppSettingController;
use App\Http\Controllers\Api\V1\ChatController;
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

    Route::get('/onboarding/data', [\App\Http\Controllers\Api\OnboardingController::class, 'data']);
    Route::post('/onboarding/submit', [\App\Http\Controllers\Api\OnboardingController::class, 'submit']);

    // User Protected Routes
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/settings', [AppSettingController::class, 'index']);
    Route::post('/settings', [AppSettingController::class, 'store']);
    Route::post('/ai/chat', [AIAgentController::class, 'chat'])->middleware('can:access-core');

    // Private Chat Routes
    Route::prefix('chat')->group(function () {
        Route::get('/conversations', [ChatController::class, 'getConversations']);
        Route::get('/conversations/{id}/messages', [ChatController::class, 'getMessages']);
        Route::post('/messages', [ChatController::class, 'sendMessage']);
        Route::get('/contacts', [ChatController::class, 'getContacts']);
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

    Route::get('/pricetag/categories', [PricetagCategoryController::class, 'index'])->middleware('can:access-pricetag');
    Route::get('/pricetag/categories/{category}', [PricetagCategoryController::class, 'show'])->middleware('can:access-pricetag');
    Route::get('/pricetag/products', [PricetagProductController::class, 'index'])->middleware('can:access-pricetag');
    Route::get('/pricetag/products/{product}', [PricetagProductController::class, 'show'])->middleware('can:access-pricetag');

    // Pricetag Generator dibuka untuk semua role yang sudah login.
    Route::post('/pricetag/generations/single', [PricetagGenerationController::class, 'single'])->middleware('can:access-pricetag');
    Route::post('/pricetag/generations/checklist', [PricetagGenerationController::class, 'checklist'])->middleware('can:access-pricetag');
    Route::post('/pricetag/generations/csv', [PricetagGenerationController::class, 'csv'])->middleware('can:access-pricetag');
    Route::get('/pricetag/batches', [PricetagGenerationController::class, 'index'])->middleware('can:access-pricetag');
    Route::get('/pricetag/batches/{batch}', [PricetagGenerationController::class, 'show'])->middleware('can:access-pricetag');
    Route::get('/pricetag/batches/{batch}/download', [PricetagGenerationController::class, 'downloadZip'])->middleware('can:access-pricetag');

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
    Route::get('/pricetag-categories', [PricetagCategoryController::class, 'index'])->middleware('can:access-pricetag');
    Route::get('/pricetag-categories/{category}', [PricetagCategoryController::class, 'show'])->middleware('can:access-pricetag');

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
        Route::get('/categories', [OddsConfigController::class, 'categories']);
        Route::post('/categories', [OddsConfigController::class, 'storeCategory'])->middleware('can:manage-odds-config');
        Route::patch('/categories/{category}', [OddsConfigController::class, 'updateCategory'])->middleware('can:manage-odds-config');
        Route::delete('/categories/{category}', [OddsConfigController::class, 'deleteCategory'])->middleware('can:manage-odds-config');

        Route::get('/designer-profiles', [OddsConfigController::class, 'designerProfiles']);
        Route::post('/designer-profiles', [OddsConfigController::class, 'storeDesignerProfile'])->middleware('can:manage-odds-config');
        Route::patch('/designer-profiles/{designerProfile}', [OddsConfigController::class, 'updateDesignerProfile'])->middleware('can:manage-odds-config');
        Route::delete('/designer-profiles/{designerProfile}', [OddsConfigController::class, 'deleteDesignerProfile'])->middleware('can:manage-odds-config');

        Route::get('/system-rules', [OddsConfigController::class, 'systemRules'])->middleware('can:manage-odds-config');
        Route::post('/system-rules', [OddsConfigController::class, 'storeSystemRule'])->middleware('can:manage-odds-config');
        Route::patch('/system-rules/{systemRule}', [OddsConfigController::class, 'updateSystemRule'])->middleware('can:manage-odds-config');
        Route::delete('/system-rules/{systemRule}', [OddsConfigController::class, 'deleteSystemRule'])->middleware('can:manage-odds-config');

        Route::get('/tasks', [OddsTaskController::class, 'index']);
        Route::post('/tasks', [OddsTaskController::class, 'store'])->middleware('can:create-odds-tasks');
        Route::get('/tasks/{task}', [OddsTaskController::class, 'show']);
        Route::get('/tasks/{task}/conversation', [OddsTaskController::class, 'conversation']);
        Route::patch('/tasks/{task}/brief', [OddsTaskController::class, 'updateBrief'])->middleware('can:create-odds-tasks');

        Route::post('/tasks/{task}/brief/return', [OddsTaskController::class, 'returnBrief'])->middleware('can:review-odds-briefs');
        Route::post('/tasks/{task}/brief/accept', [OddsTaskController::class, 'acceptBrief'])->middleware('can:review-odds-briefs');
        Route::post('/tasks/{task}/brief/force-continue', [OddsTaskController::class, 'forceContinue'])->middleware('can:review-odds-spv');
        Route::post('/tasks/{task}/brief/cancel', [OddsTaskController::class, 'cancelBrief'])->middleware('can:review-odds-spv');

        Route::get('/queue', [OddsQueueController::class, 'index'])->middleware('can:manage-odds-queue');
        Route::get('/queue/next', [OddsQueueController::class, 'next'])->middleware('can:manage-odds-queue');
        Route::post('/tasks/{task}/skip-requests', [OddsQueueController::class, 'requestSkip'])->middleware('can:manage-odds-queue');
        Route::post('/skip-requests/{skipRequest}/review', [OddsQueueController::class, 'reviewSkip'])->middleware('can:manage-odds-queue');

        Route::post('/tasks/{task}/start', [OddsTaskController::class, 'start'])->middleware('can:start-odds-tasks');
        Route::post('/tasks/{task}/results', [OddsTaskController::class, 'submitResult'])->middleware('can:submit-odds-results');
        Route::post('/tasks/{task}/spv-review', [OddsTaskController::class, 'spvReview'])->middleware('can:review-odds-spv');
        Route::post('/tasks/{task}/client-review', [OddsTaskController::class, 'clientReview'])->middleware('can:review-odds-client');
        Route::post('/tasks/{task}/rating', [OddsTaskController::class, 'rate'])->middleware('can:review-odds-client');

        Route::post('/tasks/{task}/revisions', [OddsRevisionController::class, 'requestRevision'])->middleware('can:request-odds-revisions');
        Route::post('/revisions/{revision}/extra-review', [OddsRevisionController::class, 'reviewExtra'])->middleware('can:approve-odds-extra-revisions');
        Route::post('/revisions/{revision}/urgent-review', [OddsRevisionController::class, 'reviewUrgent'])->middleware('can:approve-odds-urgent-revisions');

        Route::post('/tasks/{task}/cancel-requests', [OddsTaskController::class, 'requestCancel'])->middleware('can:cancel-odds-tasks');
        Route::post('/cancel-requests/{cancelRequest}/review', [OddsEscalationController::class, 'reviewCancel'])->middleware('can:manage-odds-escalations');
        Route::post('/tasks/{task}/reassign', [OddsTaskController::class, 'reassign'])->middleware('can:manage-odds-escalations');
        Route::post('/tasks/{task}/extend-deadline', [OddsTaskController::class, 'extendDeadline'])->middleware('can:manage-odds-escalations');

        Route::get('/reports/daily', [OddsReportController::class, 'daily'])->middleware('can:view-odds-reports');
        Route::get('/reports/summary', [OddsReportController::class, 'summary'])->middleware('can:view-odds-reports');
        Route::get('/rankings', [OddsReportController::class, 'rankings'])->middleware('can:view-odds-rankings');
    });

    // Homework Tasks Routes
    Route::post('/temp-upload', [\App\Http\Controllers\HomeworkTaskController::class, 'uploadTempFile']);
    Route::get('/homework-tasks', [\App\Http\Controllers\HomeworkTaskController::class, 'index']);
    Route::post('/homework-tasks', [\App\Http\Controllers\HomeworkTaskController::class, 'store']);
    Route::patch('/homework-tasks/{task}/status', [\App\Http\Controllers\HomeworkTaskController::class, 'updateStatus']);
    Route::post('/homework-tasks/{task}/upload', [\App\Http\Controllers\HomeworkTaskController::class, 'uploadFile']);
    Route::delete('/homework-tasks/{task}', [\App\Http\Controllers\HomeworkTaskController::class, 'destroy']);
});
