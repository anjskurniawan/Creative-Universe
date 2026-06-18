@section('title', 'Masuk')

<x-guest-layout>
    <div class="mb-6 flex items-start gap-3">
        <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
            <x-material-icon class="cu-icon-login" size="md" />
        </div>
        <div>
            <h1 class="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                Login your account
            </h1>
            <p class="mt-1 text-sm text-cu-muted">You can login using your email or username.</p>
        </div>
    </div>

    <form method="POST" action="{{ route('login') }}" class="space-y-4">
        @csrf

        <div>
            <x-input-label for="login" value="Email atau Username" />
            <x-text-input id="login" name="login" type="text" class="mt-2 w-full"
                placeholder="Email atau username" :value="old('login')" required autofocus />
            <x-input-error :messages="$errors->get('login')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="password" value="Password" />
            <x-text-input id="password" name="password" type="password" class="mt-2 w-full"
                placeholder="Password" required />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <div class="flex items-center justify-between gap-4">
            <label for="remember" class="flex items-center gap-2 text-sm text-cu-muted">
                <input id="remember" name="remember" type="checkbox"
                    class="size-4 rounded border-cu-border text-cu-ink focus:ring-cu-ink"
                    {{ old('remember') ? 'checked' : '' }}>
                Ingat saya
            </label>

            @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}" class="text-sm font-medium text-cu-info hover:text-cu-info-hover">
                    Lupa password?
                </a>
            @endif
        </div>

        <x-primary-button class="w-full">
            <span class="flex h-full items-center justify-center leading-none">
                <x-material-icon class="cu-icon-login" />
            </span>
            <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Masuk</span>
        </x-primary-button>

        <p class="text-sm text-cu-muted">
            Belum punya akun?
            <a href="{{ route('register') }}" class="font-medium text-cu-info hover:text-cu-info-hover">Daftar Akun</a>
        </p>
    </form>
</x-guest-layout>
