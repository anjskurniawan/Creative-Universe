<div>
    @if($isRoot)
        {{-- Root-Specific Stats Grid --}}
        <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {{-- 1. Active & Suspended Users --}}
            <x-app-panel class="transition-all duration-200 hover:scale-[1.01] hover:border-cu-info/30">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="mb-1 text-sm text-cu-muted">Pengguna Sistem</p>
                        <p class="text-3xl font-bold text-cu-ink">{{ $totalActiveUsers }} <span class="text-sm font-normal text-cu-muted">Aktif</span></p>
                        @if($totalSuspendedUsers > 0)
                            <p class="mt-1.5 text-xs font-semibold text-cu-danger flex items-center gap-1">
                                <span class="inline-block size-1.5 rounded-full bg-cu-danger animate-pulse"></span>
                                {{ $totalSuspendedUsers }} Terbanned
                            </p>
                        @else
                            <p class="mt-1.5 text-xs text-cu-muted">Semua akun terverifikasi aktif</p>
                        @endif
                    </div>
                    <div class="flex size-12 items-center justify-center rounded-xl bg-cu-info-soft text-cu-info">
                        <x-material-icon class="cu-icon-groups" size="md" />
                    </div>
                </div>
            </x-app-panel>

            {{-- 2. Global Active Sessions --}}
            <x-app-panel class="transition-all duration-200 hover:scale-[1.01] hover:border-cu-brand/30">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="mb-1 text-sm text-cu-muted">Sesi Perangkat Aktif</p>
                        <p class="text-3xl font-bold text-cu-ink">{{ $totalSessions }}</p>
                        <p class="mt-1.5 text-xs text-cu-muted">Perangkat terhubung saat ini</p>
                    </div>
                    <div class="flex size-12 items-center justify-center rounded-xl bg-cu-brand-soft text-cu-brand">
                        <x-material-icon class="cu-icon-devices" size="md" />
                    </div>
                </div>
            </x-app-panel>

            {{-- 3. Queue Health --}}
            @if($failedJobsCount > 0)
                <x-app-panel class="border-cu-danger/40 bg-cu-danger-soft/10 transition-all duration-200 hover:scale-[1.01]">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="mb-1 text-sm text-cu-danger">Antrean Pekerjaan</p>
                            <p class="text-3xl font-bold text-cu-danger">{{ $totalPendingJobs }} <span class="text-sm font-normal text-cu-muted">Pending</span></p>
                            <p class="mt-1.5 text-xs font-semibold text-cu-danger flex items-center gap-1">
                                <x-material-icon class="cu-icon-error text-cu-danger" size="xs" />
                                {{ $failedJobsCount }} Pekerjaan Gagal
                            </p>
                        </div>
                        <div class="flex size-12 items-center justify-center rounded-xl bg-cu-danger-soft text-cu-danger">
                            <x-material-icon class="cu-icon-error-outline" size="md" />
                        </div>
                    </div>
                </x-app-panel>
            @else
                <x-app-panel class="transition-all duration-200 hover:scale-[1.01] hover:border-cu-success/30">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="mb-1 text-sm text-cu-muted">Antrean Pekerjaan</p>
                            <p class="text-3xl font-bold text-cu-ink">{{ $totalPendingJobs }} <span class="text-sm font-normal text-cu-muted">Pending</span></p>
                            <p class="mt-1.5 text-xs text-cu-success flex items-center gap-1">
                                <x-material-icon class="cu-icon-check-circle" size="xs" />
                                Semua berjalan lancar
                            </p>
                        </div>
                        <div class="flex size-12 items-center justify-center rounded-xl bg-cu-success-soft text-cu-success">
                            <x-material-icon class="cu-icon-queue" size="md" />
                        </div>
                    </div>
                </x-app-panel>
            @endif

            {{-- 4. Database Info --}}
            <x-app-panel class="transition-all duration-200 hover:scale-[1.01] hover:border-cu-warning/30">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="mb-1 text-sm text-cu-muted">Ukuran Basis Data</p>
                        <p class="text-3xl font-bold text-cu-ink">{{ $databaseSize }}</p>
                        <p class="mt-1.5 text-xs text-cu-muted uppercase font-mono">{{ $databaseDriver }} connection</p>
                    </div>
                    <div class="flex size-12 items-center justify-center rounded-xl bg-cu-warning-soft text-cu-warning">
                        <x-material-icon class="cu-icon-storage" size="md" />
                    </div>
                </div>
            </x-app-panel>
        </div>

        {{-- Log Aktivitas Global Terbaru --}}
        <x-app-panel class="mb-8" padding="lg">
            <div class="flex items-center justify-between border-b border-cu-line pb-4 mb-4">
                <div>
                    <h2 class="text-lg font-bold text-cu-ink flex items-center gap-2">
                        <x-material-icon class="cu-icon-history text-cu-muted" size="sm" />
                        Log Aktivitas Sistem Terbaru
                    </h2>
                    <p class="text-xs text-cu-muted mt-0.5">Memantau tindakan administratif dan aktivitas keamanan global.</p>
                </div>
                <div class="text-[10px] uppercase font-bold text-cu-muted tracking-wider bg-cu-panel-soft px-2.5 py-1 rounded-full animate-pulse">
                    Real-time (30s)
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="border-b border-cu-line text-xs font-bold uppercase tracking-wider text-cu-muted bg-cu-panel-soft/50">
                            <th class="py-3 px-4">Operator</th>
                            <th class="py-3 px-4">Kategori</th>
                            <th class="py-3 px-4">Aktivitas</th>
                            <th class="py-3 px-4">IP Address & Browser</th>
                            <th class="py-3 px-4 text-right">Waktu</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-cu-line text-xs">
                        @forelse($latestActivities as $act)
                            <tr class="hover:bg-cu-panel-soft/20 transition-colors">
                                <td class="py-3.5 px-4 font-semibold text-cu-ink">{{ $act['causer_name'] }}</td>
                                <td class="py-3.5 px-4">
                                    <span class="inline-flex items-center rounded-md px-2 py-0.5 font-medium ring-1 ring-inset uppercase text-[10px]
                                        @if($act['log_name'] === 'auth') bg-cu-info-soft text-cu-info ring-cu-info/20
                                        @elseif($act['log_name'] === 'rbac') bg-cu-brand-soft text-cu-brand ring-cu-brand/20
                                        @else bg-cu-warning-soft text-cu-warning ring-cu-warning/20 @endif">
                                        {{ $act['log_name'] }}
                                    </span>
                                </td>
                                <td class="py-3.5 px-4 text-cu-muted font-mono max-w-xs truncate" title="{{ $act['description'] }}">
                                    {{ $act['description'] }}
                                </td>
                                <td class="py-3.5 px-4 font-mono text-cu-muted">
                                    <span class="text-cu-ink font-semibold">{{ $act['ip'] }}</span>
                                    <span class="text-[10px] ml-1 block sm:inline opacity-75 truncate max-w-[150px]" title="{{ $act['user_agent'] }}">
                                        {{ Str::limit($act['user_agent'], 30) }}
                                    </span>
                                </td>
                                <td class="py-3.5 px-4 text-right text-cu-muted whitespace-nowrap">{{ $act['created_at_human'] }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="py-6 text-center italic text-cu-muted">Belum ada aktivitas tercatat di sistem.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-app-panel>

        {{-- System Env Bar --}}
        <div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 bg-cu-surface border border-cu-line rounded-xl p-4 text-xs">
            <div class="flex flex-col gap-0.5">
                <span class="text-[10px] font-bold text-cu-muted uppercase tracking-wider">Laravel Version</span>
                <span class="font-mono font-semibold text-cu-ink">{{ $systemEnv['laravel_version'] }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
                <span class="text-[10px] font-bold text-cu-muted uppercase tracking-wider">PHP Version</span>
                <span class="font-mono font-semibold text-cu-ink">{{ $systemEnv['php_version'] }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
                <span class="text-[10px] font-bold text-cu-muted uppercase tracking-wider">Environment</span>
                <span class="font-mono font-semibold text-cu-ink uppercase">{{ $systemEnv['app_env'] }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
                <span class="text-[10px] font-bold text-cu-muted uppercase tracking-wider">Debug Mode</span>
                <span class="font-mono font-semibold @if($systemEnv['app_debug'] === 'Aktif') text-cu-warning @else text-cu-muted @endif">
                    {{ $systemEnv['app_debug'] }}
                </span>
            </div>
        </div>
    @else
        {{-- Non-Root Default Grid --}}
        <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <x-app-panel class="transition-colors hover:border-cu-info/30">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="mb-1 text-sm text-cu-muted">User Aktif</p>
                        <p class="text-3xl font-semibold text-cu-ink">{{ $totalActiveUsers }}</p>
                    </div>
                    <div class="flex size-12 items-center justify-center rounded-lg bg-cu-info-soft text-cu-info">
                        <x-material-icon class="cu-icon-groups" size="md" />
                    </div>
                </div>
            </x-app-panel>

            @can('approve-users')
                <x-app-panel class="transition-colors hover:border-cu-warning/30">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="mb-1 text-sm text-cu-muted">Menunggu Persetujuan</p>
                            <p class="text-3xl font-semibold text-cu-ink">{{ $totalPendingUsers }}</p>
                        </div>
                        <div class="flex size-12 items-center justify-center rounded-lg bg-cu-warning-soft text-cu-warning">
                            <x-material-icon class="cu-icon-pending-actions" size="md" />
                        </div>
                    </div>

                    @if($totalPendingUsers > 0)
                        <a href="{{ route('core.users.pending') }}" wire:navigate
                            class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cu-warning transition-colors hover:text-cu-warning-hover">
                            Tinjau akun pending
                            <x-material-icon class="cu-icon-arrow-forward" />
                        </a>
                    @endif
                </x-app-panel>
            @endcan

            <x-app-panel class="transition-colors hover:border-cu-success/30">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="mb-1 text-sm text-cu-muted">Role Kamu</p>
                        <p class="text-xl font-semibold text-cu-ink">{{ $userRoles }}</p>
                    </div>
                    <div class="flex size-12 items-center justify-center rounded-lg bg-cu-success-soft text-cu-success">
                        <x-material-icon class="cu-icon-verified-user" size="md" />
                    </div>
                </div>
            </x-app-panel>
        </div>
    @endif
</div>
