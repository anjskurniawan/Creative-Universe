<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware EnsureUserCanAccessApp
 * SRD v6.2 Seksi 3.3
 *
 * Membaca permission access-[app-slug] dari Spatie.
 * Mencegah user mengakses Sub-App yang tidak berhak.
 */
class EnsureUserCanAccessApp
{
    public function handle(Request $request, Closure $next, string $app): Response
    {
        if (!auth()->user()->can('access-' . $app)) {
            abort(403, 'Kamu tidak memiliki akses ke aplikasi ini.');
        }

        return $next($request);
    }
}
