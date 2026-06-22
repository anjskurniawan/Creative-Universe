<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Controller;
use App\Models\Odds\DesignCategory;
use Illuminate\Http\JsonResponse;

class DesignCategoryController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = DesignCategory::where('is_active', true)->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }
}
