<?php

namespace App\Http\Controllers\Api\CreativeReport;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\CreativeReport\IndexAssessmentRequest;
use App\Http\Requests\CreativeReport\UpdateAssessmentRequest;
use App\Http\Resources\CreativeReport\AssessmentResource;
use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\CreativeReport\Models\CreativeMember;
use App\SubApps\CreativeReport\Services\AssessmentService;
use App\SubApps\CreativeReport\Services\CreativeMembershipService;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\DesignerDailyReport;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Services\OddsScheduleService;
use App\Services\Core\FileStorageService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class AssessmentController extends BaseApiController
{
    public function __construct(
        private readonly AssessmentService $service,
        private readonly CreativeMembershipService $memberships,
        private readonly OddsScheduleService $oddsSchedule,
    ) {}

    public function index(IndexAssessmentRequest $request): JsonResponse
    {
        Gate::authorize('viewAny', Assessment::class);
        $period = $request->string('month', now()->format('Y-m'))->toString();
        $selectedPeriod = Carbon::createFromFormat('Y-m', $period)->startOfMonth();
        if ($selectedPeriod->gt(now()->startOfMonth())) {
            return $this->sendResponse([
                'month' => $period,
                'groups' => [],
                'notice' => 'Data Bulan '.$selectedPeriod->locale('id')->monthName.' '.$selectedPeriod->year.' belum disiapkan.',
            ], 'Data bulan belum disiapkan.');
        }
        $this->memberships->syncFromCreativeRoles();
        $this->memberships->ensureAssessmentsForPeriod($selectedPeriod);
        $query = Assessment::query()
            ->with(['group', 'member', 'user.position.division'])
            ->whereHas('member', fn ($member) => $member->whereNotNull('user_id')->where('position_name', '!=', 'Manajer')->whereHas('user'))
            ->whereDate('period', $period.'-01');
        if ($request->filled('jobdesk')) {
            $query->where(fn ($q) => $q->whereHas('member', fn ($member) => $member->where('position_name', $request->string('jobdesk')))
                ->orWhereHas('user.position', fn ($user) => $user->where('name', $request->string('jobdesk'))));
        }
        if ($request->filled('search')) {
            $query->where(fn ($q) => $q->whereHas('member', fn ($member) => $member->where('name', 'like', '%'.$request->string('search').'%'))
                ->orWhereHas('user', fn ($user) => $user->where('name', 'like', '%'.$request->string('search').'%')));
        }

        $groups = $query->get()->groupBy('creative_report_group_id')->map(fn ($rows) => [
            'id' => $rows->first()->group->id,
            'name' => $rows->first()->group->name,
            'sort_order' => $rows->first()->group->sort_order,
            'staff_count' => $rows->count(),
            'assessments' => AssessmentResource::collection($rows)->resolve($request),
        ])->sortBy('sort_order')->values();

        return $this->sendResponse(['month' => $period, 'groups' => $groups, 'notice' => null], 'Laporan creative berhasil diambil.');
    }

    public function update(UpdateAssessmentRequest $request, Assessment $assessment): JsonResponse
    {
        Gate::authorize('update', $assessment);
        $assessment = $this->service->saveDraft($assessment, $request->validated());

        return $this->sendResponse(AssessmentResource::make($assessment)->resolve($request), 'Draft penilaian berhasil disimpan.');
    }

    public function show(Request $request, Assessment $assessment): JsonResponse
    {
        Gate::authorize('view', $assessment);
        $assessment->load(['group', 'member', 'user.position.division']);

        return $this->sendResponse(AssessmentResource::make($assessment)->resolve($request), 'Detail laporan creative berhasil diambil.');
    }

    public function userDetail(IndexAssessmentRequest $request, int $user): JsonResponse
    {
        Gate::authorize('viewAny', Assessment::class);
        $period = $request->string('month', now()->format('Y-m'))->toString();
        $assessment = Assessment::query()->with(['group', 'member', 'user.position.division'])
            ->where('creative_report_member_id', $user)
            ->whereDate('period', $period.'-01')->firstOrFail();
        $detail = AssessmentResource::make($assessment)->resolve($request);
        $detail['available_months'] = Assessment::query()->where('creative_report_member_id', $user)
            ->orderByDesc('period')->pluck('period')->map(fn ($item) => $item->format('Y-m'))->values();

        return $this->sendResponse($detail, 'Detail laporan user berhasil diambil.');
    }

    public function complete(Request $request, Assessment $assessment): JsonResponse
    {
        Gate::authorize('complete', $assessment);
        $assessment = $this->service->complete($assessment, $request->user());

        return $this->sendResponse(AssessmentResource::make($assessment)->resolve($request), 'Penilaian berhasil diselesaikan.');
    }

    public function pendingMembers(Request $request): JsonResponse
    {
        $this->authorizeMembershipReview($request);

        return $this->sendResponse(CreativeMember::query()->with('user')->where('status', CreativeMember::STATUS_PENDING)
            ->orderBy('created_at')->get()->map(fn (CreativeMember $member) => $this->memberPayload($member)), 'Menunggu validasi anggota Creative.');
    }

    public function members(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Assessment::class);
        return $this->sendResponse(CreativeMember::query()
            ->with('user')
            ->whereNotNull('user_id')
            ->whereHas('user')
            ->where('position_name', '!=', 'Manajer')
            ->whereIn('status', [CreativeMember::STATUS_ACTIVE, CreativeMember::STATUS_RESIGNED])
            ->orderBy('name')
            ->get()
            ->map(fn (CreativeMember $member) => $this->memberPayload($member)), 'Anggota Creative berhasil diambil.');
    }

    public function approveMember(Request $request, CreativeMember $member): JsonResponse
    {
        $this->authorizeMembershipReview($request);
        abort_unless($member->status === CreativeMember::STATUS_PENDING, 422, 'Anggota ini sudah diproses.');
        $member = $this->memberships->approve($member, $request->user());

        return $this->sendResponse($this->memberPayload($member), 'Anggota Creative disetujui.');
    }

    public function rejectMember(Request $request, CreativeMember $member): JsonResponse
    {
        $this->authorizeMembershipReview($request);
        abort_unless($member->status === CreativeMember::STATUS_PENDING, 422, 'Anggota ini sudah diproses.');
        $user = $member->user;
        $member->delete();
        if ($user && config('session.driver') === 'database') {
            DB::table(config('session.table', 'sessions'))->where('user_id', $user->id)->delete();
        }
        $user?->forceDelete();

        return $this->sendResponse(null, 'Validasi ditolak. Akun pengguna telah dihapus dan sesi login dicabut.');
    }

    public function createHistoricalMember(Request $request): JsonResponse
    {
        $this->authorizeMembershipReview($request);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'position_name' => 'required|in:SPV,Designer,Videographer,Content Creator',
            'start_month' => 'required|date_format:Y-m',
            'end_month' => 'required|date_format:Y-m|after_or_equal:start_month',
        ]);
        $member = $this->memberships->createHistorical($data, $request->user());

        return $this->sendResponse($this->memberPayload($member), 'Personel historis berhasil ditambahkan.');
    }

    public function member(Request $request, CreativeMember $member): JsonResponse
    {
        $this->authorizeMembershipReview($request);
        $member->load('user');
        $profile = $member->user_id ? DesignerProfile::query()->where('user_id', $member->user_id)->first() : null;

        return $this->sendResponse(array_merge($this->memberPayload($member), [
            'joined_at' => $member->joined_at?->toDateString(),
            'resigned_at' => $member->resigned_at?->toDateString(),
            'card_image_path' => $member->card_image_path,
            'profile_metrics' => $member->profile_metrics ?? [],
            'odds_profile' => $profile ? ['id' => $profile->id, 'status' => $profile->status, 'is_active' => $profile->is_active, 'specializations' => $profile->specializations ?? []] : null,
        ]), 'Profil anggota Creative berhasil diambil.');
    }

    public function updateMember(Request $request, CreativeMember $member, FileStorageService $files): JsonResponse
    {
        $this->authorizeMembershipReview($request);
        $request->merge([
            'email' => $request->input('email') ?: null,
            'whatsapp_number' => $request->input('whatsapp_number') ?: null,
        ]);
        foreach (['profile_metrics', 'specializations', 'roles'] as $jsonField) {
            if (is_string($request->input($jsonField))) {
                $decoded = json_decode($request->input($jsonField), true);
                if (json_last_error() === JSON_ERROR_NONE) $request->merge([$jsonField => $decoded]);
            }
        }
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'whatsapp_number' => 'nullable|string|regex:/^62[0-9]{8,13}$/',
            'roles' => 'sometimes|array',
            'roles.*' => 'string|exists:roles,name',
            'position_name' => 'sometimes|in:Manajer,SPV,Designer,Videographer,Content Creator',
            'joined_at' => 'nullable|date',
            'resigned_at' => 'nullable|date|after_or_equal:joined_at',
            'profile_metrics' => 'sometimes|array',
            'profile_metrics.*' => 'numeric|min:0|max:10',
            'specializations' => 'sometimes|array',
            'specializations.*' => 'integer|exists:odds_categories,id',
            'odds_status' => 'sometimes|in:available,off',
            'odds_is_active' => 'sometimes|boolean',
            'card_image' => 'nullable|file|max:10240|mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg',
            'remove_card_image' => 'nullable|boolean',
        ]);
        DB::transaction(function () use ($request, $member, $data, $files) {
            if ($request->boolean('remove_card_image') && $member->card_image_path) {
                $files->deleteByPath($member->card_image_path, 'public');
                $data['card_image_path'] = null;
            }
            if ($request->hasFile('card_image')) {
                $stored = $files->store($request->file('card_image'), 'creative-report', 'members', $member->id, 'profile-cards', $request->user()->id, 'public');
                if ($member->card_image_path) $files->deleteByPath($member->card_image_path, 'public');
                $data['card_image_path'] = $stored->path;
            }
            unset($data['card_image'], $data['remove_card_image'], $data['specializations'], $data['odds_status'], $data['odds_is_active']);
            $member->update($data);
            if ($member->user_id && (array_key_exists('name', $data) || array_key_exists('email', $data) || array_key_exists('whatsapp_number', $data))) {
                $member->user()->update(array_intersect_key($data, array_flip(['name', 'email', 'whatsapp_number'])));
            }
            if ($member->user_id && array_key_exists('roles', $data)) {
                $member->user->syncRoles($data['roles']);
            }
            unset($data['email'], $data['whatsapp_number'], $data['roles']);
            if ($member->user_id && (array_key_exists('specializations', $request->all()) || array_key_exists('odds_status', $request->all()) || array_key_exists('odds_is_active', $request->all()))) {
                // The user_id is unique even when a profile was soft-deleted. Reuse and
                // restore that row instead of firstOrCreate() attempting a duplicate insert.
                $profile = DesignerProfile::withTrashed()->firstOrNew(['user_id' => $member->user_id]);
                if ($profile->exists && $profile->trashed()) {
                    $profile->restore();
                }
                if (! $profile->exists) {
                    $profile->fill([
                        'status' => 'available',
                        'specializations' => [],
                        'is_active' => true,
                        'created_by' => $request->user()->id,
                    ]);
                }
                $profile->update(array_filter([
                    'specializations' => $request->input('specializations'),
                    'status' => $request->input('odds_status'),
                    'is_active' => $request->input('odds_is_active'),
                ], fn ($value) => $value !== null));
            }
        });
        return $this->member($request, $member->fresh());
    }

    private function authorizeMembershipReview(Request $request): void
    {
        abort_unless($request->user()->hasAnyRole(['Root', 'Manajer']), 403);
    }

    private function memberPayload(CreativeMember $member): array
    {
        $profile = $member->user_id ? DesignerProfile::query()->where('user_id', $member->user_id)->first() : null;
        $specializations = $profile?->specializations ?? [];
        $categoryIds = collect($specializations)->filter(fn ($value) => is_numeric($value))->map(fn ($value) => (int) $value);
        $categoryNames = Category::query()->whereIn('id', $categoryIds)->pluck('name')->all();
        $legacyNames = collect($specializations)->filter(fn ($value) => is_string($value) && !is_numeric($value))->values()->all();

        return ['id' => $member->id, 'user_id' => $member->user_id, 'name' => $member->user?->name ?? $member->name, 'email' => $member->user?->email, 'whatsapp_number' => $member->user?->whatsapp_number, 'roles' => $member->user?->getRoleNames()->values()->all() ?? [], 'position_name' => $member->position_name, 'status' => $member->status, 'card_image_path' => $member->card_image_path, 'profile_metrics' => $member->profile_metrics ?? [], 'joined_at' => $member->joined_at?->toDateString(), 'resigned_at' => $member->resigned_at?->toDateString(), 'specialties' => array_values(array_unique([...$categoryNames, ...$legacyNames])), 'odds_metrics' => $this->oddsMetrics($member->user_id)];
    }

    private function oddsMetrics(?int $userId): array
    {
        if (! $userId) return ['avg_response_minutes' => null, 'on_time_rate' => null, 'user_rating' => null, 'rating_count' => 0, 'capacity_percent' => null, 'average_score' => null];
        $daily = DesignerDailyReport::query()->where('designer_id', $userId);
        $done = (clone $daily)->where('output_done', true);
        $doneCount = (clone $done)->count();
        $profile = DesignerProfile::query()->where('user_id', $userId)->first();
        $responseDurations = DB::table('odds_task_briefs as brief')
            ->join('odds_tasks as task', 'task.id', '=', 'brief.task_id')
            ->join('activity_log as activity', function ($join) {
                $join->on('activity.subject_id', '=', 'task.id')
                    ->where('activity.subject_type', 'App\\SubApps\\Odds\\Models\\Task')
                    ->whereIn('activity.event', ['brief_accepted', 'brief_returned']);
            })
            ->where('task.assigned_designer_id', $userId)
            ->where('activity.created_at', '>=', DB::raw('brief.created_at'))
            ->groupBy('brief.id', 'brief.created_at')
            ->selectRaw('TIMESTAMPDIFF(MINUTE, brief.created_at, MIN(activity.created_at)) as response_minutes')
            ->pluck('response_minutes');
        $avgResponse = $responseDurations->isNotEmpty() ? $responseDurations->avg() : null;
        $rating = (clone $daily)->whereNotNull('rating')->selectRaw('AVG(rating) as average, COUNT(rating) as count')->first();
        return [
            'avg_response_minutes' => $avgResponse !== null ? (int) round($avgResponse) : null,
            'on_time_rate' => $doneCount ? (int) round(((clone $done)->where('overdue', false)->count() / $doneCount) * 100) : null,
            'user_rating' => $rating?->average !== null ? round((float) $rating->average, 1) : null,
            'rating_count' => (int) ($rating?->count ?? 0),
            'capacity_percent' => $profile ? $this->capacityToday($profile) : null,
            'average_score' => (clone $daily)->count() ? round((float) (clone $daily)->avg('score'), 1) : null,
        ];
    }

    private function capacityToday(DesignerProfile $profile): int
    {
        $dailyCapacity = $this->oddsSchedule->getCapacityForDate(now()->toImmutable(), $profile);
        if ($dailyCapacity <= 0) return 0;

        return min(100, (int) round(($profile->current_load_minutes / $dailyCapacity) * 100));
    }
}
