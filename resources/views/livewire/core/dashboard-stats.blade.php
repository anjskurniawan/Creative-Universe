<div wire:poll.30s="loadStats">
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <x-app-panel class="transition-colors hover:border-cu-info/30">
            <div class="flex items-center justify-between gap-4">
                <div>
                    <p class="mb-1 text-sm text-cu-muted">User Aktif</p>
                    <p class="text-3xl font-semibold text-cu-ink">{{ $totalActiveUsers }}</p>
                </div>
                <div class="flex size-12 items-center justify-center rounded-lg bg-cu-info-soft text-cu-info">
                    <x-material-icon name="groups" size="md" />
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
                        <x-material-icon name="pending_actions" size="md" />
                    </div>
                </div>

                @if($totalPendingUsers > 0)
                    <a href="{{ route('core.users.pending') }}" wire:navigate
                        class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cu-warning transition-colors hover:text-cu-warning-hover">
                        Tinjau akun pending
                        <x-material-icon name="arrow_forward" />
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
                    <x-material-icon name="verified_user" size="md" />
                </div>
            </div>
        </x-app-panel>
    </div>
</div>
