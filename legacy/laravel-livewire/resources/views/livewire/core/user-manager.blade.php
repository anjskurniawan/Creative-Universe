<div class="space-y-6">
    <!-- Notifications/Alerts -->
    @if(session('success'))
        <x-app-alert type="success">{{ session('success') }}</x-app-alert>
    @endif
    @if(session('error'))
        <x-app-alert type="danger">{{ session('error') }}</x-app-alert>
    @endif

    <!-- Controls Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Search bar -->
        <div class="relative max-w-md w-full">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cu-muted">
                <x-material-icon class="cu-icon-search text-lg" />
            </div>
            <input type="search" wire:model.live.debounce.300ms="search" placeholder="Cari nama, username, atau email..."
                class="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-10 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover">
        </div>

        <!-- Root Configuration Options -->
        @if(auth()->user()->hasRole('Root'))
            <button type="button" wire:click="openWhitelistModal"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-line bg-cu-panel-soft px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft/80">
                <x-material-icon class="cu-icon-settings-suggest" />
                Atur Izin Manajer
            </button>
        @endif
    </div>

    <!-- Active User Table -->
    <div class="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-cu-muted">
                <thead class="border-b border-cu-line bg-cu-panel-soft/60 text-[10px] font-bold uppercase tracking-wider text-cu-muted">
                    <tr>
                        <th class="px-6 py-4">Nama</th>
                        <th class="px-6 py-4">Username</th>
                        <th class="px-6 py-4">Email</th>
                        <th class="px-6 py-4">Peran</th>
                        <th class="px-6 py-4">Bergabung</th>
                        <th class="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-cu-line/40">
                    @forelse ($users as $user)
                        <tr class="transition hover:bg-cu-panel-soft/20">
                            <!-- Name / Avatar -->
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center gap-3">
                                    <div class="size-8 rounded-full border border-cu-line bg-cu-panel-soft overflow-hidden flex items-center justify-center shrink-0">
                                        @if($user->avatar_path)
                                            <img class="size-full object-cover" src="{{ asset('storage/' . $user->avatar_path) }}" alt="{{ $user->name }}">
                                        @else
                                            @php
                                                $initials = collect(explode(' ', $user->name))->map(fn($n) => mb_substr($n, 0, 1))->take(2)->join('');
                                            @endphp
                                            <span class="text-xs font-bold uppercase text-cu-muted">{{ $initials }}</span>
                                        @endif
                                    </div>
                                    <span class="font-semibold text-cu-ink">{{ $user->name }}</span>
                                    @if(!$user->is_active)
                                        <span class="inline-flex items-center rounded-full bg-cu-danger/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cu-danger border border-cu-danger/20">
                                            Nonaktif
                                        </span>
                                    @endif
                                </div>
                            </td>

                            <!-- Username -->
                            <td class="px-6 py-4 text-cu-ink whitespace-nowrap">{{ $user->username }}</td>

                            <!-- Email -->
                            <td class="px-6 py-4 whitespace-nowrap">{{ $user->email }}</td>

                            <!-- Roles & Permissions -->
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-1">
                                    <div class="flex flex-wrap gap-1.5">
                                        @foreach($user->roles as $role)
                                            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider
                                                {{ $role->name === 'Root' ? 'border border-red-500/20 bg-red-500/5 text-red-500' :
                                                   ($role->name === 'Manajer' ? 'border border-cu-info/20 bg-cu-info-soft text-cu-info' :
                                                   'border border-cu-line bg-cu-panel-soft text-cu-muted') }}">
                                                {{ $role->name }}
                                            </span>
                                        @endforeach
                                    </div>
                                    @if($user->permissions->count() > 0)
                                        <div class="flex flex-wrap gap-1 mt-1">
                                            @foreach($user->permissions as $perm)
                                                <span class="inline-flex items-center rounded-full border border-cu-line/40 bg-cu-panel-soft px-1.5 py-0.5 text-[9px] font-semibold text-cu-ink">
                                                    +{{ $perm->name }}
                                                </span>
                                            @endforeach
                                        </div>
                                    @endif
                                </div>
                            </td>

                            <!-- Joined -->
                            <td class="px-6 py-4 text-xs text-cu-muted whitespace-nowrap">
                                {{ $user->created_at->format('d M Y') }}
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                @if(auth()->user()->hasRole('Root') || !$user->hasRole('Root'))
                                    <div class="flex items-center justify-end gap-1.5">
                                        <button type="button" wire:click="openEditOtorisasi({{ $user->id }})"
                                            class="rounded-lg border border-cu-line bg-cu-surface hover:bg-cu-panel-soft px-3 py-1.5 text-xs font-semibold text-cu-ink transition">
                                            Otorisasi
                                        </button>
                                        <button type="button" wire:click="openKelolaAkun({{ $user->id }})"
                                            class="rounded-lg border border-cu-line bg-cu-surface hover:bg-cu-panel-soft px-3 py-1.5 text-xs font-semibold text-cu-ink transition">
                                            Kelola
                                        </button>
                                    </div>
                                @else
                                    <span class="text-xs text-cu-muted italic">Protected</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center text-cu-muted">
                                Tidak ada pengguna aktif terdaftar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($users->hasPages())
            <div class="border-t border-cu-line px-6 py-4">
                {{ $users->links() }}
            </div>
        @endif
    </div>

    <!-- MODAL: Edit Otorisasi -->
    @if($showEditOtorisasiModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cu-ink/60 backdrop-blur-sm" wire:click.self="closeEditOtorisasi">
            <div class="bg-cu-surface border border-cu-line rounded-2xl w-full max-w-xl overflow-hidden shadow-xl" x-data x-trap.noscroll="true">
                <!-- Modal Header -->
                <div class="border-b border-cu-line px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-base font-bold text-cu-ink">Edit Otorisasi Pengguna</h3>
                        <p class="text-xs text-cu-muted mt-0.5">{{ $editingUserName }} ({{ $editingUserEmail }})</p>
                    </div>
                    <button type="button" wire:click="closeEditOtorisasi" class="text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon class="cu-icon-close text-xl" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    <!-- Roles Section -->
                    <div class="space-y-3">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-cu-ink">Peran (Roles)</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            @foreach($rolesList as $role)
                                <label class="flex items-start gap-3 p-3 rounded-xl border border-cu-line bg-cu-panel-soft/30 hover:bg-cu-panel-soft/60 cursor-pointer transition">
                                    <input type="checkbox" wire:model="selectedRoles" value="{{ $role->name }}"
                                        class="mt-0.5 rounded border-cu-line text-cu-ink focus:ring-cu-border-hover bg-cu-surface" />
                                    <div>
                                        <span class="text-xs font-semibold text-cu-ink">{{ $role->name }}</span>
                                    </div>
                                </label>
                            @endforeach
                        </div>
                    </div>

                    <!-- Direct Permissions Section -->
                    <div class="space-y-3">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-cu-ink">Izin Langsung (Direct Permissions)</h4>
                        @if(count($manageablePermissionsList) > 0)
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                @foreach($manageablePermissionsList as $perm)
                                    <label class="flex items-start gap-3 p-3 rounded-xl border border-cu-line bg-cu-panel-soft/30 hover:bg-cu-panel-soft/60 cursor-pointer transition">
                                        <input type="checkbox" wire:model="selectedPermissions" value="{{ $perm->name }}"
                                            class="mt-0.5 rounded border-cu-line text-cu-ink focus:ring-cu-border-hover bg-cu-surface" />
                                        <div>
                                            <span class="text-xs font-semibold text-cu-ink">{{ $perm->name }}</span>
                                        </div>
                                    </label>
                                @endforeach
                            </div>
                        @else
                            <p class="text-xs text-cu-muted italic">Tidak ada permission yang dapat didelegasikan oleh Anda saat ini.</p>
                        @endif
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="border-t border-cu-line px-6 py-4 flex items-center justify-end gap-3 bg-cu-panel-soft/30">
                    <button type="button" wire:click="closeEditOtorisasi"
                        class="rounded-full border border-cu-line bg-cu-surface hover:bg-cu-panel-soft px-4 py-2 text-xs font-semibold text-cu-ink transition">
                        Batal
                    </button>
                    <button type="button" wire:click="saveOtorisasi"
                        class="rounded-full border border-cu-ink bg-cu-ink hover:bg-cu-ink-hover px-4 py-2 text-xs font-semibold text-cu-surface transition">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    @endif

    <!-- MODAL: Whitelist Manager Permissions (Root Only) -->
    @if($showWhitelistModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cu-ink/60 backdrop-blur-sm" wire:click.self="closeWhitelistModal">
            <div class="bg-cu-surface border border-cu-line rounded-2xl w-full max-w-xl overflow-hidden shadow-xl" x-data x-trap.noscroll="true">
                <!-- Modal Header -->
                <div class="border-b border-cu-line px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-base font-bold text-cu-ink">Kelola Izin Delegasi Manajer</h3>
                        <p class="text-xs text-cu-muted mt-0.5">Tentukan permission apa saja yang dapat didelegasikan atau dikelola oleh pengguna dengan peran Manajer.</p>
                    </div>
                    <button type="button" wire:click="closeWhitelistModal" class="text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon class="cu-icon-close text-xl" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        @foreach($permissionsList as $perm)
                            @php
                                // Do not allow managers to manage run-artisan or manage-roles by default
                                $isSystemSensitive = in_array($perm->name, ['run-artisan', 'manage-roles', 'view-logs'], true);
                            @endphp
                            <label class="flex items-start gap-3 p-3 rounded-xl border border-cu-line bg-cu-panel-soft/30 hover:bg-cu-panel-soft/60 cursor-pointer transition">
                                <input type="checkbox" wire:model="whitelistedPermissions" value="{{ $perm->name }}"
                                    class="mt-0.5 rounded border-cu-line text-cu-ink focus:ring-cu-border-hover bg-cu-surface" />
                                <div>
                                    <span class="text-xs font-semibold text-cu-ink {{ $isSystemSensitive ? 'text-cu-danger' : '' }}">{{ $perm->name }}</span>
                                    @if($isSystemSensitive)
                                        <p class="text-[10px] text-red-500/70 mt-0.5">Izin Kritis Sistem</p>
                                    @endif
                                </div>
                            </label>
                        @endforeach
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="border-t border-cu-line px-6 py-4 flex items-center justify-end gap-3 bg-cu-panel-soft/30">
                    <button type="button" wire:click="closeWhitelistModal"
                        class="rounded-full border border-cu-line bg-cu-surface hover:bg-cu-panel-soft px-4 py-2 text-xs font-semibold text-cu-ink transition">
                        Batal
                    </button>
                    <button type="button" wire:click="saveWhitelist"
                        class="rounded-full border border-cu-ink bg-cu-ink hover:bg-cu-ink-hover px-4 py-2 text-xs font-semibold text-cu-surface transition">
                        Simpan Konfigurasi
                    </button>
                </div>
            </div>
        </div>
    @endif

    <!-- MODAL: Kelola Akun -->
    @if($showKelolaAkunModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cu-ink/60 backdrop-blur-sm" wire:click.self="closeKelolaAkun">
            <div class="bg-cu-surface border border-cu-line rounded-2xl w-full {{ auth()->user()->hasRole('Root') ? 'max-w-4xl' : 'max-w-xl' }} overflow-hidden shadow-xl" x-data x-trap.noscroll="true">
                <!-- Modal Header -->
                <div class="border-b border-cu-line px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-base font-bold text-cu-ink">Kelola Akun Pengguna</h3>
                        <p class="text-xs text-cu-muted mt-0.5">{{ $managingUserName }} ({{ $managingUserEmail }})</p>
                    </div>
                    <button type="button" wire:click="closeKelolaAkun" class="text-cu-muted hover:text-cu-ink transition">
                        <x-material-icon class="cu-icon-close text-xl" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                    @if(auth()->user()->hasRole('Root'))
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left Column: Settings -->
                            <div class="space-y-6">
                                <!-- Status Toggle -->
                                <div class="space-y-2">
                                    <label class="text-xs font-bold uppercase tracking-wider text-cu-ink block">Status Akun</label>
                                    <div class="flex items-center gap-3">
                                        <label class="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" wire:model="managingUserIsActive" class="sr-only peer">
                                            <div class="relative w-11 h-6 bg-cu-panel-soft peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cu-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cu-success"></div>
                                            <span class="ms-3 text-xs font-medium text-cu-ink">{{ $managingUserIsActive ? 'Aktif' : 'Nonaktif (Ditangguhkan)' }}</span>
                                        </label>
                                    </div>
                                    <p class="text-[10px] text-cu-muted">Jika dinonaktifkan, seluruh sesi aktif perangkat pengguna ini akan segera dikeluarkan.</p>
                                </div>

                                <!-- Password Reset -->
                                <div class="space-y-3">
                                    <label class="text-xs font-bold uppercase tracking-wider text-cu-ink block">Reset Kata Sandi</label>
                                    <div class="space-y-3">
                                        <div>
                                            <input type="password" wire:model="newPassword" placeholder="Kata sandi baru..."
                                                class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-xs text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none">
                                            @error('newPassword') <p class="text-[10px] text-cu-danger mt-1">{{ $message }}</p> @enderror
                                        </div>
                                        <div>
                                            <input type="password" wire:model="newPassword_confirmation" placeholder="Konfirmasi kata sandi baru..."
                                                class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-xs text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none">
                                        </div>
                                    </div>
                                    <p class="text-[10px] text-cu-muted">Biarkan kosong jika tidak ingin merubah kata sandi.</p>
                                </div>
                            </div>

                            <!-- Right Column: Audit Logs & Active Sessions (Root Only) -->
                            <div class="space-y-6 border-t md:border-t-0 md:border-l border-cu-line/40 md:pl-6 pt-6 md:pt-0">
                                <!-- Devices / Active Sessions -->
                                <div class="space-y-3">
                                    <label class="text-xs font-bold uppercase tracking-wider text-cu-ink block">Sesi & Perangkat Aktif</label>
                                    <div class="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                        @forelse($userSessions as $session)
                                            @php
                                                $userAgent = $session->user_agent;
                                                $os = 'Tidak Dikenal';
                                                $browser = 'Browser';
                                                if ($userAgent) {
                                                    if (preg_match('/windows|win32/i', $userAgent)) { $os = 'Windows'; }
                                                    elseif (preg_match('/macintosh|mac os x/i', $userAgent)) { $os = 'macOS'; }
                                                    elseif (preg_match('/android/i', $userAgent)) { $os = 'Android'; }
                                                    elseif (preg_match('/iphone|ipad|ipod/i', $userAgent)) { $os = 'iOS'; }
                                                    elseif (preg_match('/linux/i', $userAgent)) { $os = 'Linux'; }

                                                    if (preg_match('/chrome|crios/i', $userAgent) && !preg_match('/edge|edg/i', $userAgent)) { $browser = 'Chrome'; }
                                                    elseif (preg_match('/safari/i', $userAgent) && !preg_match('/chrome|crios/i', $userAgent)) { $browser = 'Safari'; }
                                                    elseif (preg_match('/firefox|fxios/i', $userAgent)) { $browser = 'Firefox'; }
                                                    elseif (preg_match('/edge|edg/i', $userAgent)) { $browser = 'Edge'; }
                                                }
                                                $deviceInfo = "$browser ($os)";
                                                $lastActive = \Carbon\Carbon::createFromTimestamp($session->last_activity);
                                            @endphp
                                            <div class="flex items-center justify-between p-2.5 rounded-xl border border-cu-line bg-cu-panel-soft/30 text-xs">
                                                <div class="flex items-center gap-2">
                                                    <x-material-icon class="{{ preg_match('/android|iphone|ipad/i', $userAgent ?? '') ? 'smartphone' : 'laptop' }} text-cu-muted" size="sm" />
                                                    <div>
                                                        <p class="font-semibold text-cu-ink">{{ $deviceInfo }}</p>
                                                        <p class="text-[9px] text-cu-muted">IP: {{ $session->ip_address }} • Aktif {{ $lastActive->diffForHumans() }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        @empty
                                            <p class="text-xs text-cu-muted italic">Tidak ada sesi aktif.</p>
                                        @endforelse
                                    </div>
                                </div>

                                <!-- Activity Log -->
                                <div class="space-y-3">
                                    <label class="text-xs font-bold uppercase tracking-wider text-cu-ink block">Log Aktivitas Terbaru</label>
                                    <div class="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-xs">
                                        @forelse($userActivities as $act)
                                            <div class="p-2.5 rounded-xl border border-cu-line bg-cu-panel-soft/30 space-y-1">
                                                <div class="flex items-center justify-between">
                                                    <span class="font-bold text-[10px] uppercase tracking-wider text-cu-muted">{{ $act['log_name'] }}</span>
                                                    <span class="text-[9px] text-cu-muted">{{ \Carbon\Carbon::parse($act['created_at'])->diffForHumans() }}</span>
                                                </div>
                                                <p class="text-cu-ink">{{ $act['description'] }}</p>
                                            </div>
                                        @empty
                                            <p class="text-xs text-cu-muted italic">Belum ada aktivitas tercatat.</p>
                                        @endforelse
                                    </div>
                                </div>
                            </div>
                        </div>
                    @else
                        <!-- Manager Layout: Settings Only -->
                        <div class="space-y-6">
                            <!-- Status Toggle -->
                            <div class="space-y-2">
                                <label class="text-xs font-bold uppercase tracking-wider text-cu-ink block">Status Akun</label>
                                <div class="flex items-center gap-3">
                                    <label class="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" wire:model="managingUserIsActive" class="sr-only peer">
                                        <div class="relative w-11 h-6 bg-cu-panel-soft peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cu-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cu-success"></div>
                                        <span class="ms-3 text-xs font-medium text-cu-ink">{{ $managingUserIsActive ? 'Aktif' : 'Nonaktif (Ditangguhkan)' }}</span>
                                    </label>
                                </div>
                                <p class="text-[10px] text-cu-muted">Jika dinonaktifkan, seluruh sesi aktif perangkat pengguna ini akan segera dikeluarkan.</p>
                            </div>

                            <!-- Password Reset -->
                            <div class="space-y-3">
                                <label class="text-xs font-bold uppercase tracking-wider text-cu-ink block">Reset Kata Sandi</label>
                                <div class="space-y-3">
                                    <div>
                                        <input type="password" wire:model="newPassword" placeholder="Kata sandi baru..."
                                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-xs text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none">
                                        @error('newPassword') <p class="text-[10px] text-cu-danger mt-1">{{ $message }}</p> @enderror
                                    </div>
                                    <div>
                                        <input type="password" wire:model="newPassword_confirmation" placeholder="Konfirmasi kata sandi baru..."
                                            class="block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-xs text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none">
                                    </div>
                                </div>
                                <p class="text-[10px] text-cu-muted">Biarkan kosong jika tidak ingin merubah kata sandi.</p>
                            </div>
                        </div>
                    @endif
                </div>

                <!-- Modal Footer -->
                <div class="border-t border-cu-line px-6 py-4 flex items-center justify-end gap-3 bg-cu-panel-soft/30">
                    <button type="button" wire:click="closeKelolaAkun"
                        class="rounded-full border border-cu-line bg-cu-surface hover:bg-cu-panel-soft px-4 py-2 text-xs font-semibold text-cu-ink transition">
                        Batal
                    </button>
                    <button type="button" wire:click="saveKelolaAkun"
                        class="rounded-full border border-cu-ink bg-cu-ink hover:bg-cu-ink-hover px-4 py-2 text-xs font-semibold text-cu-surface transition">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    @endif
</div>
