<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Core\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Models\Core\User;
use App\Notifications\Core\UserRegisteredNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * RegisteredUserController — SRD v6.2 Seksi 8.2
 *
 * Alur: user register → is_active = false → redirect ke /pending
 * Tidak langsung login ke dashboard. Harus menunggu approval.
 */
class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     * SRD v6.2 Seksi 8.2 — Alur Registrasi
     */
    public function store(Request $request, RegisterUserAction $action): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:100|unique:users,username|alpha_dash',
            'email' => 'required|email|max:255|unique:users,email',
            'whatsapp_number' => 'nullable|string|max:20|regex:/^628[0-9]{8,12}$/',
            'password' => 'required|string|min:8|confirmed',
            'registration_note' => 'nullable|string|max:500',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan. Coba username lain.',
            'username.alpha_dash' => 'Username hanya boleh berisi huruf, angka, dan tanda hubung.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan. Coba email lain.',
            'whatsapp_number.regex' => 'Format nomor WhatsApp harus diawali 628, contoh: 6281234567890.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'whatsapp_number' => $validated['whatsapp_number'] ?? null,
            'password' => bcrypt($validated['password']),
            'registration_note' => $validated['registration_note'] ?? null,
            'is_active' => false, // WAJIB false — pending approval
        ]);

        // Notify admins
        $admins = User::permission('approve-users')->where('is_active', true)->get();
        foreach ($admins as $admin) {
            $admin->notify(new UserRegisteredNotification($user));
        }

        activity('auth')
            ->performedOn($user)
            ->withProperties(['ip' => request()->ip()])
            ->log('[CORE] New user registered — pending approval: '.$user->email);

        // Login user but they'll be redirected to /pending by EnsureUserIsActive middleware
        Auth::login($user);

        return redirect()->route('pending');
    }
}
