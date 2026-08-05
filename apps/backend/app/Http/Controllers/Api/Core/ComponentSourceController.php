<?php

namespace App\Http\Controllers\Api\Core;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComponentSourceController extends BaseApiController
{
    public function show(Request $request): JsonResponse
    {
        $relativePath = str_replace('\\', '/', (string) $request->query('path', ''));
        $relativePath = ltrim($relativePath, '/');

        if ($relativePath === '' || str_contains($relativePath, '..') || !str_starts_with($relativePath, 'apps/frontend/src/')) {
            return $this->sendError('Path source component tidak valid.', [], 422);
        }

        $sourcePath = dirname(base_path(), 2) . DIRECTORY_SEPARATOR . $relativePath;
        if (!is_file($sourcePath)) {
            return $this->sendError('Source component tidak ditemukan.', [], 404);
        }

        return $this->sendResponse([
            'path' => $relativePath,
            'source' => file_get_contents($sourcePath),
            'updated_at' => filemtime($sourcePath),
        ], 'Source component berhasil diambil.');
    }
}
