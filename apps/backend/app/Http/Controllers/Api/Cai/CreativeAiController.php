<?php

namespace App\Http\Controllers\Api\Cai;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Cai\CreativeAiChatRequest;
use App\SubApps\Cai\Services\GroqService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class CreativeAiController extends BaseApiController
{
    public function __construct(private readonly GroqService $groqService) {}

    public function chat(CreativeAiChatRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $message = $validated['message'];
        $history = $validated['history'] ?? [];

        try {
            $responseContent = $this->groqService->generateResponse($message, $history);

            return $this->sendResponse([
                'content' => $responseContent,
            ], 'Respon AI berhasil dibuat.');

        } catch (RuntimeException $exception) {
            return $this->sendError($exception->getMessage(), [], 502);
        }
    }
}
