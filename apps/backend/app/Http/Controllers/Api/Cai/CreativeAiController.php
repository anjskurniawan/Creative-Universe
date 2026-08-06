<?php

namespace App\Http\Controllers\Api\Cai;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Cai\CreativeAiChatRequest;
use App\SubApps\Cai\Services\KieAiService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class CreativeAiController extends BaseApiController
{
    public function __construct(private readonly KieAiService $kieAiService) {}

    public function chat(CreativeAiChatRequest $request): JsonResponse
    {
            $validated = $request->validated();
            $message = $validated['message'];
            $history = $validated['history'] ?? [];
            $model = $validated['model'] ?? null;
        $parameters = array_intersect_key($validated, array_flip([
            'memory', 'structured_outputs', 'function_calling', 'web_access', 'reasoning_effort', 'stream_response',
            'aspect_ratio',
        ]));

        try {
            $response = $this->kieAiService->generateResponse($message, $history, $parameters, $model);

            return $this->sendResponse([
                'content' => $response['content'],
                'image_url' => $response['image_url'] ?? null,
            ], 'Respon AI berhasil dibuat.');

        } catch (RuntimeException $exception) {
            return $this->sendError($exception->getMessage(), [], 502);
        }
    }
}
