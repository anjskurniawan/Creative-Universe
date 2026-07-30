<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Odds\SaveCategoryRequest;
use App\Http\Requests\Odds\SaveDesignerProfileRequest;
use App\Http\Requests\Odds\SaveSystemRuleRequest;
use App\SubApps\Odds\Models\Category;
use App\SubApps\Odds\Models\DesignerProfile;
use App\SubApps\Odds\Models\SystemRule;
use App\SubApps\Odds\Models\ProductCategory;
use App\SubApps\Odds\Models\Product;
use App\SubApps\Odds\Services\OddsConfigService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfigController extends BaseApiController
{
    public function __construct(private OddsConfigService $config) {}

    public function categories(Request $request): JsonResponse
    {
        return $this->sendResponse($this->config->categories($request->query()), 'Kategori ODDS berhasil diambil.');
    }

    public function storeCategory(SaveCategoryRequest $request): JsonResponse
    {
        $category = $this->config->saveCategory($request->validated(), $request->user()->id);

        return $this->sendResponse($category, 'Kategori ODDS berhasil dibuat.', 201);
    }

    public function updateCategory(SaveCategoryRequest $request, Category $category): JsonResponse
    {
        $category = $this->config->saveCategory($request->validated(), $request->user()->id, $category);

        return $this->sendResponse($category, 'Kategori ODDS berhasil diperbarui.');
    }

    public function deleteCategory(Category $category): JsonResponse
    {
        $category->delete();

        return $this->sendResponse(null, 'Kategori ODDS berhasil dihapus.');
    }

    public function productCatalog(Request $request): JsonResponse
    {
        $categories = ProductCategory::query()->where('is_active', true)->with(['products' => fn ($query) => $query->where('is_active', true)->orderBy('name')])->orderBy('name')->get();

        return $this->sendResponse($categories, 'Katalog produk ODDS berhasil diambil.');
    }

    public function storeProductCategory(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:120']]);
        $category = ProductCategory::firstOrCreate(['name' => trim($data['name'])], ['created_by' => $request->user()->id, 'updated_by' => $request->user()->id]);

        return $this->sendResponse($category, 'Kategori produk berhasil disimpan.', 201);
    }

    public function storeProduct(Request $request): JsonResponse
    {
        $data = $request->validate(['category' => ['required', 'string', 'max:120'], 'name' => ['required', 'string', 'max:160']]);
        $category = ProductCategory::firstOrCreate(['name' => trim($data['category'])], ['created_by' => $request->user()->id, 'updated_by' => $request->user()->id]);
        $product = Product::firstOrCreate(['product_category_id' => $category->id, 'name' => trim($data['name'])], ['created_by' => $request->user()->id, 'updated_by' => $request->user()->id]);

        return $this->sendResponse($product->load('productCategory'), 'Produk berhasil disimpan.', 201);
    }

    public function designerProfiles(Request $request): JsonResponse
    {
        return $this->sendResponse($this->config->designerProfiles($request->query()), 'Profil desainer ODDS berhasil diambil.');
    }

    public function storeDesignerProfile(SaveDesignerProfileRequest $request): JsonResponse
    {
        $profile = $this->config->saveDesignerProfile($request->validated(), $request->user()->id);

        return $this->sendResponse($profile, 'Profil desainer ODDS berhasil dibuat.', 201);
    }

    public function updateDesignerProfile(SaveDesignerProfileRequest $request, DesignerProfile $designerProfile): JsonResponse
    {
        $profile = $this->config->saveDesignerProfile($request->validated(), $request->user()->id, $designerProfile);

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

    public function storeSystemRule(SaveSystemRuleRequest $request): JsonResponse
    {
        $rule = $this->config->saveRule($request->validated(), $request->user()->id);

        return $this->sendResponse($rule, 'Rule ODDS berhasil dibuat.', 201);
    }

    public function updateSystemRule(SaveSystemRuleRequest $request, SystemRule $systemRule): JsonResponse
    {
        $rule = $this->config->saveRule($request->validated(), $request->user()->id, $systemRule);

        return $this->sendResponse($rule, 'Rule ODDS berhasil diperbarui.');
    }

    public function deleteSystemRule(SystemRule $systemRule): JsonResponse
    {
        $systemRule->delete();

        return $this->sendResponse(null, 'Rule ODDS berhasil dihapus.');
    }
}
