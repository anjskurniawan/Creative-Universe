<?php

namespace App\Providers;

use App\Listeners\LogAuthActivity;
use App\Models\Core\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
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

        // Dynamically override configurations from Root settings at runtime
        try {
            if (Schema::hasTable('users')) {
                // Fetch first Root's preferences
                $root = User::role('Root')->first();
                if ($root) {
                    if ($scriptUrl = $root->getSetting('google_apps_script_url')) {
                        config(['services.google.apps_script_pricetag_url' => $scriptUrl]);
                    }
                    if ($pusherId = $root->getSetting('pusher_app_id')) {
                        config(['broadcasting.connections.pusher.app_id' => $pusherId]);
                    }
                    if ($pusherKey = $root->getSetting('pusher_app_key')) {
                        config(['broadcasting.connections.pusher.key' => $pusherKey]);
                    }
                    if ($pusherSecret = $root->getSetting('pusher_app_secret')) {
                        config(['broadcasting.connections.pusher.secret' => $pusherSecret]);
                    }
                    if ($pusherCluster = $root->getSetting('pusher_app_cluster')) {
                        config(['broadcasting.connections.pusher.options.cluster' => $pusherCluster]);
                        config(['broadcasting.connections.pusher.options.host' => 'api-'.$pusherCluster.'.pusher.com']);
                    }
                    if ($fonnteToken = $root->getSetting('fonnte_token')) {
                        config(['services.fonnte.token' => $fonnteToken]);
                    }
                    if ($fonnteSender = $root->getSetting('fonnte_sender')) {
                        config(['services.fonnte.sender' => $fonnteSender]);
                    }
                }
            }
        } catch (\Exception $e) {
            // Silence database exceptions during setup/migrations/testing fakes
        }
    }
}
