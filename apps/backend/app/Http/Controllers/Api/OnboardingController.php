<?php

namespace App\Http\Controllers\Api;

use App\Models\Core\Division;
use App\Models\Core\Position;
use App\Models\Core\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends BaseApiController
{
    /**
     * Get divisions and positions for onboarding form.
     */
    public function data(): JsonResponse
    {
        $divisions = Division::with('positions')->get();

        return $this->sendResponse($divisions, 'Onboarding data retrieved successfully.');
    }

    /**
     * Submit onboarding data and update user.
     */
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
            'position_id' => 'required|exists:positions,id',
            'whatsapp_number' => 'required|string|max:20',
        ]);

        /** @var User $user */
        $user = Auth::user();

        // Ensure the position belongs to the division
        $position = Position::where('id', $validated['position_id'])
            ->where('division_id', $validated['division_id'])
            ->first();

        if (!$position) {
            return $this->sendError('Invalid position for the selected division.', [], 422);
        }

        // Update user
        $user->update([
            'name' => $validated['name'],
            'division_id' => $validated['division_id'],
            'position_id' => $validated['position_id'],
            'whatsapp_number' => $validated['whatsapp_number'],
            'is_onboarded' => true,
        ]);

        // Role assignment logic
        if ($position->name === 'Designer' || $position->name === 'Videographer') {
            $user->syncRoles([$position->name]); // This will remove Client role and assign Designer/Videographer
        } else {
            // Keep default Client role if they are others, or assign Client if they don't have it
            $user->syncRoles(['Client']);
        }

        return $this->sendResponse(null, 'Onboarding completed successfully.');
    }
}
