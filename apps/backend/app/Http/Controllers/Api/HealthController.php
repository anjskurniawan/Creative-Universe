<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;

class HealthController extends BaseApiController
{
    /**
     * Return backend health status.
     */
    public function index(): JsonResponse
    {
        return $this->sendResponse([
            'status' => 'up',
            'environment' => config('app.env'),
            'version' => '1.0.0',
        ], 'Backend service is healthy.');
    }
}
