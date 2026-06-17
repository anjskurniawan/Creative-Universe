<?php

namespace App\Livewire\Core;

use App\Models\Core\User;
use App\Services\Fonnte\FonnteService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Livewire\Component;

/**
 * ForgotPassword — Reset password via WhatsApp OTP
 *
 * Flow:
 * 1. User masukkan email/username
 * 2. Sistem kirim OTP 6 digit via WhatsApp (Fonnte)
 * 3. User masukkan OTP
 * 4. User set password baru
 */
class ForgotPassword extends Component
{
    public int $step = 1;

    // Step 1
    public string $login = '';

    // Step 2
    public string $otp = '';

    public string $maskedPhone = '';

    // Step 3
    public string $password = '';

    public string $password_confirmation = '';

    // Internal
    private ?User $targetUser = null;

    public function sendOtp(): void
    {
        $this->validate([
            'login' => 'required|string',
        ], [
            'login.required' => 'Masukkan email atau username.',
        ]);

        // Find user by email or username
        $user = User::where('email', $this->login)
            ->orWhere('username', $this->login)
            ->first();

        if (! $user) {
            $this->addError('login', 'Akun dengan email/username tersebut tidak ditemukan.');

            return;
        }

        if (empty($user->whatsapp_number)) {
            $this->addError('login', 'Akun ini tidak memiliki nomor WhatsApp. Hubungi admin untuk reset password.');

            return;
        }

        // Generate 6-digit OTP
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store OTP in password_reset_tokens table (reuse Laravel's table)
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($otpCode),
                'created_at' => now(),
            ]
        );

        // Send OTP via WhatsApp
        $fonnte = app(FonnteService::class);
        $message = "🔐 *Creative Universe — Reset Password*\n\n"
            ."Kode OTP kamu: *{$otpCode}*\n\n"
            ."Kode ini berlaku 15 menit.\n"
            .'Jangan bagikan kode ini kepada siapapun.';

        $fonnte->send($user->whatsapp_number, $message);

        // Mask phone number for display
        $phone = $user->whatsapp_number;
        $this->maskedPhone = substr($phone, 0, 4).'****'.substr($phone, -4);

        // Store user email in session for verification
        session()->put('password_reset_email', $user->email);

        $this->step = 2;
    }

    public function verifyOtp(): void
    {
        $this->validate([
            'otp' => 'required|string|size:6',
        ], [
            'otp.required' => 'Masukkan kode OTP.',
            'otp.size' => 'Kode OTP harus 6 digit.',
        ]);

        $email = session('password_reset_email');

        if (! $email) {
            $this->addError('otp', 'Sesi expired. Silakan ulangi dari awal.');
            $this->step = 1;

            return;
        }

        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (! $record) {
            $this->addError('otp', 'Kode OTP tidak valid atau sudah digunakan.');

            return;
        }

        // Check expiry (15 minutes)
        if (now()->diffInMinutes($record->created_at) > 15) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            $this->addError('otp', 'Kode OTP sudah kadaluarsa. Silakan kirim ulang.');
            $this->step = 1;

            return;
        }

        // Verify OTP hash
        if (! Hash::check($this->otp, $record->token)) {
            $this->addError('otp', 'Kode OTP salah. Periksa kembali.');

            return;
        }

        $this->step = 3;
    }

    public function resetPassword(): void
    {
        $this->validate([
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $email = session('password_reset_email');

        if (! $email) {
            session()->flash('error', 'Sesi expired. Silakan ulangi dari awal.');
            $this->step = 1;

            return;
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            session()->flash('error', 'Akun tidak ditemukan.');
            $this->step = 1;

            return;
        }

        // Update password
        $user->update([
            'password' => Hash::make($this->password),
        ]);

        // Cleanup
        DB::table('password_reset_tokens')->where('email', $email)->delete();
        session()->forget('password_reset_email');

        // Log activity
        activity('auth')
            ->performedOn($user)
            ->withProperties(['ip' => request()->ip()])
            ->log('[CORE] Password reset via WhatsApp OTP: '.$user->email);

        // Redirect to login with success message
        session()->flash('status', 'Password berhasil direset. Silakan masuk dengan password baru.');
        $this->redirect(route('login'), navigate: true);
    }

    public function resendOtp(): void
    {
        $this->step = 1;
        $this->otp = '';
    }

    public function render()
    {
        return view('livewire.core.forgot-password');
    }
}
