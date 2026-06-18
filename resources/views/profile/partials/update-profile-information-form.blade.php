<section>
    <header>
        <h2 class="text-lg font-semibold text-cu-ink">
            {{ __('Informasi Profil & Tampilan') }}
        </h2>
        <p class="mt-1 text-sm text-cu-muted">
            {{ __("Perbarui data diri, nomor WhatsApp, foto profil, dan preferensi tampilan akun Anda.") }}
        </p>
    </header>

    <form id="send-verification" method="post" action="{{ route('verification.send') }}">
        @csrf
    </form>

    <form method="post" action="{{ route('profile.update') }}" enctype="multipart/form-data" class="mt-6 space-y-4">
        @csrf
        @method('patch')

        <!-- SECTION 1: Data Diri & Kontak (Default: Collapsed, Open on error) -->
        @php
            $hasDataError = $errors->has('name') || $errors->has('email') || $errors->has('whatsapp_number') || $errors->has('username');
        @endphp
        <div x-data="{ expanded: {{ $hasDataError ? 'true' : 'false' }} }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
            <button type="button" @click="expanded = !expanded" 
                class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                <div>
                    <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                        <x-material-icon class="text-cu-muted" size="sm" />
                        Data Diri & Kontak
                    </h3>
                    <p class="text-xs text-cu-muted mt-0.5">Nama lengkap, alamat email, username, dan nomor kontak WhatsApp Anda.</p>
                </div>
                <x-material-icon class="transition-transform duration-200" 
                    ::class="expanded ? 'rotate-180' : ''" 
                    class="cu-icon-expand-more" size="sm" />
            </button>
            
            <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Name -->
                    <div>
                        <x-input-label for="name" :value="__('Nama Lengkap')" />
                        <x-text-input id="name" name="name" type="text" class="mt-1 block w-full bg-cu-surface" :value="old('name', $user->name)" required autofocus autocomplete="name" />
                        <x-input-error class="mt-2" :messages="$errors->get('name')" />
                    </div>

                    <!-- Username (Readonly) -->
                    <div>
                        <x-input-label for="username" :value="__('Username')" />
                        <x-text-input id="username" name="username" type="text" class="mt-1 block w-full bg-cu-panel-soft cursor-not-allowed text-cu-muted" :value="$user->username" readonly />
                        <p class="mt-1 text-[10px] text-cu-muted">Username tidak dapat diubah demi keamanan akun.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Email -->
                    <div>
                        <x-input-label for="email" :value="__('Email')" />
                        <x-text-input id="email" name="email" type="email" class="mt-1 block w-full bg-cu-surface" :value="old('email', $user->email)" required autocomplete="username" />
                        <x-input-error class="mt-2" :messages="$errors->get('email')" />

                        @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
                            <div>
                                <p class="mt-2 text-sm text-cu-ink">
                                    {{ __('Alamat email Anda belum terverifikasi.') }}
                                    <button form="send-verification" class="rounded-md text-sm text-cu-info underline hover:text-cu-info-hover focus:outline-none focus:ring-2 focus:ring-cu-focus">
                                        {{ __('Kirim ulang email verifikasi.') }}
                                    </button>
                                </p>
                                @if (session('status') === 'verification-link-sent')
                                    <p class="mt-2 text-sm font-medium text-cu-success">
                                        {{ __('Tautan verifikasi baru telah dikirim ke alamat email Anda.') }}
                                    </p>
                                @endif
                            </div>
                        @endif
                    </div>

                    <!-- WhatsApp Number -->
                    <div>
                        <x-input-label for="whatsapp_number" :value="__('Nomor WhatsApp')" />
                        <x-text-input id="whatsapp_number" name="whatsapp_number" type="text" class="mt-1 block w-full bg-cu-surface" :value="old('whatsapp_number', $user->whatsapp_number)" placeholder="Contoh: 628123456789" required />
                        <p class="mt-1 text-[10px] text-cu-muted">Diawali kode negara 62 (tanpa + atau spasi). Digunakan untuk notifikasi/OTP WhatsApp.</p>
                        <x-input-error class="mt-2" :messages="$errors->get('whatsapp_number')" />
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 2: Foto Profil (Default: Collapsed, Open on error) -->
        @php
            $hasAvatarError = $errors->has('avatar');
        @endphp
        <div x-data="{ expanded: {{ $hasAvatarError ? 'true' : 'false' }} }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
            <button type="button" @click="expanded = !expanded" 
                class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                <div>
                    <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                        <x-material-icon class="text-cu-muted" size="sm" />
                        Foto Profil (Avatar)
                    </h3>
                    <p class="text-xs text-cu-muted mt-0.5">Unggah atau ganti foto profil akun Anda.</p>
                </div>
                <x-material-icon class="transition-transform duration-200" 
                    ::class="expanded ? 'rotate-180' : ''" 
                    class="cu-icon-expand-more" size="sm" />
            </button>
            
            <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                    @php
                        $initials = collect(explode(' ', $user->name))->map(fn($n) => mb_substr($n, 0, 1))->take(2)->join('');
                        $avatarUrl = $user->avatar_path ? asset('storage/' . $user->avatar_path) : null;
                    @endphp
                    <div class="relative size-16 shrink-0 overflow-hidden rounded-full border border-cu-line bg-cu-panel-soft flex items-center justify-center">
                        <img id="avatar-preview" src="{{ $avatarUrl }}" class="size-full object-cover {{ $avatarUrl ? '' : 'hidden' }}" alt="Avatar">
                        <span id="avatar-initials" class="text-xl font-bold uppercase text-cu-muted {{ $avatarUrl ? 'hidden' : '' }}">{{ $initials }}</span>
                    </div>
                    <div class="flex-1">
                        <x-input-label for="avatar" :value="__('Berkas Gambar')" />
                        <input id="avatar" name="avatar" type="file" accept="image/*" class="mt-1 block w-full text-xs text-cu-muted file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cu-ink file:text-cu-surface hover:file:bg-cu-ink-hover cursor-pointer" onchange="previewImage(this)" />
                        <p class="mt-1 text-xs text-cu-muted">Maksimal 2MB. Format: JPEG, PNG, JPG, WEBP.</p>
                        <x-input-error class="mt-2" :messages="$errors->get('avatar')" />
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 3: Preferensi Tema & Tampilan (Default: Collapsed, Open on error) -->
        @php
            $hasUiError = $errors->has('settings.theme') || $errors->has('settings.navbar_variant');
        @endphp
        <div x-data="{ expanded: {{ $hasUiError ? 'true' : 'false' }} }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
            <button type="button" @click="expanded = !expanded" 
                class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                <div>
                    <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                        <x-material-icon class="text-cu-muted" size="sm" />
                        Preferensi Tema & Tampilan
                    </h3>
                    <p class="text-xs text-cu-muted mt-0.5">Atur tema gelap/terang dan gaya bilah navigasi (navbar).</p>
                </div>
                <x-material-icon class="transition-transform duration-200" 
                    ::class="expanded ? 'rotate-180' : ''" 
                    class="cu-icon-expand-more" size="sm" />
            </button>
            
            <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <x-input-label for="settings-theme" :value="__('Tema Tampilan')" />
                        <select id="settings-theme" name="settings[theme]" class="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm focus:border-cu-border-hover focus:ring-1 focus:ring-cu-border-hover">
                            <option value="system" {{ old('settings.theme', $user->getSetting('theme', 'system')) === 'system' ? 'selected' : '' }}>Sistem (Default)</option>
                            <option value="light" {{ old('settings.theme', $user->getSetting('theme')) === 'light' ? 'selected' : '' }}>Mode Terang</option>
                            <option value="dark" {{ old('settings.theme', $user->getSetting('theme')) === 'dark' ? 'selected' : '' }}>Mode Gelap</option>
                        </select>
                        <x-input-error class="mt-2" :messages="$errors->get('settings.theme')" />
                    </div>

                    <div>
                        <x-input-label for="settings-navbar" :value="__('Tampilan Navbar')" />
                        <select id="settings-navbar" name="settings[navbar_variant]" class="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm focus:border-cu-border-hover focus:ring-1 focus:ring-cu-border-hover">
                            <option value="solid" {{ old('settings.navbar_variant', $user->getSetting('navbar_variant', 'solid')) === 'solid' ? 'selected' : '' }}>Solid</option>
                            <option value="glass" {{ old('settings.navbar_variant', $user->getSetting('navbar_variant')) === 'glass' ? 'selected' : '' }}>Glassmorphism</option>
                            <option value="dark-glass" {{ old('settings.navbar_variant', $user->getSetting('navbar_variant')) === 'dark-glass' ? 'selected' : '' }}>Dark Glassmorphism</option>
                        </select>
                        <x-input-error class="mt-2" :messages="$errors->get('settings.navbar_variant')" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-4 pt-2">
            <x-primary-button>{{ __('Simpan Profil') }}</x-primary-button>

            @if (session('status') === 'profile-updated')
                <p
                    x-data="{ show: true }"
                    x-show="show"
                    x-transition
                    x-init="setTimeout(() => show = false, 2000)"
                    class="text-sm text-cu-muted"
                >{{ __('Berhasil disimpan.') }}</p>
            @endif
        </div>
    </form>
</section>

<script>
    function previewImage(input) {
        const preview = document.getElementById('avatar-preview');
        const initials = document.getElementById('avatar-initials');
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                initials.classList.add('hidden');
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
</script>
