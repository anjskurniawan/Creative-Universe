{{-- 
    Open/close state managed by Alpine.js only (not Livewire @entangle).
    Livewire handles: event refresh, mark as read, notification list.
--}}
<div class="relative" x-data="{ open: false }">
    <button @click="open = !open" type="button"
        class="relative inline-flex size-10 items-center justify-center rounded-full border border-transparent text-cu-ink transition-colors hover:border-cu-border hover:bg-cu-panel-soft focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2">
        <span class="sr-only">Lihat notifikasi</span>
        <x-material-icon name="notifications" size="md" />

        @if($unreadCount > 0)
            <div class="pointer-events-none absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-cu-surface bg-cu-danger px-1">
                <span class="text-xs font-bold leading-none text-cu-surface">{{ $unreadCount > 9 ? '9+' : $unreadCount }}</span>
            </div>
        @endif
    </button>

    <div x-show="open" x-cloak @click.outside="open = false"
        x-transition:enter="transition ease-out duration-150"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-100"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-xl">

        <div class="flex items-center justify-between border-b border-cu-line bg-cu-panel-soft px-4 py-3">
            <h3 class="text-sm font-semibold text-cu-ink">Notifikasi</h3>
            @if($unreadCount > 0)
                <button wire:click="markAllAsRead" class="text-xs font-medium text-cu-info transition-colors hover:text-cu-info-hover">
                    Tandai semua dibaca
                </button>
            @endif
        </div>

        <div class="max-h-80 divide-y divide-cu-line overflow-y-auto">
            @forelse($this->notifications as $notification)
                <div class="px-4 py-3 transition-colors hover:bg-cu-panel-soft {{ is_null($notification->read_at) ? 'bg-cu-info-soft' : '' }}">
                    <div class="flex items-start gap-3">
                        <div class="min-w-0 flex-1">
                            <p class="text-sm text-cu-ink {{ is_null($notification->read_at) ? 'font-medium' : '' }}">
                                {{ $notification->data['message'] ?? 'Notifikasi baru' }}
                            </p>
                            <p class="mt-1 text-xs text-cu-muted">
                                {{ $notification->created_at->diffForHumans() }}
                            </p>
                        </div>
                        @if(is_null($notification->read_at))
                            <button wire:click="markAsRead('{{ $notification->id }}')"
                                class="mt-1.5 size-3 shrink-0 cursor-pointer rounded-full bg-cu-info transition-colors hover:bg-cu-info-hover"
                                title="Tandai dibaca">
                            </button>
                        @endif
                    </div>
                </div>
            @empty
                <div class="px-4 py-8 text-center">
                    <x-material-icon name="notifications_off" size="lg" class="mx-auto mb-2 text-cu-soft" />
                    <p class="text-sm text-cu-muted">Belum ada notifikasi</p>
                </div>
            @endforelse
        </div>
    </div>
</div>
