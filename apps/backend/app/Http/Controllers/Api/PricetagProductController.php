<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\StorePricetagProductRequest;
use App\Http\Requests\Api\UpdatePricetagProductRequest;
use App\Http\Resources\PricetagProductResource;
use App\Models\Pricetag\PricetagProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricetagProductController extends BaseApiController
{
    public function store(StorePricetagProductRequest $request): JsonResponse
    {
        $product = PricetagProduct::create($request->validated());
        $product->load(['category', 'assetLinks']);

        return $this->sendResponse(
            new PricetagProductResource($product),
            "Produk {$product->name} berhasil dibuat.",
            201
        );
    }

    public function index(Request $request): JsonResponse
    {
        $query = PricetagProduct::query()->with(['category', 'assetLinks']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function (Builder $builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('variant_name', 'like', "%{$search}%");
            });
        }

        $readyLabel = 'Google Drive View Link';
        if ($request->input('status') === 'ready') {
            $query->whereHas('assetLinks', fn (Builder $builder) => $builder->where('label', $readyLabel));
        } elseif ($request->input('status') === 'not_ready') {
            $query->whereDoesntHave('assetLinks', fn (Builder $builder) => $builder->where('label', $readyLabel));
        }

        $sortBy = in_array($request->input('sort_by'), ['id', 'name', 'variant_name', 'normal_price', 'discount_price', 'created_at', 'updated_at'], true)
            ? (string) $request->input('sort_by')
            : 'created_at';
        $sortOrder = strtolower((string) $request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $perPage = min(max($request->integer('per_page', 12), 1), 100);

        $products = $query->orderBy($sortBy, $sortOrder)->paginate($perPage);

        return $this->sendResponse(
            PricetagProductResource::collection($products->items()),
            'Daftar produk pricetag berhasil diambil.',
            200,
            [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        );
    }

    public function show(PricetagProduct $product): JsonResponse
    {
        $product->load(['category', 'assetLinks']);

        return $this->sendResponse(
            new PricetagProductResource($product),
            'Detail produk pricetag berhasil diambil.'
        );
    }

    public function update(UpdatePricetagProductRequest $request, PricetagProduct $product): JsonResponse
    {
        $product->update($request->validated());
        $product->load(['category', 'assetLinks']);

        return $this->sendResponse(
            new PricetagProductResource($product),
            "Produk {$product->name} berhasil diperbarui."
        );
    }

    public function destroy(PricetagProduct $product): JsonResponse
    {
        $name = $product->name;
        $product->delete();

        return $this->sendResponse(null, "Produk {$name} berhasil dihapus.");
    }
}
