<?php

use App\Http\Middleware\ArtisanTokenMiddleware;
use App\Http\Middleware\EnsureUserCanAccessApp;
use Illuminate\Auth\AccessDeniedException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api/v1',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        ['middleware' => ['web', 'auth:sanctum']]
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
        $middleware->statefulApi();

        $middleware->redirectGuestsTo(fn () => null);

        $middleware->validateCsrfTokens(except: [
            '_cmd/*',
        ]);

        $middleware->api(prepend: [
            StartSession::class,
        ]);

        // SRD v6.2 Seksi 8.3 — Middleware aliases
        $middleware->alias([
            'app' => EnsureUserCanAccessApp::class,
            'artisan-token' => ArtisanTokenMiddleware::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(function ($request, Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });

        // SRD v6.2 Seksi 9.1 — Global Exception Handler
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                // 1. ValidationException (HTTP 422)
                if ($e instanceof ValidationException) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Data yang diberikan tidak valid.',
                        'errors' => $e->errors(),
                    ], 422);
                }

                // 2. AuthenticationException (HTTP 401)
                if ($e instanceof AuthenticationException) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Silakan login terlebih dahulu.',
                    ], 401);
                }

                // 3. Authorization / Access Denied (HTTP 403)
                if ($e instanceof AccessDeniedException ||
                    $e instanceof AccessDeniedHttpException ||
                    $e instanceof UnauthorizedException) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Anda tidak memiliki hak akses untuk tindakan ini.',
                    ], 403);
                }

                // 4. Not Found (HTTP 404)
                if ($e instanceof ModelNotFoundException ||
                    $e instanceof NotFoundHttpException) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Resource tidak ditemukan.',
                    ], 404);
                }

                // 5. Token Mismatch / CSRF (HTTP 419)
                if ($e instanceof TokenMismatchException) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Sesi Anda telah kedaluwarsa. Silakan refresh halaman.',
                    ], 419);
                }

                // 6. Generic exception (HTTP 500 / other status codes)
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                // If it is 500 internal server error, mask actual message in production environment
                $message = ($statusCode === 500 && ! config('app.debug'))
                    ? 'Terjadi kesalahan internal pada server.'
                    : $e->getMessage();

                return response()->json([
                    'success' => false,
                    'message' => $message,
                ], $statusCode);
            }
        });

        $exceptions->reportable(function (Throwable $e) {
            Log::error('Unhandled Exception', [
                'message' => $e->getMessage(),
                'url' => request()->fullUrl(),
                'user_id' => auth()->id() ?? 'guest',
                'app' => request()->segment(1),
            ]);
        });
    })
    ->withEvents(discover: [
        __DIR__.'/../app/Listeners',
    ])
    ->create();
