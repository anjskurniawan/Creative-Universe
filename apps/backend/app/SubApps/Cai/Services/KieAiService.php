<?php

namespace App\SubApps\Cai\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class KieAiService
{
    /** @param array<int, array{role: string, content: string}> $history */
    /** @return array{content: string, image_url?: string} */
    public function generateResponse(string $message, array $history = [], array $parameters = [], ?string $requestedModel = null): array
    {
        $apiKey = (string) config('services.kie_ai.key');
        $model = $requestedModel ?: (string) config('services.kie_ai.model');
        $baseUrl = rtrim((string) config("services.kie_ai.model_base_urls.{$model}", config('services.kie_ai.base_url')), '/');

        if ($apiKey === '' || $baseUrl === '' || $model === '') {
            throw new RuntimeException('Creative AI belum dikonfigurasi pada server backend.');
        }

        try {
            if ($model === 'z-image') {
                $taskResponse = Http::acceptJson()->withToken($apiKey)->timeout(60)->post('https://api.kie.ai/api/v1/jobs/createTask', [
                    'model' => 'z-image',
                    'input' => ['prompt' => $message, 'aspect_ratio' => $parameters['aspect_ratio'] ?? '1:1', 'nsfw_checker' => true],
                ]);
                if ($taskResponse->failed() || $taskResponse->json('code') !== 200) {
                    throw new RuntimeException('Z-Image gagal membuat task generate image.');
                }
                $taskId = $taskResponse->json('data.taskId');
                $imageUrl = null;
                for ($attempt = 0; $attempt < 30; $attempt++) {
                    usleep(2_000_000);
                    $statusResponse = Http::acceptJson()->withToken($apiKey)->timeout(30)->get('https://api.kie.ai/api/v1/jobs/recordInfo', ['taskId' => $taskId]);
                    $state = $statusResponse->json('data.state');
                    if ($state === 'success') {
                        $resultJson = json_decode((string) $statusResponse->json('data.resultJson'), true);
                        $imageUrl = $resultJson['resultUrls'][0] ?? null;
                        break;
                    }
                    if ($state === 'fail') {
                        throw new RuntimeException('Z-Image gagal menghasilkan image.');
                    }
                }
                if (! is_string($imageUrl) || $imageUrl === '') {
                    throw new RuntimeException('Z-Image belum selesai menghasilkan image.');
                }
                return ['content' => 'Image berhasil dibuat.', 'image_url' => $imageUrl];
            }

            $payload = $model === 'grok-4-5'
                ? [
                    'model' => $model,
                    'stream' => false,
                    'input' => [
                        ...array_map(fn (array $item): array => [
                            'role' => $item['role'],
                            'content' => [[
                                'type' => $item['role'] === 'user' ? 'input_text' : 'output_text',
                                'text' => $item['content'],
                            ]],
                        ], $history),
                        [
                            'role' => 'user',
                            'content' => [[
                                'type' => 'input_text',
                                'text' => $message,
                            ]],
                        ],
                    ],
                ]
                : [
                    'model' => $model,
                    'messages' => [...$history, ['role' => 'user', 'content' => $message]],
                    'temperature' => 0.7,
                    'max_tokens' => 2048,
                    ...$parameters,
                ];

            $response = Http::acceptJson()
                ->withToken($apiKey)
                ->timeout(60)
                ->post($model === 'grok-4-3' ? "{$baseUrl}/responses" : "{$baseUrl}/chat/completions", $payload);
        } catch (ConnectionException $exception) {
            Log::error('Kie.ai Creative AI connection failed', ['message' => $exception->getMessage()]);
            throw new RuntimeException('Creative AI sedang tidak dapat dihubungi. Silakan coba lagi.');
        }

        if ($response->failed()) {
            Log::error('Kie.ai Creative AI request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new RuntimeException('Creative AI gagal memproses permintaan. Silakan coba lagi.');
        }

        $content = $model === 'grok-4-5'
            ? ($response->json('output_text') ?? $response->json('output.1.content.0.text'))
            : $response->json('choices.0.message.content');
        if (! is_string($content) || trim($content) === '') {
            throw new RuntimeException('Creative AI tidak mengembalikan jawaban yang valid.');
        }

        return ['content' => $content];
    }
}
