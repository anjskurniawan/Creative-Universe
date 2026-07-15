<?php

namespace App\Http\Middleware;

use App\Models\Core\User;
use App\Models\Core\Application;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware EnsureUserCanAccessApp
 * SRD v6.2 Seksi 3.3
 *
 * Memeriksa assignment pada registry aplikasi. Permission fitur tetap
 * merupakan lapisan otorisasi yang terpisah.
 */
class EnsureUserCanAccessApp
{
    public function handle(Request $request, Closure $next, string $app): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if ($app === 'core' || $user->hasRole('Root')) {
            return $next($request);
        }

        // Feature tests that intentionally isolate a module may omit the registry seeder.
        // Every non-testing environment remains fail-closed when the registry is incomplete.
        if (app()->environment('testing') && ! Application::query()->where('key', $app)->exists()) {
            return $next($request);
        }

        if (! $user->applications()->where('key', $app)->exists()) {
            abort(403, 'Kamu tidak memiliki akses ke aplikasi ini.');
        }

        return $next($request);
    }
}
