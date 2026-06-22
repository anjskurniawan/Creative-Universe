<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserProfileResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends BaseApiController
{
    /**
     * Handle user login.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        return $this->sendResponse(
            (new UserProfileResource($user))->resolve($request),
            'Login berhasil.'
        );
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return $this->sendResponse(null, 'Logout berhasil.');
    }

    /**
     * Return currently authenticated user info.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->sendResponse(
            (new UserProfileResource($user))->resolve($request),
            'Data pengguna berhasil diambil.'
        );
    }
}
