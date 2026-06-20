<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware ArtisanTokenMiddleware
 * SRD v6.2 Seksi 8.1
 *
 * Token autentikasi menggunakan HTTP Header X-Artisan-Token.
 * Opsional: IP whitelist via ARTISAN_ALLOWED_IPS.
 */
class ArtisanTokenMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Artisan-Token');
        $validToken = config('app.artisan_secret');

        if (! $token || ! hash_equals($validToken, $token)) {
            abort(403);
        }

        $allowedIps = array_filter(explode(',', config('app.artisan_allowed_ips', '')));
        if (! empty($allowedIps) && ! in_array($request->ip(), $allowedIps)) {
            abort(403);
        }

        return $next($request);
    }
}
