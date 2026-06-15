@section('title', 'Masuk')

<x-guest-layout>
    <div class="mb-6">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Login your account
        </h1>
        <p class="text-gray-500 text-xs">You can login using your email or username.</p>
    </div>

    <form method="POST" action="{{ route('login') }}" class="space-y-4">
        @csrf

        <!-- Email / Username -->
        <div>
            <label for="login" class="block mb-2 text-sm font-medium text-gray-900">
                Email atau Username
            </label>
            <input type="text" name="login" id="login"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Email atau username" value="{{ old('login') }}" required autofocus>
            <x-input-error :messages="$errors->get('login')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
                Password
            </label>
            <input type="password" name="password" id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Password" required>
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between">
            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input id="remember" name="remember" type="checkbox"
                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                        {{ old('remember') ? 'checked' : '' }}>
                </div>
                <div class="ml-3 text-sm">
                    <label for="remember" class="text-gray-500">Ingat saya</label>
                </div>
            </div>
            @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}" class="text-sm font-medium text-blue-600 hover:underline">
                    Lupa password?
                </a>
            @endif
        </div>

        <!-- Submit -->
        <button type="submit"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors duration-200">
            Masuk
        </button>

        <!-- Register Link -->
        <p class="text-sm font-light text-gray-500">
            Belum punya akun?
            <a href="{{ route('register') }}" class="font-medium text-blue-600 hover:underline">Daftar Akun</a>
        </p>
    </form>
</x-guest-layout>
