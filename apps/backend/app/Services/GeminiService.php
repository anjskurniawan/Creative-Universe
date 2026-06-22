<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;

    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key') ?? '';
    }

    /**
     * Generate content response using Google Gemini API
     *
     * @throws Exception
     */
    public function generateResponse(string $message, string $agentType, array $history = []): string
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API Key is not set in environment configurations.');
            throw new Exception('API Key Google Gemini belum dikonfigurasi pada server backend.');
        }

        $systemInstruction = $this->getSystemInstruction($agentType);

        // Format history according to Gemini content structure
        $contents = [];
        foreach ($history as $chat) {
            if (! isset($chat['role']) || ! isset($chat['content'])) {
                continue;
            }
            $contents[] = [
                'role' => $chat['role'] === 'user' ? 'user' : 'model',
                'parts' => [
                    ['text' => $chat['content']],
                ],
            ];
        }

        // Add current user prompt
        $contents[] = [
            'role' => 'user',
            'parts' => [
                ['text' => $message],
            ],
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 2048,
                ],
            ]);

            if ($response->failed()) {
                $errorMsg = $response->json('error.message') ?? 'Terjadi kesalahan tidak diketahui saat menghubungi API Gemini.';
                Log::error('Gemini API request failed', [
                    'status' => $response->status(),
                    'error' => $response->body(),
                ]);
                throw new Exception("Google Gemini API Error: {$errorMsg}");
            }

            // Extract text from response
            $candidates = $response->json('candidates');
            if (empty($candidates) || ! isset($candidates[0]['content']['parts'][0]['text'])) {
                Log::warning('Gemini API returned an empty structure or candidates', [
                    'response' => $response->json(),
                ]);
                throw new Exception('Google Gemini API tidak mengembalikan konten jawaban yang valid.');
            }

            return $candidates[0]['content']['parts'][0]['text'];

        } catch (Exception $e) {
            Log::error('GeminiService exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Get system instruction template based on Agent Type
     */
    protected function getSystemInstruction(string $agentType): string
    {
        switch ($agentType) {
            case 'odds-brief-analyzer':
                return 'Kamu adalah asisten AI Creative Director profesional untuk Creative Universe. Tugas utama kamu adalah menganalisis Brief Desain yang diberikan. Berikan ringkasan singkat tentang apa yang diminta, lalu berikan 1-3 saran spesifik untuk desainer tentang gaya visual, angle yang menarik, atau komposisi yang cocok untuk brief ini, khusus untuk produk aksesoris gadget JETE. Gunakan Bahasa Indonesia profesional dan format markdown yang rapi.';

            case 'storyboard':
                return 'Kamu adalah asisten AI storyboard video profesional untuk Creative Universe. Tugas utama kamu adalah merancang storyboard visual dan audio yang terstruktur, kreatif, dan siap produksi untuk video pendek/panjang (seperti TikTok, Reels, atau YouTube) terutama produk aksesoris gadget premium JETE (TWS, Headset, Charger, Powerbank, dll.). Gunakan Bahasa Indonesia yang kreatif dan format markdown yang rapi (seperti pembagian Scene, Detik, Visual, Audio, dan On-Screen Text).';

            case 'thumbnail':
                return 'Kamu adalah asisten AI perancang konsep thumbnail YouTube profesional untuk Creative Universe. Berikan rekomendasi konsep visual utama, elemen latar belakang, gaya teks headline pendukung (copywriting headline, font tebal, warna kontras), komposisi warna dominan, dan trik visual untuk meningkatkan Click-Through Rate (CTR) produk aksesoris gadget JETE. Gunakan Bahasa Indonesia dan format markdown yang rapi.';

            case 'copywriting':
            default:
                return 'Kamu adalah asisten AI copywriter profesional untuk Creative Universe. Tulis copywriting promosi iklan kreatif untuk produk aksesoris gadget JETE menggunakan formula pemasaran terbukti seperti AIDA (Attention, Interest, Desire, Action) atau PAS (Problem, Agitate, Solution). Sesuaikan gaya bahasa agar menarik, persuasif, dan relevan dengan target pasar di Indonesia. Gunakan format markdown yang rapi.';
        }
    }
}
