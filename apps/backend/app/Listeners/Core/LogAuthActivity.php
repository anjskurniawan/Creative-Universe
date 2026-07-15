<?php

namespace App\Listeners\Core;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;

/**
 * LogAuthActivity — SRD v6.2 Seksi 11.8
 *
 * Audit Login & Logout via Laravel Auth Event Listener.
 */
class LogAuthActivity
{
    public function handleLogin(Login $event): void
    {
        activity('auth')
            ->causedBy($event->user)
            ->withProperties([
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'sub_app' => 'core',
            ])
            ->log('User login');
    }

    public function handleLogout(Logout $event): void
    {
        if ($event->user) {
            activity('auth')
                ->causedBy($event->user)
                ->withProperties([
                    'ip' => request()->ip(),
                    'sub_app' => 'core',
                ])
                ->log('User logout');
        }
    }
}
