<?php

namespace App\Http\Requests\Auth;

use App\Models\Core\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * LoginRequest
 *
 * Login menggunakan username.
 * Rate limiting: 5 percobaan per menit.
 */
class LoginRequest extends FormRequest
{
    private const LOCAL_LOGIN_USERNAMES = ['root', 'manajer', 'spv', 'supervisor', 'designer', 'client'];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ];
    }

    /**
     * Attempt to authenticate.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $username = $this->input('username');
        $password = $this->input('password');

        if (in_array($username, self::LOCAL_LOGIN_USERNAMES, true)) {
            // Login lokal untuk akun default internal.
            if (! Auth::attempt(['username' => $username, 'password' => $password], $this->boolean('remember'))) {
                RateLimiter::hit($this->throttleKey());

                throw ValidationException::withMessages([
                    'username' => 'Username atau password salah.',
                ]);
            }
        } else {
            // Login menggunakan API Doran Group
            $apiUrl = config('app.doran_api_url');
            $apiKey = config('app.doran_api_key');

            $response = Http::post($apiUrl.'?X-API-KEY='.$apiKey, [
                'username' => $username,
                'password' => $password,
                'X-API-KEY' => $apiKey,
                'from' => 'creative',
            ]);

            if ($response->successful() && ($response->json('status') === true || $response->json('status') === 'success')) {
                // Auto-register jika user belum ada di lokal
                $user = User::where('username', $username)->first();
                if (! $user) {
                    $user = User::create([
                        'username' => $username,
                        'name' => $username,
                        'email' => $username.'@creative.doran.id', // Placeholder email
                        'password' => Hash::make(Str::random(16)), // Password acak
                        'is_onboarded' => false,
                    ]);

                    // Assign default role 'Client'
                    $user->assignRole('Client');
                }

                Auth::login($user, $this->boolean('remember'));
            } else {
                RateLimiter::hit($this->throttleKey());

                throw ValidationException::withMessages([
                    'username' => 'Username atau password salah.',
                ]);
            }
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'username' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('username')).'|'.$this->ip());
    }
}
