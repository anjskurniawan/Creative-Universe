<?php

use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\CreativeReport\Models\CreativeMember;
use App\SubApps\CreativeReport\Models\ReportGroup;
use App\Models\Core\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $creativeRoles = ['Manajer', 'SPV', 'Designer', 'Videographer', 'Content Creator'];

        // 1. Sinkronkan position_id dan CreativeMember.position berdasarkan role Spatie
        User::all()->each(function (User $user) use ($creativeRoles) {
            $roles = $user->getRoleNames()->toArray();
            $matchingRole = collect($roles)->first(fn ($role) => in_array($role, $creativeRoles, true));
            if (! $matchingRole) {
                return;
            }

            $position = \App\Models\Core\Position::where('name', $matchingRole)
                ->whereHas('division', fn ($q) => $q->where('name', 'Creative'))
                ->first();

            if ($position && $user->position_id !== $position->id) {
                $user->position_id = $position->id;
                $user->saveQuietly();
            }

            $member = CreativeMember::where('user_id', $user->id)->first();
            if ($member && ($member->position_id !== $position?->id || $member->position_name !== $matchingRole)) {
                $member->update([
                    'position_id'   => $position?->id,
                    'position_name' => $matchingRole,
                ]);
            }
        });

        // 2. Buat CreativeMember untuk user yang punya assessment tapi belum terdaftar
        $assessmentUserIds = Assessment::whereNotNull('user_id')->pluck('user_id')->unique();
        $memberUserIds     = CreativeMember::whereNotNull('user_id')->pluck('user_id')->unique();
        $missingUserIds    = $assessmentUserIds->diff($memberUserIds);

        foreach ($missingUserIds as $userId) {
            $user = User::with('position')->find($userId);
            if (! $user) {
                continue;
            }

            $positionName = $user->position?->name ?? 'Designer';
            if ($positionName === 'Manajer') {
                continue;
            }

            $member = CreativeMember::create([
                'user_id'       => $user->id,
                'name'          => $user->name,
                'position_id'   => $user->position_id,
                'position_name' => $positionName,
                'status'        => CreativeMember::STATUS_ACTIVE,
                'joined_at'     => now(),
            ]);

            Assessment::where('user_id', $user->id)
                ->whereNull('creative_report_member_id')
                ->update(['creative_report_member_id' => $member->id]);
        }

        // 3. Perbaiki creative_report_group_id assessment berdasarkan posisi user
        Assessment::with('user.position')->get()->each(function (Assessment $assessment) {
            $user = $assessment->user;
            if (! $user || ! $user->position) {
                return;
            }

            $positionName = $user->position->name;
            $groupName = match ($positionName) {
                'SPV'             => 'Supervisor Creative Production',
                'Videographer'    => 'Creative Video Production',
                'Content Creator' => 'Creative Content Production',
                default           => 'Creative Design Production',
            };
            $sortOrder = match ($positionName) {
                'SPV'             => 1,
                'Videographer'    => 3,
                'Content Creator' => 4,
                default           => 2,
            };

            $group = ReportGroup::firstOrCreate(
                ['name' => $groupName],
                ['sort_order' => $sortOrder],
            );

            if ($assessment->creative_report_group_id !== $group->id) {
                $assessment->update(['creative_report_group_id' => $group->id]);
            }
        });
    }

    public function down(): void {}
};
