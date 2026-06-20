<?php

namespace App\Http\Controllers\Api;

use App\Models\Core\User;
use App\Services\Fonnte\FonnteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class OtpPasswordController extends BaseApiController
{
    /**
     * Request OTP via WhatsApp.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function requestOtp(Request $request): JsonResponse
    {
        $request->validate([
            'login' => 'required|string',
        ], [
            'login.required' => 'Masukkan email atau username.',
        ]);

        $login = $request->input('login');

        // Find user by email or username
        $user = User::where('email', $login)
            ->orWhere('username', $login)
            ->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'login' => 'Akun dengan email/username tersebut tidak ditemukan.',
            ]);
        }

        if (empty($user->whatsapp_number)) {
            throw ValidationException::withMessages([
                'login' => 'Akun ini tidak memiliki nomor WhatsApp. Hubungi admin untuk reset password.',
            ]);
        }

        // Generate 6-digit OTP
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store OTP in password_reset_tokens table
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
            ."Jangan bagikan kode ini kepada siapapun.";

        $fonnte->send($user->whatsapp_number, $message);

        // Mask phone number for display
        $phone = $user->whatsapp_number;
        $maskedPhone = substr($phone, 0, 4) . '****' . substr($phone, -4);

        // Store user email in session for subsequent steps
        $request->session()->put('password_reset_email', $user->email);
        $request->session()->forget('password_reset_verified');

        return $this->sendResponse([
            'masked_phone' => $maskedPhone,
        ], 'Kode OTP berhasil dikirim ke WhatsApp Anda.');
    }

    /**
     * Verify OTP code.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'otp' => 'required|string|size:6',
        ], [
            'otp.required' => 'Masukkan kode OTP.',
            'otp.size' => 'Kode OTP harus 6 digit.',
        ]);

        $email = $request->session()->get('password_reset_email');

        if (!$email) {
            return $this->sendError('Sesi kedaluwarsa. Silakan ulangi dari awal.', [], 400);
        }

        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$record) {
            throw ValidationException::withMessages([
                'otp' => 'Kode OTP tidak valid atau sudah digunakan.',
            ]);
        }

        // Check expiry (15 minutes)
        if (now()->diffInMinutes($record->created_at) > 15) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            $request->session()->forget('password_reset_email');
            return $this->sendError('Kode OTP sudah kedaluwarsa. Silakan kirim ulang.', [], 400);
        }

        // Verify OTP hash
        if (!Hash::check($request->input('otp'), $record->token)) {
            throw ValidationException::withMessages([
                'otp' => 'Kode OTP salah. Periksa kembali.',
            ]);
        }

        // Store verification status in session
        $request->session()->put('password_reset_verified', true);

        return $this->sendResponse(null, 'Kode OTP berhasil diverifikasi.');
    }

    /**
     * Reset password to a new value.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $email = $request->session()->get('password_reset_email');
        $verified = $request->session()->get('password_reset_verified');

        if (!$email || !$verified) {
            return $this->sendError('Sesi tidak valid atau kedaluwarsa. Silakan ulangi dari awal.', [], 400);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return $this->sendError('Akun tidak ditemukan.', [], 404);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->input('password')),
        ]);

        // Cleanup reset tokens and session
        DB::table('password_reset_tokens')->where('email', $email)->delete();
        $request->session()->forget(['password_reset_email', 'password_reset_verified']);

        // Log activity
        activity('auth')
            ->performedOn($user)
            ->withProperties(['ip' => $request->ip()])
            ->log('[CORE] Password reset via WhatsApp OTP: ' . $user->email);

        return $this->sendResponse(null, 'Password berhasil direset. Silakan masuk dengan password baru.');
    }
}
