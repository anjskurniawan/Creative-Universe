<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // SRD v6.2 Seksi 8.3 — Middleware aliases
        $middleware->alias([
            'verified-active' => \App\Http\Middleware\EnsureUserIsActive::class,
            'app'             => \App\Http\Middleware\EnsureUserCanAccessApp::class,
            'artisan-token'   => \App\Http\Middleware\ArtisanTokenMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // SRD v6.2 Seksi 9.1 — Global Exception Handler
        $exceptions->reportable(function (Throwable $e) {
            Log::error('Unhandled Exception', [
                'message' => $e->getMessage(),
                'url'     => request()->fullUrl(),
                'user_id' => auth()->id() ?? 'guest',
                'app'     => request()->segment(1),
            ]);
        });
    })
    ->withEvents(discover: [
        __DIR__.'/../app/Listeners',
    ])
    ->create();
