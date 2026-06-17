@section('title', 'Dashboard')

<x-app-layout>
    <x-slot name="header">
        <h1 class="text-2xl font-semibold text-cu-ink">Dashboard</h1>
        <p class="mt-1 text-sm text-cu-muted">Selamat datang kembali, {{ auth()->user()->name }}.</p>
    </x-slot>

    {{-- Livewire: Stats Cards (auto-polling setiap 30 detik) --}}
    <livewire:core.dashboard-stats />

    <!-- Quick Actions -->
    <x-app-panel padding="lg">
        <h2 class="mb-4 text-lg font-semibold text-cu-ink">Aksi Cepat</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <a href="{{ route('profile.edit') }}" wire:navigate
                class="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft">
                <x-material-icon name="person" size="sm" class="text-cu-muted" />
                <span class="text-sm font-medium text-cu-ink">Edit Profil</span>
            </a>

            @can('manage-users')
            <a href="{{ route('core.users.index') }}" wire:navigate
                class="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft">
                <x-material-icon name="group" size="sm" class="text-cu-muted" />
                <span class="text-sm font-medium text-cu-ink">Kelola User</span>
            </a>
            @endcan

            @can('approve-users')
            <a href="{{ route('core.users.pending') }}" wire:navigate
                class="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft">
                <x-material-icon name="how_to_reg" size="sm" class="text-cu-muted" />
                <span class="text-sm font-medium text-cu-ink">Persetujuan Akun</span>
            </a>
            @endcan
        </div>
    </x-app-panel>
</x-app-layout>
