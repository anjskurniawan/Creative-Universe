<?php

use App\Http\Controllers\Api\AppSettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Core\ChatController;
use App\Http\Controllers\Api\Core\NotificationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\OtpPasswordController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProfileSessionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/password/otp', [OtpPasswordController::class, 'requestOtp']);
Route::post('/auth/password/otp/verify', [OtpPasswordController::class, 'verifyOtp']);
Route::post('/auth/password/reset', [OtpPasswordController::class, 'resetPassword']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/onboarding/data', [OnboardingController::class, 'data']);
    Route::post('/onboarding/submit', [OnboardingController::class, 'submit']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/settings', [AppSettingController::class, 'index']);
    Route::post('/settings', [AppSettingController::class, 'store']);

    Route::prefix('chat')->group(function () {
        Route::get('/conversations', [ChatController::class, 'getConversations']);
        Route::get('/conversations/{id}/messages', [ChatController::class, 'getMessages']);
        Route::post('/attachments', [ChatController::class, 'uploadAttachment']);
        Route::post('/messages', [ChatController::class, 'sendMessage']);
        Route::get('/contacts', [ChatController::class, 'getContacts']);
    });

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::get('/profile/sessions', [ProfileSessionController::class, 'index']);
    Route::delete('/profile/sessions/{session}', [ProfileSessionController::class, 'destroy']);
    Route::get('/profile/activities', [ProfileController::class, 'activities']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'readAll']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'read']);

    Route::middleware('can:manage-users')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });
    Route::get('/users/options', [UserController::class, 'options'])->middleware('permission:manage-users|approve-users');

    Route::middleware('can:manage-roles')->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::patch('/roles/{role}', [RoleController::class, 'update']);
        Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
        Route::get('/permissions', [RoleController::class, 'permissions']);
        Route::get('/permission-catalog', [RoleController::class, 'permissionCatalog']);
    });

    Route::get('/users/whitelist-manager-permissions', [UserController::class, 'getWhitelist'])->middleware('role:Root');
    Route::post('/users/whitelist-manager-permissions', [UserController::class, 'saveWhitelist'])->middleware('role:Root');

    Route::middleware('can:manage-users')->group(function () {
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::patch('/users/{user}', [UserController::class, 'update']);
        Route::get('/users/{user}/audit', [UserController::class, 'audit'])->middleware('role:Root');
        Route::get('/users/{user}/sessions', [UserController::class, 'sessions'])->middleware('role:Root');
        Route::delete('/users/{user}/sessions/{session}', [UserController::class, 'destroySession']);
    });

    Route::middleware('can:run-artisan')->group(function () {
        Route::get('/maintenance/status', [MaintenanceController::class, 'status']);
        Route::post('/maintenance/commands', [MaintenanceController::class, 'run']);
        Route::get('/maintenance/emergency', [MaintenanceController::class, 'emergencyStatus'])->middleware('role:Root');
        Route::put('/maintenance/emergency', [MaintenanceController::class, 'updateEmergencyStatus'])->middleware('role:Root');
    });
});
