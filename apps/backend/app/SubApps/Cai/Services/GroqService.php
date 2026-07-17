<?php

namespace App\SubApps\Cai\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GroqService
{
    /** @param array<int, array{role: string, content: string}> $history */
    public function generateResponse(string $message, array $history = []): string
    {
        $apiKey = (string) config('services.groq.key');
        $baseUrl = rtrim((string) config('services.groq.base_url'), '/');
        $model = (string) config('services.groq.model');

        if ($apiKey === '' || $baseUrl === '' || $model === '') {
            throw new RuntimeException('Creative AI belum dikonfigurasi pada server backend.');
        }

        $messages = [...$history, ['role' => 'user', 'content' => $message]];

        try {
            $response = Http::acceptJson()
                ->withToken($apiKey)
                ->timeout(60)
                ->post("{$baseUrl}/chat/completions", [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_tokens' => 2048,
                ]);
        } catch (ConnectionException $exception) {
            Log::error('Groq Creative AI connection failed', ['message' => $exception->getMessage()]);
            throw new RuntimeException('Creative AI sedang tidak dapat dihubungi. Silakan coba lagi.');
        }

        if ($response->failed()) {
            Log::error('Groq Creative AI request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->status() === 403 && $response->json('error.code') === 'model_permission_blocked_project') {
                throw new RuntimeException('Model Groq belum diizinkan untuk project ini. Aktifkan model di Project Limits Groq lalu coba lagi.');
            }

            if ($response->status() === 403 && str_contains((string) $response->json('error.message'), 'blocked at the organization level')) {
                throw new RuntimeException('Groq Compound belum dapat digunakan karena model internalnya diblokir pada organisasi Groq. Aktifkan model tersebut di Organization Limits Groq lalu coba lagi.');
            }

            throw new RuntimeException('Creative AI gagal memproses permintaan. Silakan coba lagi.');
        }

        $content = $response->json('choices.0.message.content');
        if (! is_string($content) || trim($content) === '') {
            Log::warning('Groq Creative AI returned an empty response', ['response' => $response->json()]);
            throw new RuntimeException('Creative AI tidak mengembalikan jawaban yang valid.');
        }

        return $content;
    }
}
