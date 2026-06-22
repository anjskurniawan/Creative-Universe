<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileSessionController extends BaseApiController
{
    /**
     * Display a listing of active user sessions.
     */
    public function index(Request $request): JsonResponse
    {
        $currentSessionId = $request->session()->getId();

        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) use ($currentSessionId) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => date('c', $session->last_activity),
                    'is_current' => $session->id === $currentSessionId,
                ];
            });

        return $this->sendResponse($sessions, 'Daftar sesi perangkat berhasil diambil.');
    }

    /**
     * Revoke / destroy a specific user session.
     */
    public function destroy(Request $request, string $sessionId): JsonResponse
    {
        $sessionQuery = DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', $request->user()->id);

        if (! $sessionQuery->exists()) {
            return $this->sendError('Sesi tidak ditemukan atau Anda tidak memiliki akses.', [], 404);
        }

        $sessionQuery->delete();

        return $this->sendResponse(null, 'Sesi perangkat berhasil dicabut.');
    }
}
