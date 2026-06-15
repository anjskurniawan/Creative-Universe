@section('title', 'Daftar Akun')

<x-guest-layout>
    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-6">
        Daftar Akun Baru
    </h1>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <!-- Nama Lengkap -->
        <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nama Lengkap</label>
            <input type="text" name="name" id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Nama lengkap" value="{{ old('name') }}" required autofocus>
            <x-input-error :messages="$errors->get('name')" class="mt-2" />
        </div>

        <!-- Username -->
        <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input type="text" name="username" id="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Username (huruf, angka, tanda hubung)" value="{{ old('username') }}" required>
            <x-input-error :messages="$errors->get('username')" class="mt-2" />
        </div>

        <!-- Email -->
        <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input type="email" name="email" id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="email@contoh.com" value="{{ old('email') }}" required>
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Nomor WhatsApp -->
        <div>
            <label for="whatsapp_number" class="block mb-2 text-sm font-medium text-gray-900">
                Nomor WhatsApp <span class="text-gray-400 font-normal">(opsional)</span>
            </label>
            <input type="text" name="whatsapp_number" id="whatsapp_number"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="6281234567890" value="{{ old('whatsapp_number') }}">
            <p class="mt-1 text-xs text-gray-400">Format: 628xxxx (tanpa tanda +)</p>
            <x-input-error :messages="$errors->get('whatsapp_number')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" name="password" id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Minimal 8 karakter" required>
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Konfirmasi Password -->
        <div>
            <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900">Konfirmasi Password</label>
            <input type="password" name="password_confirmation" id="password_confirmation"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Ulangi password" required>
        </div>

        <!-- Catatan Registrasi -->
        <div>
            <label for="registration_note" class="block mb-2 text-sm font-medium text-gray-900">
                Catatan untuk Admin <span class="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea name="registration_note" id="registration_note" rows="2"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Contoh: Desainer tim JETE Accessories">{{ old('registration_note') }}</textarea>
            <x-input-error :messages="$errors->get('registration_note')" class="mt-2" />
        </div>

        <!-- Submit -->
        <button type="submit"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors duration-200">
            Daftar Akun
        </button>

        <!-- Login Link -->
        <p class="text-sm font-light text-gray-500">
            Sudah punya akun?
            <a href="{{ route('login') }}" class="font-medium text-blue-600 hover:underline">Masuk</a>
        </p>
    </form>
</x-guest-layout>
