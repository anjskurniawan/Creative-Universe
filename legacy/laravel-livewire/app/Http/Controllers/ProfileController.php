<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        $user = $request->user();

        // Fetch active sessions
        $sessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderBy('last_activity', 'desc')
            ->get();

        // Fetch user's personal activity logs
        $activities = \Spatie\Activitylog\Models\Activity::where('causer_id', $user->id)
            ->latest()
            ->take(10)
            ->get();

        return view('profile.edit', [
            'user' => $user,
            'sessions' => $sessions,
            'activities' => $activities,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        $data = $request->safe()->except(['avatar', 'settings']);

        // Handle Avatar File Upload
        if ($request->hasFile('avatar')) {
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar_path = $path;
        }

        // Handle UI settings merge
        if ($request->has('settings')) {
            $currentSettings = $user->settings ?? [];
            $user->settings = array_merge($currentSettings, $request->input('settings'));
        }

        $user->fill($data);
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Revoke specific active session (Logout other device).
     */
    public function revokeSession(Request $request, string $sessionId): RedirectResponse
    {
        DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', $request->user()->id)
            ->delete();

        return Redirect::route('profile.edit')->with('success', 'Perangkat berhasil dinonaktifkan dari sesi.');
    }

    /**
     * Update role-specific preferences.
     */
    public function updateRoleSettings(Request $request): RedirectResponse
    {
        $user = $request->user();
        $inputSettings = $request->input('settings', []);
        $currentSettings = $user->settings ?? [];

        $filteredSettings = [];

        // 1. Superadmin specific settings configuration
        if ($user->can('run-artisan')) {
            $allowedKeys = [
                'maintenance_mode',
                'global_debug_mode',
                'google_apps_script_url',
                'pusher_app_id',
                'pusher_app_key',
                'pusher_app_secret',
                'pusher_app_cluster',
                'fonnte_token',
                'fonnte_sender',
            ];
            foreach ($allowedKeys as $key) {
                if (array_key_exists($key, $inputSettings)) {
                    $filteredSettings[$key] = $inputSettings[$key];
                }
            }
        }

        // 2. Manajer specific settings configuration
        if ($user->can('approve-users')) {
            $allowedKeys = [
                'notify_new_registration',
                'default_pricetag_expiry_days',
                'max_prints_per_batch',
            ];
            foreach ($allowedKeys as $key) {
                if (array_key_exists($key, $inputSettings)) {
                    $filteredSettings[$key] = $inputSettings[$key];
                }
            }
        }

        // 3. Designer specific settings configuration
        if ($user->can('access-pricetag')) {
            $allowedKeys = [
                'default_pricetag_layout',
                'default_pricetag_paper_size',
                'auto_save_checklist',
            ];
            foreach ($allowedKeys as $key) {
                if (array_key_exists($key, $inputSettings)) {
                    $filteredSettings[$key] = $inputSettings[$key];
                }
            }
        }

        $user->settings = array_merge($currentSettings, $filteredSettings);
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'role-settings-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Hanya role Root yang diizinkan untuk menghapus akun
        if (! $user->hasRole('Root')) {
            abort(403, 'Hanya pengguna dengan peran Root yang dapat menghapus akun.');
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
