<?php

namespace App\SubApps\Odds\Services;

use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\SystemRule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OddsConfigService
{
    public function categories(array $filters = []): LengthAwarePaginator
    {
        return Category::query()
            ->when(isset($filters['active']), fn ($query) => $query->where('is_active', (bool) $filters['active']))
            ->orderBy('name')
            ->paginate((int) ($filters['per_page'] ?? 25));
    }

    public function saveCategory(array $data, int $userId, ?Category $category = null): Category
    {
        $payload = $data + ['updated_by' => $userId];

        if (! $category) {
            $payload['created_by'] = $userId;
            $category = new Category;
        }

        $category->fill($payload)->save();

        return $category->refresh();
    }

    public function designerProfiles(array $filters = []): LengthAwarePaginator
    {
        return DesignerProfile::query()
            ->with('user:id,name,email,username')
            ->when(isset($filters['active']), fn ($query) => $query->where('is_active', (bool) $filters['active']))
            ->orderBy('assignment_priority')
            ->paginate((int) ($filters['per_page'] ?? 25));
    }

    public function saveDesignerProfile(array $data, int $userId, ?DesignerProfile $profile = null): DesignerProfile
    {
        $payload = $data + ['updated_by' => $userId];

        if (! $profile) {
            $payload['created_by'] = $userId;
            $profile = new DesignerProfile;
        }

        $profile->fill($payload)->save();

        return $profile->load('user');
    }

    public function rules(array $filters = []): LengthAwarePaginator
    {
        return SystemRule::query()
            ->when(isset($filters['active']), fn ($query) => $query->where('is_active', (bool) $filters['active']))
            ->orderBy('key')
            ->paginate((int) ($filters['per_page'] ?? 25));
    }

    public function saveRule(array $data, int $userId, ?SystemRule $rule = null): SystemRule
    {
        $payload = $data + ['updated_by' => $userId];

        if (! $rule) {
            $payload['created_by'] = $userId;
            $rule = new SystemRule;
        }

        $rule->fill($payload)->save();

        return $rule->refresh();
    }

    public function ruleValue(string $key, mixed $default = null): mixed
    {
        $rule = SystemRule::query()
            ->where('key', $key)
            ->where('is_active', true)
            ->first();

        return $rule?->value ?? $default;
    }
}
