@php
    $hasRoleSettings = $user->can('run-artisan') || $user->can('approve-users') || $user->can('access-pricetag');
    $isUpdated = session('status') === 'role-settings-updated';
@endphp

@if($hasRoleSettings)
<section class="space-y-4">
    <header>
        <h2 class="text-lg font-semibold text-cu-ink">
            {{ __('Pengaturan Khusus Peran') }}
        </h2>
        <p class="mt-1 text-sm text-cu-muted">
            {{ __('Konfigurasi opsi spesifik berdasarkan hak akses akun Anda di sistem.') }}
        </p>
    </header>

    @if($isUpdated)
        <div class="mt-2">
            <x-app-alert type="success">
                Pengaturan peran berhasil disimpan.
            </x-app-alert>
        </div>
    @endif

    <form method="post" action="{{ route('profile.role-settings.update') }}" class="space-y-4">
        @csrf

        <!-- ========================================== -->
        <!-- SUPERADMIN SETTINGS PANEL                  -->
        <!-- ========================================== -->
        @can('run-artisan')
            <div x-data="{ expanded: false }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
                <button type="button" @click="expanded = !expanded" 
                    class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                    <div>
                        <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                            <x-material-icon class="text-cu-danger" size="sm" />
                            Konfigurasi Sistem (Superadmin)
                        </h3>
                        <p class="text-xs text-cu-muted mt-0.5">Mode pemeliharaan, debug log, dan kunci integrasi API pihak ketiga.</p>
                    </div>
                    <x-material-icon class="transition-transform duration-200" 
                        ::class="expanded ? 'rotate-180' : ''" 
                        class="cu-icon-expand-more" size="sm" />
                </button>
                
                <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <x-input-label for="maintenance-mode" :value="__('Mode Pemeliharaan (Maintenance)')" />
                            <select id="maintenance-mode" name="settings[maintenance_mode]" class="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm">
                                <option value="0" {{ $user->getSetting('maintenance_mode') == '0' ? 'selected' : '' }}>Nonaktif (Aktif Normal)</option>
                                <option value="1" {{ $user->getSetting('maintenance_mode') == '1' ? 'selected' : '' }}>Aktif (Pemeliharaan)</option>
                            </select>
                        </div>

                        <div>
                            <x-input-label for="global-debug-mode" :value="__('Pemberitahuan Debug')" />
                            <select id="global-debug-mode" name="settings[global_debug_mode]" class="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm">
                                <option value="0" {{ $user->getSetting('global_debug_mode') == '0' ? 'selected' : '' }}>Matikan Peringatan Debug</option>
                                <option value="1" {{ $user->getSetting('global_debug_mode') == '1' ? 'selected' : '' }}>Tampilkan Peringatan Debug</option>
                            </select>
                        </div>
                    </div>

                    <!-- Google Apps Script & Integration Keys -->
                    <div class="space-y-3 pt-2">
                        <div>
                            <x-input-label for="google-script-url" :value="__('Google Apps Script Pricetag URL')" />
                            <x-text-input id="google-script-url" name="settings[google_apps_script_url]" type="text" class="mt-1 block w-full bg-cu-surface text-xs" :value="$user->getSetting('google_apps_script_url', env('GOOGLE_APPS_SCRIPT_PRICETAG_URL'))" />
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <x-input-label for="fonnte-token" :value="__('Fonnte API Token (WA)')" />
                                <x-text-input id="fonnte-token" name="settings[fonnte_token]" type="password" class="mt-1 block w-full bg-cu-surface text-xs" :value="$user->getSetting('fonnte_token', env('FONNTE_TOKEN'))" />
                            </div>
                            <div>
                                <x-input-label for="fonnte-sender" :value="__('Fonnte Sender (Nomor WA)')" />
                                <x-text-input id="fonnte-sender" name="settings[fonnte_sender]" type="text" class="mt-1 block w-full bg-cu-surface text-xs" :value="$user->getSetting('fonnte_sender', env('FONNTE_SENDER'))" placeholder="628..." />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                            <div>
                                <x-input-label for="pusher-id" :value="__('Pusher App ID')" />
                                <x-text-input id="pusher-id" name="settings[pusher_app_id]" type="text" class="mt-1 block w-full bg-cu-surface text-xs" :value="$user->getSetting('pusher_app_id', env('PUSHER_APP_ID'))" />
                            </div>
                            <div>
                                <x-input-label for="pusher-key" :value="__('Pusher App Key')" />
                                <x-text-input id="pusher-key" name="settings[pusher_app_key]" type="text" class="mt-1 block w-full bg-cu-surface text-xs" :value="$user->getSetting('pusher_app_key', env('PUSHER_APP_KEY'))" />
                            </div>
                            <div>
                                <x-input-label for="pusher-secret" :value="__('Pusher Secret')" />
                                <x-text-input id="pusher-secret" name="settings[pusher_app_secret]" type="password" class="mt-1 block w-full bg-cu-surface text-xs" :value="$user->getSetting('pusher_app_secret', env('PUSHER_APP_SECRET'))" />
                            </div>
                            <div>
                                <x-input-label for="pusher-cluster" :value="__('Pusher Cluster')" />
                                <x-text-input id="pusher-cluster" name="settings[pusher_app_cluster]" type="text" class="mt-1 block w-full bg-cu-surface text-xs" :value="$user->getSetting('pusher_app_cluster', env('PUSHER_APP_CLUSTER'))" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endcan

        <!-- ========================================== -->
        <!-- MANAJER SETTINGS PANEL                     -->
        <!-- ========================================== -->
        @can('approve-users')
            <div x-data="{ expanded: false }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
                <button type="button" @click="expanded = !expanded" 
                    class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                    <div>
                        <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                            <x-material-icon class="text-cu-info" size="sm" />
                            Manajemen Alur Kerja (Manajer)
                        </h3>
                        <p class="text-xs text-cu-muted mt-0.5">Notifikasi pendaftaran baru dan limit cetak pricetag divisi.</p>
                    </div>
                    <x-material-icon class="transition-transform duration-200" 
                        ::class="expanded ? 'rotate-180' : ''" 
                        class="cu-icon-expand-more" size="sm" />
                </button>
                
                <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <x-input-label for="notify-new-reg" :value="__('Notifikasi Pendaftaran Baru')" />
                            <select id="notify-new-reg" name="settings[notify_new_registration]" class="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm">
                                <option value="1" {{ $user->getSetting('notify_new_registration', '1') == '1' ? 'selected' : '' }}>Kirim WA ketika user mendaftar</option>
                                <option value="0" {{ $user->getSetting('notify_new_registration') == '0' ? 'selected' : '' }}>Jangan kirim notifikasi</option>
                            </select>
                        </div>

                        <div>
                            <x-input-label for="expiry-days" :value="__('Default Kadaluarsa Batch (Hari)')" />
                            <x-text-input id="expiry-days" name="settings[default_pricetag_expiry_days]" type="number" class="mt-1 block w-full bg-cu-surface" :value="$user->getSetting('default_pricetag_expiry_days', 30)" min="1" max="365" />
                        </div>
                    </div>

                    <div>
                        <x-input-label for="max-prints" :value="__('Maksimum Baris per Batch Cetak')" />
                        <x-text-input id="max-prints" name="settings[max_prints_per_batch]" type="number" class="mt-1 block w-full bg-cu-surface" :value="$user->getSetting('max_prints_per_batch', 100)" min="10" max="1000" />
                        <p class="mt-1 text-[10px] text-cu-muted">Mencegah server timeout ketika mencetak terlalu banyak daftar pricetag sekaligus.</p>
                    </div>
                </div>
            </div>
        @endcan

        <!-- ========================================== -->
        <!-- DESAINER SETTINGS PANEL                    -->
        <!-- ========================================== -->
        @can('access-pricetag')
            <div x-data="{ expanded: false }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
                <button type="button" @click="expanded = !expanded" 
                    class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                    <div>
                        <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                            <x-material-icon class="text-cu-success" size="sm" />
                            Preferensi Studio Pricetag (Desainer)
                        </h3>
                        <p class="text-xs text-cu-muted mt-0.5">Tata letak cetak bawaan, ukuran kertas, dan simpan checklist otomatis.</p>
                    </div>
                    <x-material-icon class="transition-transform duration-200" 
                        ::class="expanded ? 'rotate-180' : ''" 
                        class="cu-icon-expand-more" size="sm" />
                </button>
                
                <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <x-input-label for="default-layout" :value="__('Layout Desain Bawaan')" />
                            <select id="default-layout" name="settings[default_pricetag_layout]" class="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm">
                                <option value="classic" {{ $user->getSetting('default_pricetag_layout', 'classic') === 'classic' ? 'selected' : '' }}>Classic Grid (Default)</option>
                                <option value="modern" {{ $user->getSetting('default_pricetag_layout') === 'modern' ? 'selected' : '' }}>Modern Compact</option>
                                <option value="minimalist" {{ $user->getSetting('default_pricetag_layout') === 'minimalist' ? 'selected' : '' }}>Minimalist Text</option>
                            </select>
                        </div>

                        <div>
                            <x-input-label for="default-paper" :value="__('Ukuran Kertas Bawaan')" />
                            <select id="default-paper" name="settings[default_pricetag_paper_size]" class="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm">
                                <option value="A4" {{ $user->getSetting('default_pricetag_paper_size', 'A4') === 'A4' ? 'selected' : '' }}>A4 Standard (Grid)</option>
                                <option value="A3" {{ $user->getSetting('default_pricetag_paper_size') === 'A3' ? 'selected' : '' }}>A3 Large Layout</option>
                                <option value="thermal_80mm" {{ $user->getSetting('default_pricetag_paper_size') === 'thermal_80mm' ? 'selected' : '' }}>Direct Thermal 80mm</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-2">
                        <input id="auto-save-checklist" type="checkbox" name="settings[auto_save_checklist]" value="1" {{ $user->getSetting('auto_save_checklist') == '1' ? 'checked' : '' }} class="rounded border-cu-line text-cu-ink focus:ring-cu-border-hover bg-cu-surface" />
                        <x-input-label for="auto-save-checklist" :value="__('Simpan otomatis status checklist pencarian')" class="!mb-0" />
                    </div>
                </div>
            </div>
        @endcan

        <!-- Save button -->
        <div class="flex items-center gap-4 pt-2">
            <x-primary-button>{{ __('Simpan Pengaturan Peran') }}</x-primary-button>
        </div>
    </form>
</section>
@endif
