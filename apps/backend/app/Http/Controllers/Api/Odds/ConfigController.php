<?php

namespace App\Http\Controllers\Api\Odds;

use App\Enums\Odds\DesignerAvailabilityEnum;
use App\Http\Controllers\Api\BaseApiController;
use App\Models\Odds\Category;
use App\Models\Odds\DesignerProfile;
use App\Models\Odds\SystemRule;
use App\Services\Odds\OddsConfigService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ConfigController extends BaseApiController
{
    public function __construct(private OddsConfigService $config) {}

    public function categories(Request $request): JsonResponse
    {
        return $this->sendResponse($this->config->categories($request->query()), 'Kategori ODDS berhasil diambil.');
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $category = $this->config->saveCategory($this->categoryPayload($request), $request->user()->id);

        return $this->sendResponse($category, 'Kategori ODDS berhasil dibuat.', 201);
    }

    public function updateCategory(Request $request, Category $category): JsonResponse
    {
        $category = $this->config->saveCategory($this->categoryPayload($request, true), $request->user()->id, $category);

        return $this->sendResponse($category, 'Kategori ODDS berhasil diperbarui.');
    }

    public function deleteCategory(Category $category): JsonResponse
    {
        $category->delete();

        return $this->sendResponse(null, 'Kategori ODDS berhasil dihapus.');
    }

    public function designerProfiles(Request $request): JsonResponse
    {
        return $this->sendResponse($this->config->designerProfiles($request->query()), 'Profil desainer ODDS berhasil diambil.');
    }

    public function storeDesignerProfile(Request $request): JsonResponse
    {
        $profile = $this->config->saveDesignerProfile($this->designerProfilePayload($request), $request->user()->id);

        return $this->sendResponse($profile, 'Profil desainer ODDS berhasil dibuat.', 201);
    }

    public function updateDesignerProfile(Request $request, DesignerProfile $designerProfile): JsonResponse
    {
        $profile = $this->config->saveDesignerProfile($this->designerProfilePayload($request, true, $designerProfile), $request->user()->id, $designerProfile);

        return $this->sendResponse($profile, 'Profil desainer ODDS berhasil diperbarui.');
    }

    public function deleteDesignerProfile(DesignerProfile $designerProfile): JsonResponse
    {
        $designerProfile->delete();

        return $this->sendResponse(null, 'Profil desainer ODDS berhasil dihapus.');
    }

    public function systemRules(Request $request): JsonResponse
    {
        return $this->sendResponse($this->config->rules($request->query()), 'Rules ODDS berhasil diambil.');
    }

    public function storeSystemRule(Request $request): JsonResponse
    {
        $rule = $this->config->saveRule($this->rulePayload($request), $request->user()->id);

        return $this->sendResponse($rule, 'Rule ODDS berhasil dibuat.', 201);
    }

    public function updateSystemRule(Request $request, SystemRule $systemRule): JsonResponse
    {
        $rule = $this->config->saveRule($this->rulePayload($request, true), $request->user()->id, $systemRule);

        return $this->sendResponse($rule, 'Rule ODDS berhasil diperbarui.');
    }

    public function deleteSystemRule(SystemRule $systemRule): JsonResponse
    {
        $systemRule->delete();

        return $this->sendResponse(null, 'Rule ODDS berhasil dihapus.');
    }

    private function categoryPayload(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'name' => [$partial ? 'sometimes' : 'required', 'string', 'max:120'],
            'score_weight' => [$partial ? 'sometimes' : 'required', 'numeric', 'min:0'],
            'normal_revision_limit' => [$partial ? 'sometimes' : 'required', 'integer', 'min:0'],
            'workload_point' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'sla_days' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
    }

    private function designerProfilePayload(Request $request, bool $partial = false, ?DesignerProfile $profile = null): array
    {
        return $request->validate([
            'user_id' => [
                $partial ? 'sometimes' : 'required',
                'integer',
                'exists:users,id',
                Rule::unique('odds_designer_profiles', 'user_id')
                    ->ignore($profile?->id)
                    ->whereNull('deleted_at'),
            ],
            'status' => [$partial ? 'sometimes' : 'required', Rule::in(DesignerAvailabilityEnum::values())],
            'specializations' => ['sometimes', 'array'],
            'daily_capacity_points' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'max_active_tasks' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'assignment_priority' => ['sometimes', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
    }

    private function rulePayload(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'key' => [$partial ? 'sometimes' : 'required', 'string', 'max:120'],
            'value' => [$partial ? 'sometimes' : 'required', 'array'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
    }
}
