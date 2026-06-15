@section('title', 'Akun Pending')

<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-white">Akun Menunggu Persetujuan</h1>
                <p class="text-gray-400 text-sm mt-1">Tinjau dan setujui atau tolak pendaftaran akun baru.</p>
            </div>
            <a href="{{ route('core.users.index') }}" wire:navigate
               class="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                ← Kembali ke Daftar User
            </a>
        </div>
    </x-slot>

    {{-- Livewire: auto-polling pending users --}}
    <livewire:core.pending-users />
</x-app-layout>
