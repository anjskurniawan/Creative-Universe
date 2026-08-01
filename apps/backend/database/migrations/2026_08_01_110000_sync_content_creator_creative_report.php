<?php

use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\CreativeMember;
use App\SubApps\CreativeReport\Models\ReportGroup;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    public function up(): void
    {
        Role::firstOrCreate([
            'name' => 'Content Creator',
            'guard_name' => 'web',
        ]);

        $group = ReportGroup::firstOrCreate(
            ['name' => 'Creative Content Production'],
            ['sort_order' => 4],
        );

        User::query()
            ->where(function ($query): void {
                $query->whereHas('position', fn ($position) => $position->where('name', 'Content Creator'))
                    ->orWhereHas('roles', fn ($role) => $role->where('name', 'Content Creator'));
            })
            ->with('position')
            ->each(function (User $user) use ($group): void {
            $member = CreativeMember::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'name' => $user->name,
                    'position_id' => $user->position_id,
                    'position_name' => 'Content Creator',
                    'status' => CreativeMember::STATUS_ACTIVE,
                    'joined_at' => $user->created_at?->toDateString() ?? now()->toDateString(),
                ],
            );

            $member->assessments()->update(['creative_report_group_id' => $group->id]);
            });
    }

    public function down(): void
    {
        // Data synchronization is intentionally not destructive.
    }
};
