<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\StorePricetagCategoryRequest;
use App\Http\Requests\Api\UpdatePricetagCategoryRequest;
use App\Http\Resources\PricetagCategoryResource;
use App\Models\Pricetag\PricetagCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricetagCategoryController extends BaseApiController
{
    public function store(StorePricetagCategoryRequest $request): JsonResponse
    {
        $category = PricetagCategory::create($request->validated());
        $category->loadCount('products');

        return $this->sendResponse(
            new PricetagCategoryResource($category),
            "Kategori {$category->name} berhasil dibuat.",
            201
        );
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PricetagCategory::query()->withCount('products');

        // 1. Filtering
        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->name.'%');
        }

        // 2. Sorting
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = strtolower($request->input('sort_order', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSortFields = ['id', 'name', 'created_at', 'updated_at', 'products_count'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('name', 'asc');
        }

        // 3. Pagination
        $perPage = min(max((int) $request->input('per_page', 12), 1), 100);

        $categories = $query->paginate($perPage);

        return $this->sendResponse(
            PricetagCategoryResource::collection($categories->items()),
            'Daftar kategori berhasil diambil.',
            200,
            [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ]
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(PricetagCategory $category): JsonResponse
    {
        $category->loadCount('products');

        return $this->sendResponse(
            new PricetagCategoryResource($category),
            'Detail kategori berhasil diambil.'
        );
    }

    public function update(UpdatePricetagCategoryRequest $request, PricetagCategory $category): JsonResponse
    {
        $category->update($request->validated());
        $category->loadCount('products');

        return $this->sendResponse(
            new PricetagCategoryResource($category),
            "Kategori {$category->name} berhasil diperbarui."
        );
    }

    public function destroy(PricetagCategory $category): JsonResponse
    {
        if ($category->products()->exists()) {
            return $this->sendError(
                "Kategori {$category->name} masih memiliki produk aktif dan tidak dapat dihapus.",
                [],
                422
            );
        }

        $name = $category->name;
        $category->delete();

        return $this->sendResponse(null, "Kategori {$name} berhasil dihapus.");
    }
}
