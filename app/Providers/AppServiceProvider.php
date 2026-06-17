<?php

namespace App\Providers;

use App\Listeners\LogAuthActivity;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // SRD v6.2 Seksi 11.8 — Audit Login & Logout
        Event::listen(
            Login::class,
            [LogAuthActivity::class, 'handleLogin']
        );

        Event::listen(
            Logout::class,
            [LogAuthActivity::class, 'handleLogout']
        );
    }
}
