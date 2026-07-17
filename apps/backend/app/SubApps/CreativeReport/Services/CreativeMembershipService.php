<?php

namespace App\SubApps\CreativeReport\Services;

use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\CreativeReport\Models\CreativeMember;
use App\SubApps\CreativeReport\Models\ReportGroup;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreativeMembershipService
{
    public function registerPending(User $user): CreativeMember
    {
        return CreativeMember::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'position_id' => $user->position_id,
                'position_name' => $user->position?->name ?? 'Staff',
                'status' => CreativeMember::STATUS_PENDING,
                'joined_at' => null,
                'resigned_at' => null,
                'reviewed_by' => null,
                'reviewed_at' => null,
            ],
        );
    }

    public function approve(CreativeMember $member, User $reviewer): CreativeMember
    {
        return DB::transaction(function () use ($member, $reviewer) {
            $member->update([
                'status' => CreativeMember::STATUS_ACTIVE,
                'joined_at' => $member->joined_at ?? now(),
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);
            $this->ensureAssessment($member, now()->startOfMonth());

            return $member->fresh(['user', 'position']);
        });
    }

    public function createHistorical(array $data, User $reviewer): CreativeMember
    {
        return DB::transaction(function () use ($data, $reviewer) {
            $member = CreativeMember::create([
                'name' => $data['name'],
                'position_name' => $data['position_name'],
                'status' => CreativeMember::STATUS_RESIGNED,
                'joined_at' => Carbon::createFromFormat('Y-m', $data['start_month'])->startOfMonth(),
                'resigned_at' => Carbon::createFromFormat('Y-m', $data['end_month'])->endOfMonth(),
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);

            $period = Carbon::createFromFormat('Y-m', $data['start_month'])->startOfMonth();
            $endPeriod = Carbon::createFromFormat('Y-m', $data['end_month'])->startOfMonth();
            while ($period->lte($endPeriod)) {
                $this->ensureAssessment($member, $period);
                $period->addMonth();
            }

            return $member;
        });
    }

    public function ensureAssessmentsForPeriod(Carbon $period): void
    {
        CreativeMember::query()->whereIn('status', [CreativeMember::STATUS_ACTIVE, CreativeMember::STATUS_RESIGNED])
            ->whereNot('position_name', 'Manajer')
            ->whereDate('joined_at', '<=', $period->copy()->endOfMonth())
            ->where(fn ($query) => $query->whereNull('resigned_at')->orWhereDate('resigned_at', '>=', $period->copy()->startOfMonth()))
            ->each(fn (CreativeMember $member) => $this->ensureAssessment($member, $period));
    }

    private function ensureAssessment(CreativeMember $member, Carbon $period): void
    {
        if ($member->isManager()) {
            return;
        }

        $group = ReportGroup::firstOrCreate(
            ['name' => match ($member->position_name) {
                'SPV' => 'Supervisor Creative Production',
                'Videographer' => 'Creative Video Production',
                default => 'Creative Design Production',
            }],
            ['sort_order' => match ($member->position_name) {
                'SPV' => 1,
                'Videographer' => 2,
                default => 3,
            }],
        );

        Assessment::firstOrCreate(
            ['creative_report_member_id' => $member->id, 'period' => $period->toDateString()],
            [
                'creative_report_group_id' => $group->id,
                'user_id' => $member->user_id,
                'creative_scores' => array_fill(0, 10, 0),
            ],
        );
    }
}
