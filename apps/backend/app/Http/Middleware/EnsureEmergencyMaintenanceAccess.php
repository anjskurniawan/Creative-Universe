<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmergencyMaintenanceAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/v1/auth/*') || $request->is('api/v1/health')) {
            return $next($request);
        }

        $user = $request->user();
        $isEmergencyMaintenanceActive = AppSetting::query()
            ->where('key', 'emergency_maintenance_mode')
            ->value('value') === '1';

        if ($isEmergencyMaintenanceActive && $user && ! $user->hasRole('Root')) {
            return response()->json([
                'success' => false,
                'message' => 'Aplikasi sedang menjalani maintenance darurat.',
                'code' => 'EMERGENCY_MAINTENANCE',
            ], 503);
        }

        return $next($request);
    }
}
