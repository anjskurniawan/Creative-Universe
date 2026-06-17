{{-- 
    Open/close state managed by Alpine.js only (not Livewire @entangle).
    Livewire handles: event refresh, mark as read, notification list.
    Alpine handles: panel visibility, animation, click-outside.
--}}
<div class="relative" x-data="{ open: false }">
    {{-- Bell Button --}}
    <button @click="open = !open" type="button"
        class="relative p-1.5 text-gray-300 hover:text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors">
        <span class="sr-only">Lihat notifikasi</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
        </svg>
        @if($unreadCount > 0)
            <div class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-800 pointer-events-none">
                <span class="text-[10px] font-bold text-white leading-none">{{ $unreadCount > 9 ? '9+' : $unreadCount }}</span>
            </div>
        @endif
    </button>

    {{-- Notification Panel --}}
    <div x-show="open" x-cloak @click.outside="open = false"
         x-transition:enter="transition ease-out duration-150"
         x-transition:enter-start="opacity-0 scale-95"
         x-transition:enter-end="opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-100"
         x-transition:leave-start="opacity-100 scale-100"
         x-transition:leave-end="opacity-0 scale-95"
         class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">

        {{-- Header --}}
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900">Notifikasi</h3>
            @if($unreadCount > 0)
                <button wire:click="markAllAsRead" class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Tandai semua dibaca
                </button>
            @endif
        </div>

        {{-- Notification List --}}
        <div class="max-h-80 overflow-y-auto divide-y divide-gray-100">
            @forelse($this->notifications as $notification)
                <div class="px-4 py-3 hover:bg-gray-50 transition-colors {{ is_null($notification->read_at) ? 'bg-blue-50/50' : '' }}">
                    <div class="flex items-start gap-3">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm text-gray-800 {{ is_null($notification->read_at) ? 'font-medium' : '' }}">
                                {{ $notification->data['message'] ?? 'Notifikasi baru' }}
                            </p>
                            <p class="text-xs text-gray-400 mt-1">
                                {{ $notification->created_at->diffForHumans() }}
                            </p>
                        </div>
                        @if(is_null($notification->read_at))
                            <button wire:click="markAsRead('{{ $notification->id }}')"
                                class="shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 hover:bg-blue-700 transition-colors cursor-pointer"
                                title="Tandai dibaca">
                            </button>
                        @endif
                    </div>
                </div>
            @empty
                <div class="px-4 py-8 text-center">
                    <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                    </svg>
                    <p class="text-sm text-gray-400">Belum ada notifikasi</p>
                </div>
            @endforelse
        </div>
    </div>
</div>
