<div wire:poll.30s="loadStats">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <!-- Total User Aktif -->
        <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 hover:border-blue-500/30 transition-colors duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400 mb-1">User Aktif</p>
                    <p class="text-3xl font-bold text-white">{{ $totalActiveUsers }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Pending Approval (Superadmin only) -->
        @can('approve-users')
        <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 hover:border-amber-500/30 transition-colors duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400 mb-1">Menunggu Persetujuan</p>
                    <p class="text-3xl font-bold text-white">{{ $totalPendingUsers }}</p>
                </div>
                <div class="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            @if($totalPendingUsers > 0)
                <a href="{{ route('core.users.pending') }}" wire:navigate class="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                    Tinjau akun pending →
                </a>
            @endif
        </div>
        @endcan

        <!-- Role Info -->
        <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 hover:border-green-500/30 transition-colors duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400 mb-1">Role Kamu</p>
                    <p class="text-xl font-bold text-white">{{ $userRoles }}</p>
                </div>
                <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                </div>
            </div>
        </div>

    </div>
</div>
