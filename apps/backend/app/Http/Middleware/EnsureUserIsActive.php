<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware EnsureUserIsActive
 * SRD v6.2 Seksi 8.3
 *
 * User yang sudah login namun is_active = false
 * diredirect ke /pending, bukan ke halaman login.
 */
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && ! auth()->user()->is_active) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun Anda belum aktif atau sedang ditangguhkan.',
                ], 403);
            }
            return redirect()->route('pending');
        }

        return $next($request);
    }
}
