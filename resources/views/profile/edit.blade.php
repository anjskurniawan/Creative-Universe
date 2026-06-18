<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-cu-ink md:text-3xl">Pengaturan Akun</h1>
                <p class="mt-1 text-sm text-cu-muted">Kelola profil, preferensi peran, sesi perangkat aktif, dan jejak aktivitas Anda.</p>
            </div>
        </div>
    </x-slot>

    @php
        $hasRoleSettings = $user->can('run-artisan') || $user->can('approve-users') || $user->can('access-pricetag');
        
        // Detect validation errors or status to open the correct tab automatically
        $defaultTab = 'profile';
        if ($errors->hasBag('userDeletion') || $errors->has('current_password') || $errors->has('password')) {
            $defaultTab = 'security';
        } elseif (session('status') === 'role-settings-updated') {
            $defaultTab = 'role_settings';
        }
    @endphp

    <div class="mt-6 flex flex-col gap-6 lg:flex-row items-start" 
        x-data="{ activeTab: '{{ $defaultTab }}' }">
        
        <!-- Sidebar Navigation Menu -->
        <div class="w-full shrink-0 lg:w-64">
            <!-- Desktop Vertical Sidebar / Mobile Horizontal Swipe Bar -->
            <nav class="flex w-full gap-1 overflow-x-auto pb-3 scrollbar-none lg:flex-col lg:gap-1.5 lg:pb-0 border-b border-cu-line lg:border-b-0 lg:border-r lg:border-cu-line/60 pr-0 lg:pr-4">
                
                <!-- Tab Button: Profile & Theme Display -->
                <button type="button" @click="activeTab = 'profile'"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2"
                    :class="activeTab === 'profile' 
                        ? 'border-cu-ink text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold' 
                        : 'border-transparent text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/30'"
                >
                    <x-material-icon class="cu-icon-person shrink-0" size="sm" />
                    Profil & Tampilan
                </button>

                <!-- Tab Button: Security & Device List -->
                <button type="button" @click="activeTab = 'security'"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2"
                    :class="activeTab === 'security' 
                        ? 'border-cu-ink text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold' 
                        : 'border-transparent text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/30'"
                >
                    <x-material-icon class="cu-icon-security shrink-0" size="sm" />
                    Keamanan & Perangkat
                </button>

                <!-- Tab Button: Role Configuration Settings -->
                @if($hasRoleSettings)
                    <button type="button" @click="activeTab = 'role_settings'"
                        class="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2"
                        :class="activeTab === 'role_settings' 
                            ? 'border-cu-ink text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold' 
                            : 'border-transparent text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/30'"
                    >
                        <x-material-icon class="cu-icon-admin-panel-settings shrink-0" size="sm" />
                        Pengaturan Peran
                    </button>
                @endif

                <!-- Tab Button: Security Activity Log -->
                <button type="button" @click="activeTab = 'activity_log'"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2"
                    :class="activeTab === 'activity_log' 
                        ? 'border-cu-ink text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold' 
                        : 'border-transparent text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/30'"
                >
                    <x-material-icon class="cu-icon-history shrink-0" size="sm" />
                    Jejak Aktivitas
                </button>
            </nav>
        </div>

        <!-- Main Content Settings Panels -->
        <div class="flex-1 w-full space-y-6">
            
            <!-- Panel: Profile & Display Preferences -->
            <div x-show="activeTab === 'profile'" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" class="space-y-6">
                <!-- Internally collapsible update form -->
                @include('profile.partials.update-profile-information-form')
            </div>

            <!-- Panel: Security & Devices -->
            <div x-show="activeTab === 'security'" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" class="space-y-4">
                
                <!-- Collapsible: Change Password Form (Default: Collapsed) -->
                @php
                    $hasPasswordError = $errors->has('current_password') || $errors->has('password') || $errors->has('password_confirmation');
                @endphp
                <div x-data="{ expanded: {{ $hasPasswordError ? 'true' : 'false' }} }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
                    <button type="button" @click="expanded = !expanded" 
                        class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                        <div>
                            <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                                <x-material-icon class="text-cu-muted" size="sm" />
                                Ubah Kata Sandi
                            </h3>
                            <p class="text-xs text-cu-muted mt-0.5">Perbarui kata sandi akun Anda secara berkala untuk keamanan.</p>
                        </div>
                        <x-material-icon class="transition-transform duration-200" 
                            ::class="expanded ? 'rotate-180' : ''" 
                            class="cu-icon-expand-more" size="sm" />
                    </button>
                    
                    <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30">
                        <div class="max-w-xl">
                            @include('profile.partials.update-password-form')
                        </div>
                    </div>
                </div>

                <!-- Collapsible: Active Device Sessions Form (Default: Collapsed) -->
                <div x-data="{ expanded: false }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
                    <button type="button" @click="expanded = !expanded" 
                        class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                        <div>
                            <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                                <x-material-icon class="text-cu-muted" size="sm" />
                                Sesi & Perangkat Aktif
                            </h3>
                            <p class="text-xs text-cu-muted mt-0.5">Daftar browser dan perangkat yang saat ini mengakses akun Anda.</p>
                        </div>
                        <x-material-icon class="transition-transform duration-200" 
                            ::class="expanded ? 'rotate-180' : ''" 
                            class="cu-icon-expand-more" size="sm" />
                    </button>
                    
                    <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30">
                        @include('profile.partials.active-sessions-form')
                    </div>
                </div>

                <!-- Collapsible: Danger Zone (Default: Collapsed) -->
                @php
                    $hasDeleteError = $errors->hasBag('userDeletion');
                @endphp
                <div x-data="{ expanded: {{ $hasDeleteError ? 'true' : 'false' }} }" class="rounded-xl border border-red-500/20 bg-red-500/5 shadow-sm overflow-hidden transition-all duration-200">
                    <button type="button" @click="expanded = !expanded" 
                        class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-red-500/10 transition focus:outline-none">
                        <div>
                            <h3 class="text-sm font-semibold text-red-600 flex items-center gap-2">
                                <x-material-icon class="text-red-500/70" size="sm" />
                                Hapus Akun (Danger Zone)
                            </h3>
                            <p class="text-xs text-red-600/75 mt-0.5">Tindakan permanen untuk menonaktifkan dan menghapus seluruh data akun.</p>
                        </div>
                        <x-material-icon class="transition-transform duration-200" 
                            ::class="expanded ? 'rotate-180' : ''" 
                            class="cu-icon-expand-more" size="sm" />
                    </button>
                    
                    <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-red-500/10">
                        <div class="max-w-xl">
                            @include('profile.partials.delete-user-form')
                        </div>
                    </div>
                </div>
            </div>

            <!-- Panel: Role-Based Configs -->
            @if($hasRoleSettings)
                <div x-show="activeTab === 'role_settings'" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" class="space-y-6">
                    @include('profile.partials.role-settings-form')
                </div>
            @endif

            <!-- Panel: Activity Logs Timeline (Default: Collapsed) -->
            <div x-show="activeTab === 'activity_log'" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" class="space-y-6">
                <div x-data="{ expanded: false }" class="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden transition-all duration-200">
                    <button type="button" @click="expanded = !expanded" 
                        class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none">
                        <div>
                            <h3 class="text-sm font-semibold text-cu-ink flex items-center gap-2">
                                <x-material-icon class="text-cu-muted" size="sm" />
                                Riwayat Log Keamanan
                            </h3>
                            <p class="text-xs text-cu-muted mt-0.5">Jejak audit riwayat login dan aktivitas akun terakhir Anda.</p>
                        </div>
                        <x-material-icon class="transition-transform duration-200" 
                            ::class="expanded ? 'rotate-180' : ''" 
                            class="cu-icon-expand-more" size="sm" />
                    </button>
                    
                    <div x-show="expanded" x-cloak x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" class="px-5 pb-5 pt-3 border-t border-cu-line/30">
                        @include('profile.partials.activity-log-timeline')
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</x-app-layout>
