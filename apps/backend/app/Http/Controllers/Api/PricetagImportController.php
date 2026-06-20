<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Exceptions\InvalidPricetagImportException;
use App\Http\Requests\Api\ImportPricetagCatalogRequest;
use App\Services\Pricetag\PricetagCatalogImportService;
use Illuminate\Http\JsonResponse;

class PricetagImportController extends BaseApiController
{
    public function products(
        ImportPricetagCatalogRequest $request,
        PricetagCatalogImportService $service
    ): JsonResponse {
        try {
            $summary = $service->import($request->file('file'), $request->user());
        } catch (InvalidPricetagImportException $exception) {
            return $this->sendError(
                $exception->getMessage(),
                $exception->rowErrors === [] ? [] : ['rows' => $exception->rowErrors],
                422
            );
        }

        return $this->sendResponse($summary, "Import {$summary['total']} baris katalog berhasil.");
    }
}
