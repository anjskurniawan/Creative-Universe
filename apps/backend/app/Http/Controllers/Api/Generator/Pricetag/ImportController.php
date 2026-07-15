<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Generator\Pricetag;

use App\Exceptions\InvalidPricetagImportException;
use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Generator\Pricetag\ImportPricetagCatalogRequest;
use App\SubApps\Generator\Pricetag\Services\PricetagCatalogImportService;
use Illuminate\Http\JsonResponse;

class ImportController extends BaseApiController
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
