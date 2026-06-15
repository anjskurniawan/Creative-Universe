<div>
    {{-- Step 1: Masukkan Email/Username --}}
    @if($step === 1)
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-2">
            Lupa Password
        </h1>
        <p class="text-sm text-gray-500 mb-6">
            Masukkan email atau username. Kami akan mengirimkan kode OTP ke WhatsApp-mu.
        </p>

        <form wire:submit="sendOtp" class="space-y-4">
            <div>
                <label for="login" class="block mb-2 text-sm font-medium text-gray-900">
                    Email atau Username
                </label>
                <input type="text" wire:model="login" id="login"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="Email atau username" required autofocus>
                @error('login')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <button type="submit"
                wire:loading.attr="disabled"
                wire:loading.class="opacity-50 cursor-wait"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors duration-200">
                <span wire:loading.remove wire:target="sendOtp">Kirim Kode OTP</span>
                <span wire:loading wire:target="sendOtp">Mengirim...</span>
            </button>

            <p class="text-sm font-light text-gray-500">
                Ingat passwordnya?
                <a href="{{ route('login') }}" wire:navigate class="font-medium text-blue-600 hover:underline">Masuk</a>
            </p>
        </form>
    @endif

    {{-- Step 2: Masukkan OTP --}}
    @if($step === 2)
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-2">
            Verifikasi OTP
        </h1>
        <p class="text-sm text-gray-500 mb-6">
            Kode OTP telah dikirim ke WhatsApp
            <span class="font-semibold text-gray-700">{{ $maskedPhone }}</span>.
            Masukkan kode 6 digit di bawah.
        </p>

        <form wire:submit="verifyOtp" class="space-y-4">
            <div>
                <label for="otp" class="block mb-2 text-sm font-medium text-gray-900">
                    Kode OTP
                </label>
                <input type="text" wire:model="otp" id="otp" maxlength="6" inputmode="numeric" pattern="[0-9]*"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="000000" required autofocus>
                @error('otp')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
                <p class="mt-2 text-xs text-gray-400">Kode berlaku 15 menit.</p>
            </div>

            <button type="submit"
                wire:loading.attr="disabled"
                wire:loading.class="opacity-50 cursor-wait"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors duration-200">
                <span wire:loading.remove wire:target="verifyOtp">Verifikasi</span>
                <span wire:loading wire:target="verifyOtp">Memverifikasi...</span>
            </button>

            <p class="text-sm text-center">
                <button type="button" wire:click="resendOtp" class="text-blue-600 hover:underline font-medium text-sm">
                    Kirim ulang kode
                </button>
            </p>
        </form>
    @endif

    {{-- Step 3: Set Password Baru --}}
    @if($step === 3)
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-2">
            Buat Password Baru
        </h1>
        <p class="text-sm text-gray-500 mb-6">
            OTP berhasil diverifikasi. Silakan buat password baru.
        </p>

        <form wire:submit="resetPassword" class="space-y-4">
            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
                    Password Baru
                </label>
                <input type="password" wire:model="password" id="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="Minimal 8 karakter" required autofocus>
                @error('password')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900">
                    Konfirmasi Password
                </label>
                <input type="password" wire:model="password_confirmation" id="password_confirmation"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="Ulangi password baru" required>
            </div>

            <button type="submit"
                wire:loading.attr="disabled"
                wire:loading.class="opacity-50 cursor-wait"
                class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors duration-200">
                <span wire:loading.remove wire:target="resetPassword">Reset Password</span>
                <span wire:loading wire:target="resetPassword">Menyimpan...</span>
            </button>
        </form>
    @endif
</div>
