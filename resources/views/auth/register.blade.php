@section('title', 'Daftar Akun')

<x-guest-layout>
    <div class="mb-6 flex items-start gap-3">
        <div class="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
            <x-material-icon name="person_add" size="md" />
        </div>
        <div>
            <h1 class="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                Daftar Akun Baru
            </h1>
            <p class="mt-1 text-sm text-cu-muted">Ajukan akses ke Creative Universe.</p>
        </div>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <div>
            <x-input-label for="name" value="Nama Lengkap" />
            <x-text-input id="name" name="name" type="text" class="mt-2 w-full"
                placeholder="Nama lengkap" :value="old('name')" required autofocus />
            <x-input-error :messages="$errors->get('name')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="username" value="Username" />
            <x-text-input id="username" name="username" type="text" class="mt-2 w-full"
                placeholder="Username (huruf, angka, tanda hubung)" :value="old('username')" required />
            <x-input-error :messages="$errors->get('username')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="email" value="Email" />
            <x-text-input id="email" name="email" type="email" class="mt-2 w-full"
                placeholder="email@contoh.com" :value="old('email')" required />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="whatsapp_number">
                Nomor WhatsApp <span class="font-normal text-cu-muted">(opsional)</span>
            </x-input-label>
            <x-text-input id="whatsapp_number" name="whatsapp_number" type="text" class="mt-2 w-full"
                placeholder="6281234567890" :value="old('whatsapp_number')" />
            <p class="mt-1 text-xs text-cu-muted">Format: 628xxxx (tanpa tanda +)</p>
            <x-input-error :messages="$errors->get('whatsapp_number')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="password" value="Password" />
            <x-text-input id="password" name="password" type="password" class="mt-2 w-full"
                placeholder="Minimal 8 karakter" required />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="password_confirmation" value="Konfirmasi Password" />
            <x-text-input id="password_confirmation" name="password_confirmation" type="password" class="mt-2 w-full"
                placeholder="Ulangi password" required />
        </div>

        <div>
            <x-input-label for="registration_note">
                Catatan untuk Admin <span class="font-normal text-cu-muted">(opsional)</span>
            </x-input-label>
            <textarea name="registration_note" id="registration_note" rows="3"
                class="mt-2 block w-full rounded-lg border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink"
                placeholder="Contoh: Desainer tim JETE Accessories">{{ old('registration_note') }}</textarea>
            <x-input-error :messages="$errors->get('registration_note')" class="mt-2" />
        </div>

        <x-primary-button class="w-full">
            <span class="flex h-full items-center justify-center leading-none">
                <x-material-icon name="person_add" />
            </span>
            <span class="flex h-full items-center justify-center whitespace-nowrap leading-none">Daftar Akun</span>
        </x-primary-button>

        <p class="text-sm text-cu-muted">
            Sudah punya akun?
            <a href="{{ route('login') }}" class="font-medium text-cu-info hover:text-cu-info-hover">Masuk</a>
        </p>
    </form>
</x-guest-layout>
