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
    ) {}

    public function index(IndexAssessmentRequest $request): JsonResponse
    {
        Gate::authorize('viewAny', Assessment::class);
        $period = $request->string('month', now()->format('Y-m'))->toString();
        $this->memberships->ensureAssessmentsForPeriod(Carbon::createFromFormat('Y-m', $period)->startOfMonth());
        $query = Assessment::query()->with(['group', 'member', 'user.position.division'])->whereDate('period', $period.'-01');
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
            'staff_count' => $rows->count(),
            'assessments' => AssessmentResource::collection($rows)->resolve($request),
        ])->values();

        return $this->sendResponse(['month' => $period, 'groups' => $groups], 'Laporan creative berhasil diambil.');
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
            ->where(fn ($query) => $query->where('creative_report_member_id', $user)->orWhere('user_id', $user))
            ->whereDate('period', $period.'-01')->firstOrFail();
        $detail = AssessmentResource::make($assessment)->resolve($request);
        $detail['available_months'] = Assessment::query()->where(fn ($query) => $query->where('creative_report_member_id', $user)->orWhere('user_id', $user))
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
            'position_name' => 'required|in:SPV,Designer,Videographer',
            'start_month' => 'required|date_format:Y-m',
            'end_month' => 'required|date_format:Y-m|after_or_equal:start_month',
        ]);
        $member = $this->memberships->createHistorical($data, $request->user());

        return $this->sendResponse($this->memberPayload($member), 'Personel historis berhasil ditambahkan.');
    }

    private function authorizeMembershipReview(Request $request): void
    {
        abort_unless($request->user()->hasAnyRole(['Root', 'Manajer']), 403);
    }

    private function memberPayload(CreativeMember $member): array
    {
        return ['id' => $member->id, 'name' => $member->name, 'position_name' => $member->position_name, 'status' => $member->status];
    }
}
