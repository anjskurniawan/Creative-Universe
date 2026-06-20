<div>
    @if($step === 1)
        <div class="mb-6 flex items-start gap-3">
            <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
                <x-material-icon class="cu-icon-lock-reset" size="md" />
            </div>
            <div>
                <h1 class="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                    Lupa Password
                </h1>
                <p class="mt-1 text-sm text-cu-muted">
                    Masukkan email atau username. Kami akan mengirimkan kode OTP ke WhatsApp-mu.
                </p>
            </div>
        </div>

        <form wire:submit="sendOtp" class="space-y-4">
            <div>
                <x-input-label for="login" value="Email atau Username" />
                <x-text-input id="login" type="text" wire:model="login" class="mt-2 w-full"
                    placeholder="Email atau username" required autofocus />
                @error('login')
                    <p class="mt-2 text-sm text-cu-danger">{{ $message }}</p>
                @enderror
            </div>

            <x-primary-button class="w-full" wire:loading.attr="disabled" wire:loading.class="opacity-50 cursor-wait">
                <span wire:loading.remove wire:target="sendOtp">Kirim Kode OTP</span>
                <span wire:loading wire:target="sendOtp">Mengirim...</span>
            </x-primary-button>

            <p class="text-sm text-cu-muted">
                Ingat passwordnya?
                <a href="{{ route('login') }}" wire:navigate class="font-medium text-cu-info hover:text-cu-info-hover">Masuk</a>
            </p>
        </form>
    @endif

    @if($step === 2)
        <div class="mb-6 flex items-start gap-3">
            <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
                <x-material-icon class="cu-icon-pin" size="md" />
            </div>
            <div>
                <h1 class="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                    Verifikasi OTP
                </h1>
                <p class="mt-1 text-sm text-cu-muted">
                    Kode OTP telah dikirim ke WhatsApp
                    <span class="font-semibold text-cu-ink">{{ $maskedPhone }}</span>.
                    Masukkan kode 6 digit di bawah.
                </p>
            </div>
        </div>

        <form wire:submit="verifyOtp" class="space-y-4">
            <div>
                <x-input-label for="otp" value="Kode OTP" />
                <x-text-input id="otp" type="text" wire:model="otp" maxlength="6" inputmode="numeric" pattern="[0-9]*"
                    class="mt-2 w-full text-center font-mono text-2xl tracking-widest"
                    placeholder="000000" required autofocus />
                @error('otp')
                    <p class="mt-2 text-sm text-cu-danger">{{ $message }}</p>
                @enderror
                <p class="mt-2 text-xs text-cu-muted">Kode berlaku 15 menit.</p>
            </div>

            <x-primary-button class="w-full" wire:loading.attr="disabled" wire:loading.class="opacity-50 cursor-wait">
                <span wire:loading.remove wire:target="verifyOtp">Verifikasi</span>
                <span wire:loading wire:target="verifyOtp">Memverifikasi...</span>
            </x-primary-button>

            <p class="text-center text-sm">
                <button type="button" wire:click="resendOtp" class="font-medium text-cu-info hover:text-cu-info-hover">
                    Kirim ulang kode
                </button>
            </p>
        </form>
    @endif

    @if($step === 3)
        <div class="mb-6 flex items-start gap-3">
            <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
                <x-material-icon class="cu-icon-password" size="md" />
            </div>
            <div>
                <h1 class="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                    Buat Password Baru
                </h1>
                <p class="mt-1 text-sm text-cu-muted">
                    OTP berhasil diverifikasi. Silakan buat password baru.
                </p>
            </div>
        </div>

        <form wire:submit="resetPassword" class="space-y-4">
            <div>
                <x-input-label for="password" value="Password Baru" />
                <x-text-input id="password" type="password" wire:model="password" class="mt-2 w-full"
                    placeholder="Minimal 8 karakter" required autofocus />
                @error('password')
                    <p class="mt-2 text-sm text-cu-danger">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <x-input-label for="password_confirmation" value="Konfirmasi Password" />
                <x-text-input id="password_confirmation" type="password" wire:model="password_confirmation" class="mt-2 w-full"
                    placeholder="Ulangi password baru" required />
            </div>

            <x-primary-button class="w-full" wire:loading.attr="disabled" wire:loading.class="opacity-50 cursor-wait">
                <span wire:loading.remove wire:target="resetPassword">Reset Password</span>
                <span wire:loading wire:target="resetPassword">Menyimpan...</span>
            </x-primary-button>
        </form>
    @endif
</div>
