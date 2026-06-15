@section('title', 'Dashboard')

<x-app-layout>
    <x-slot name="header">
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-gray-400 text-sm mt-1">Selamat datang kembali, {{ auth()->user()->name }}.</p>
    </x-slot>

    {{-- Livewire: Stats Cards (auto-polling setiap 30 detik) --}}
    <livewire:core.dashboard-stats />

    <!-- Quick Actions -->
    <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Aksi Cepat</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <a href="{{ route('profile.edit') }}" wire:navigate
               class="flex items-center gap-3 p-3 rounded-md bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/30 hover:border-gray-600 transition-all duration-200">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span class="text-sm text-gray-300">Edit Profil</span>
            </a>

            @can('manage-users')
            <a href="{{ route('core.users.index') }}" wire:navigate
               class="flex items-center gap-3 p-3 rounded-md bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/30 hover:border-gray-600 transition-all duration-200">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span class="text-sm text-gray-300">Kelola User</span>
            </a>
            @endcan

            @can('approve-users')
            <a href="{{ route('core.users.pending') }}" wire:navigate
               class="flex items-center gap-3 p-3 rounded-md bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/30 hover:border-gray-600 transition-all duration-200">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-300">Persetujuan Akun</span>
            </a>
            @endcan
        </div>
    </div>
</x-app-layout>
