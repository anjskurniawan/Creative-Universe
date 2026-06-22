<?php

namespace App\Http\Controllers\Api;

use App\Services\GeminiService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AIAgentController extends BaseApiController
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Handle AI chat request to generate response using Gemini Service
     */
    public function chat(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:10000',
            'agent_type' => 'required|string|in:storyboard,thumbnail,copywriting',
            'history' => 'nullable|array',
            'history.*.role' => 'required|string|in:user,assistant',
            'history.*.content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validasi gagal.', $validator->errors()->toArray(), 422);
        }

        $message = $request->input('message');
        $agentType = $request->input('agent_type');
        $history = $request->input('history', []);

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
