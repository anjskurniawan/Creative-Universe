<div wire:poll.10s>
    {{-- Flash Messages --}}
    @if (session()->has('success'))
        <div class="mb-4 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm" role="alert">
            {{ session('success') }}
        </div>
    @endif
    @if (session()->has('error'))
        <div class="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm" role="alert">
            {{ session('error') }}
        </div>
    @endif

    @forelse ($pendingUsers as $pendingUser)
        <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 mb-4 hover:border-amber-500/20 transition-colors duration-200"
             wire:key="pending-{{ $pendingUser->id }}">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <!-- User Info -->
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <img class="w-10 h-10 rounded-full object-cover"
                             src="{{ 'https://ui-avatars.com/api/?name=' . urlencode($pendingUser->name) . '&background=6B7280&color=fff&size=40' }}"
                             alt="{{ $pendingUser->name }}">
                        <div>
                            <h3 class="text-white font-semibold">{{ $pendingUser->name }}</h3>
                            <p class="text-gray-400 text-sm">{{ '@' . $pendingUser->username }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                            <span class="text-gray-500">Email:</span>
                            <span class="text-gray-300 ml-1">{{ $pendingUser->email }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">WhatsApp:</span>
                            <span class="text-gray-300 ml-1">{{ $pendingUser->whatsapp_number ?: '-' }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Mendaftar:</span>
                            <span class="text-gray-300 ml-1">{{ $pendingUser->created_at->diffForHumans() }}</span>
                        </div>
                    </div>

                    @if($pendingUser->registration_note)
                        <div class="mt-3 p-3 bg-gray-700/30 rounded-md border border-gray-700/30">
                            <p class="text-xs text-gray-500 mb-1">Catatan registrasi:</p>
                            <p class="text-sm text-gray-300">{{ $pendingUser->registration_note }}</p>
                        </div>
                    @endif
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-2 md:w-56 shrink-0">
                    <!-- Approve -->
                    <select wire:model="selectedRole"
                        class="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2">
                        <option value="">Pilih Role</option>
                        @foreach($roles as $role)
                            <option value="{{ $role->name }}">{{ $role->name }}</option>
                        @endforeach
                    </select>
                    <button wire:click="approve({{ $pendingUser->id }})"
                        class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Setujui Akun
                    </button>

                    <!-- Reject -->
                    <button wire:click="reject({{ $pendingUser->id }})"
                        wire:confirm="Akun ini akan ditolak dan dihapus dari sistem. Yakin?"
                        class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 text-sm font-medium rounded-md border border-red-600/30 transition-colors duration-200">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Tolak Akun
                    </button>
                </div>
            </div>
        </div>
    @empty
        <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-12 text-center">
            <svg class="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500">Tidak ada akun yang menunggu persetujuan.</p>
        </div>
    @endforelse

    <!-- Pagination -->
    @if($pendingUsers->hasPages())
        <div class="mt-4">
            {{ $pendingUsers->links() }}
        </div>
    @endif
</div>
