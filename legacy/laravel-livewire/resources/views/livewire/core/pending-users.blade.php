<div>
    @if (session()->has('success'))
        <x-app-alert type="success" class="mb-4">
            {{ session('success') }}
        </x-app-alert>
    @endif

    @if (session()->has('error'))
        <x-app-alert type="danger" class="mb-4">
            {{ session('error') }}
        </x-app-alert>
    @endif

    @forelse ($pendingUsers as $pendingUser)
        <x-app-panel class="mb-4 transition-colors duration-200 hover:border-cu-warning/30" wire:key="pending-{{ $pendingUser->id }}">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div class="flex-1">
                    <div class="mb-3 flex items-center gap-3">
                        <img class="size-10 rounded-full object-cover"
                            src="{{ 'https://ui-avatars.com/api/?name=' . urlencode($pendingUser->name) . '&background=0A0A0A&color=fff&size=40' }}"
                            alt="{{ $pendingUser->name }}">
                        <div>
                            <h3 class="font-semibold text-cu-ink">{{ $pendingUser->name }}</h3>
                            <p class="text-sm text-cu-muted">{{ '@' . $pendingUser->username }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div>
                            <span class="text-cu-muted">Email:</span>
                            <span class="ml-1 text-cu-ink">{{ $pendingUser->email }}</span>
                        </div>
                        <div>
                            <span class="text-cu-muted">WhatsApp:</span>
                            <span class="ml-1 text-cu-ink">{{ $pendingUser->whatsapp_number ?: '-' }}</span>
                        </div>
                        <div>
                            <span class="text-cu-muted">Mendaftar:</span>
                            <span class="ml-1 text-cu-ink">{{ $pendingUser->created_at->diffForHumans() }}</span>
                        </div>
                    </div>

                    @if($pendingUser->registration_note)
                        <div class="mt-3 rounded-lg border border-cu-line bg-cu-panel-soft p-3">
                            <p class="mb-1 text-xs text-cu-muted">Catatan registrasi:</p>
                            <p class="text-sm text-cu-ink">{{ $pendingUser->registration_note }}</p>
                        </div>
                    @endif
                </div>

                <div class="flex shrink-0 flex-col gap-2 md:w-56">
                    <select wire:model="selectedRole"
                        class="block w-full rounded-lg border border-cu-border bg-cu-surface p-2 text-sm text-cu-ink focus:border-cu-ink focus:ring-cu-ink">
                        <option value="">Pilih Role</option>
                        @foreach($roles as $role)
                            <option value="{{ $role->name }}">{{ $role->name }}</option>
                        @endforeach
                    </select>

                    <button wire:click="approve({{ $pendingUser->id }})"
                        class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-cu-success bg-cu-success px-4 text-sm font-medium text-cu-surface transition-colors duration-200 hover:border-cu-success-hover hover:bg-cu-success-hover">
                        <x-material-icon class="cu-icon-check" />
                        Setujui Akun
                    </button>

                    <button wire:click="reject({{ $pendingUser->id }})"
                        wire:confirm="Akun ini akan ditolak dan dihapus dari sistem. Yakin?"
                        class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-cu-danger/30 bg-cu-danger-soft px-4 text-sm font-medium text-cu-danger transition-colors duration-200 hover:border-cu-danger hover:bg-cu-danger hover:text-cu-surface">
                        <x-material-icon class="cu-icon-close" />
                        Tolak Akun
                    </button>
                </div>
            </div>
        </x-app-panel>
    @empty
        <x-app-panel class="p-12 text-center">
            <x-material-icon size="xl" class="cu-icon-how-to-reg mx-auto mb-4 text-cu-soft" />
            <p class="text-cu-muted">Tidak ada akun yang menunggu persetujuan.</p>
        </x-app-panel>
    @endforelse

    @if($pendingUsers->hasPages())
        <div class="mt-4">
            {{ $pendingUsers->links() }}
        </div>
    @endif
</div>
