<?php

namespace App\Http\Controllers\Api;

use App\Actions\Core\GetDashboardStatsAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends BaseApiController
{
    public function index(Request $request, GetDashboardStatsAction $action): JsonResponse
    {
        return $this->sendResponse(
            $action->handle($request->user()),
            'Statistik dashboard berhasil diambil.'
        );
    }
}
