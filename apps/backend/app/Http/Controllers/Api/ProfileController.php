<?php

namespace App\Http\Controllers\Api;

use App\Actions\Core\UpdateProfileAction;
use App\Actions\Core\UpdateUserAvatarAction;
use App\Actions\Core\UpdateUserPasswordAction;
use App\Http\Requests\Api\UpdateAvatarRequest;
use App\Http\Requests\Api\UpdatePasswordRequest;
use App\Http\Requests\Api\UpdateProfileRequest;
use App\Http\Resources\UserProfileResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends BaseApiController
{
    public function show(Request $request): JsonResponse
    {
        return $this->sendResponse(
            (new UserProfileResource($request->user()))->resolve($request),
            'Profil berhasil diambil.'
        );
    }

    public function update(UpdateProfileRequest $request, UpdateProfileAction $action): JsonResponse
    {
        $user = $action->handle($request->user(), $request->validated());

        return $this->sendResponse(
            (new UserProfileResource($user))->resolve($request),
            'Profil berhasil diperbarui.'
        );
    }

    public function updatePassword(
        UpdatePasswordRequest $request,
        UpdateUserPasswordAction $action
    ): JsonResponse {
        $action->handle($request->user(), $request->string('password')->toString());

        return $this->sendResponse(null, 'Password berhasil diperbarui.');
    }

    public function updateAvatar(
        UpdateAvatarRequest $request,
        UpdateUserAvatarAction $action
    ): JsonResponse {
        $user = $action->handle($request->user(), $request->file('avatar'));

        return $this->sendResponse(
            (new UserProfileResource($user))->resolve($request),
            'Avatar berhasil diperbarui.'
        );
    }

    public function activities(Request $request): JsonResponse
    {
        $activities = \Spatie\Activitylog\Models\Activity::where('causer_id', $request->user()->id)
            ->latest()
            ->take(10)
            ->get();

        $mapped = $activities->map(function ($activity) {
            return [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'event' => $activity->event,
                'created_at' => $activity->created_at->toIso8601String(),
                'properties' => $activity->properties,
            ];
        });

        return $this->sendResponse($mapped, 'Log aktivitas berhasil diambil.');
    }
}
