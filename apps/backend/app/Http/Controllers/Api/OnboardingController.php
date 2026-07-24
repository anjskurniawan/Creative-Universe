<?php

namespace App\Http\Controllers\Api;

use App\Models\Core\Division;
use App\Models\Core\Position;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Services\CreativeMembershipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OnboardingController extends BaseApiController
{
    private const CREATIVE_DIVISION_NAME = 'Creative';

    private const CREATIVE_POSITION_NAMES = [
        'Manajer',
        'SPV',
        'Designer',
        'Videographer',
    ];

    private const SINGLE_OCCUPANCY_CREATIVE_POSITION_NAMES = [
        'Manajer',
        'SPV',
    ];

    /**
     * Get divisions and positions for onboarding form.
     */
    public function data(): JsonResponse
    {
        $occupiedSingletonPositionIds = User::query()
            ->where('id', '!=', Auth::id())
            ->whereHas('position', function ($query) {
                $query
                    ->whereIn('name', self::SINGLE_OCCUPANCY_CREATIVE_POSITION_NAMES)
                    ->whereHas('division', function ($divisionQuery) {
                        $divisionQuery->where('name', self::CREATIVE_DIVISION_NAME);
                    });
            })
            ->pluck('position_id')
            ->all();

        $divisions = Division::with('positions')->orderBy('id')->get();

        $divisions->each(function (Division $division) use ($occupiedSingletonPositionIds) {
            if ($division->name !== self::CREATIVE_DIVISION_NAME) {
                $division->setRelation('positions', collect());

                return;
            }

            $positions = $division->positions
                ->filter(fn (Position $position) => in_array($position->name, self::CREATIVE_POSITION_NAMES, true))
                ->reject(fn (Position $position) => in_array($position->id, $occupiedSingletonPositionIds, true))
                ->sortBy(fn (Position $position) => array_search($position->name, self::CREATIVE_POSITION_NAMES, true))
                ->values();

            $division->setRelation('positions', $positions);
        });

        return $this->sendResponse($divisions, 'Onboarding data retrieved successfully.');
    }

    /**
     * Submit onboarding data and update user.
     */
    public function submit(Request $request, CreativeMembershipService $memberships): JsonResponse
    {
        if ($request->has('whatsapp_number') && $request->input('whatsapp_number')) {
            $wa = preg_replace('/[^0-9]/', '', $request->input('whatsapp_number'));
            if (str_starts_with($wa, '0')) {
                $wa = '62' . substr($wa, 1);
            }
            $request->merge(['whatsapp_number' => $wa]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
            'position_id' => 'nullable|integer|exists:positions,id',
            'position_name' => 'nullable|string|max:100',
            'whatsapp_number' => ['required', 'string', 'regex:/^62[0-9]{8,13}$/'],
        ]);

        /** @var User $user */
        $user = Auth::user();

        return DB::transaction(function () use ($validated, $user, $memberships) {
            $division = Division::find($validated['division_id']);

            if (! $division) {
                return $this->sendError('Divisi tidak valid.', [
                    'division_id' => ['Divisi tidak valid.'],
                ], 422);
            }

            if ($division->name === self::CREATIVE_DIVISION_NAME) {
                if (empty($validated['position_id'])) {
                    return $this->sendError('Jabatan wajib dipilih.', [
                        'position_id' => ['Jabatan wajib dipilih.'],
                    ], 422);
                }

                $position = Position::query()
                    ->where('id', $validated['position_id'])
                    ->where('division_id', $division->id)
                    ->whereIn('name', self::CREATIVE_POSITION_NAMES)
                    ->lockForUpdate()
                    ->first();

                if (! $position) {
                    return $this->sendError('Jabatan Creative tidak valid.', [
                        'position_id' => ['Jabatan Creative tidak valid.'],
                    ], 422);
                }

                if (
                    in_array($position->name, self::SINGLE_OCCUPANCY_CREATIVE_POSITION_NAMES, true)
                    && $this->positionIsAlreadyFilled($position, $user->id)
                ) {
                    return $this->sendError("Jabatan {$position->name} sudah terisi.", [
                        'position_id' => ["Jabatan {$position->name} sudah terisi."],
                    ], 422);
                }
            } else {
                $positionName = trim((string) ($validated['position_name'] ?? ''));

                if ($positionName === '') {
                    return $this->sendError('Jabatan wajib diisi.', [
                        'position_name' => ['Jabatan wajib diisi.'],
                    ], 422);
                }

                $position = Position::firstOrCreate([
                    'division_id' => $division->id,
                    'name' => $positionName,
                ]);
            }

            $user->update([
                'name' => $validated['name'],
                'division_id' => $division->id,
                'position_id' => $position->id,
                'whatsapp_number' => $validated['whatsapp_number'],
                'is_onboarded' => true,
            ]);

            $isCreativePosition = $division->name === self::CREATIVE_DIVISION_NAME
                && in_array($position->name, self::CREATIVE_POSITION_NAMES, true);
            $roleName = $isCreativePosition ? $position->name : 'Client';

            $user->syncRoles([$roleName]);

            if ($isCreativePosition) {
                $user->load('position');
                $memberships->registerPending($user);
            }

            return $this->sendResponse(null, 'Onboarding completed successfully.');
        });
    }

    private function positionIsAlreadyFilled(Position $position, int $currentUserId): bool
    {
        return User::query()
            ->where('id', '!=', $currentUserId)
            ->where('position_id', $position->id)
            ->exists();
    }
}
