<?php

namespace App\Http\Controllers\Api\CreativeReport;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\CreativeReport\IndexAssessmentRequest;
use App\Http\Requests\CreativeReport\UpdateAssessmentRequest;
use App\Http\Resources\CreativeReport\AssessmentResource;
use App\Models\Core\User;
use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\CreativeReport\Services\AssessmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssessmentController extends BaseApiController
{
    public function __construct(private readonly AssessmentService $service) {}

    public function index(IndexAssessmentRequest $request): JsonResponse
    {
        Gate::authorize('viewAny', Assessment::class);
        $period = $request->string('month', now()->format('Y-m'))->toString();
        $query = Assessment::query()->with(['group', 'user.position.division'])->whereDate('period', $period.'-01');
        if ($request->filled('jobdesk')) {
            $query->whereHas('user.position', fn ($q) => $q->where('name', $request->string('jobdesk')));
        }
        if ($request->filled('search')) {
            $query->whereHas('user', fn ($q) => $q->where('name', 'like', '%'.$request->string('search').'%'));
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
        $assessment->load(['group', 'user.position.division']);

        return $this->sendResponse(AssessmentResource::make($assessment)->resolve($request), 'Detail laporan creative berhasil diambil.');
    }

    public function userDetail(IndexAssessmentRequest $request, User $user): JsonResponse
    {
        Gate::authorize('viewAny', Assessment::class);
        $period = $request->string('month', now()->format('Y-m'))->toString();
        $assessment = Assessment::query()->with(['group', 'user.position.division'])
            ->where('user_id', $user->id)->whereDate('period', $period.'-01')->firstOrFail();
        $detail = AssessmentResource::make($assessment)->resolve($request);
        $detail['available_months'] = Assessment::query()->where('user_id', $user->id)
            ->orderByDesc('period')->pluck('period')->map(fn ($item) => $item->format('Y-m'))->values();

        return $this->sendResponse($detail, 'Detail laporan user berhasil diambil.');
    }

    public function complete(Request $request, Assessment $assessment): JsonResponse
    {
        Gate::authorize('complete', $assessment);
        $assessment = $this->service->complete($assessment, $request->user());

        return $this->sendResponse(AssessmentResource::make($assessment)->resolve($request), 'Penilaian berhasil diselesaikan.');
    }
}
