<?php

namespace App\Providers;

use App\Listeners\Core\LogAuthActivity;
use App\Models\Core\AssetLink;
use App\Models\Core\Conversation;
use App\Models\Core\StoredFile;
use App\Models\Core\User;
use App\Policies\Core\AssetLinkPolicy;
use App\Policies\Core\ConversationPolicy;
use App\Policies\Core\StoredFilePolicy;
use App\Policies\CreativeReport\AssessmentPolicy;
use App\Policies\Odds\TaskPolicy;
use App\SubApps\CreativeReport\Models\Assessment;
use App\SubApps\Odds\Contracts\OddsConversationPresenter;
use App\SubApps\Odds\Contracts\OddsTaskReader;
use App\SubApps\Odds\Models\Task;
use App\SubApps\Odds\Services\DatabaseOddsTaskReader;
use App\SubApps\Odds\Services\OddsTaskConversationService;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(OddsTaskReader::class, DatabaseOddsTaskReader::class);
        $this->app->bind(OddsConversationPresenter::class, OddsTaskConversationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Assessment::class, AssessmentPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
        Gate::policy(Conversation::class, ConversationPolicy::class);
        Gate::policy(StoredFile::class, StoredFilePolicy::class);
        Gate::policy(AssetLink::class, AssetLinkPolicy::class);

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
