<?php

namespace App\Http\Controllers\Api\Core;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Core\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->limit(10)
            ->get();

        return $this->sendResponse([
            'notifications' => NotificationResource::collection($notifications)->resolve($request),
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ], 'Notifikasi berhasil diambil.');
    }

    public function read(Request $request, string $notificationId): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->whereKey($notificationId)
            ->first();

        if (! $notification) {
            return $this->sendError('Notifikasi tidak ditemukan.', [], 404);
        }

        $notification->markAsRead();
        $notification->refresh();

        return $this->sendResponse(
            (new NotificationResource($notification))->resolve($request),
            'Notifikasi ditandai sudah dibaca.'
        );
    }

    public function readAll(Request $request): JsonResponse
    {
        $updated = $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return $this->sendResponse(
            ['updated_count' => $updated],
            'Semua notifikasi ditandai sudah dibaca.'
        );
    }
}
