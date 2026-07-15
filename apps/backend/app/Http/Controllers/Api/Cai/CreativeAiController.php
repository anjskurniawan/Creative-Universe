<?php

namespace App\Http\Controllers\Api\Cai;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Cai\CreativeAiChatRequest;
use App\SubApps\Cai\Services\GeminiService;
use Exception;
use Illuminate\Http\JsonResponse;

class CreativeAiController extends BaseApiController
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Handle AI chat request to generate response using Gemini Service
     */
    public function chat(CreativeAiChatRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $message = $validated['message'];
        $agentType = $validated['agent_type'];
        $history = $validated['history'] ?? [];

        try {
            $responseContent = $this->geminiService->generateResponse($message, $agentType, $history);

            return $this->sendResponse([
                'content' => $responseContent,
            ], 'Respon AI berhasil dibuat.');

        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}
