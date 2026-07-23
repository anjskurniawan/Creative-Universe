<?php

namespace App\Services\Fonnte;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * FonnteService — SRD v6.2 Seksi 11.2
 *
 * Seluruh komunikasi dengan Fonnte API dikapsulasi di sini.
 * Dilarang memanggil Fonnte API langsung dari Notification/Controller.
 */
class FonnteService
{
    private string $token;

    private string $sender;

    private string $baseUrl = 'https://api.fonnte.com';

    public function __construct()
    {
        $this->token = config('services.fonnte.token', '');
        $this->sender = config('services.fonnte.sender', '');
    }

    public function send(string $target, string $message): bool
    {
        if (empty($this->token)) {
            Log::warning('[CORE] Fonnte token not configured — skipping WhatsApp notification');

            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post("{$this->baseUrl}/send", [
                'target' => $target,
                'message' => $message,
                'sender' => $this->sender,
            ]);

            if (! $response->successful() || ! $response->json('status', true)) {
                Log::error('[CORE] Fonnte API error', [
                    'target' => $target,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);

                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('[CORE] Fonnte request failed', ['error' => $e->getMessage()]);

            return false;
        }
    }
}
