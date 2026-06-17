@section('title', 'Akun Pending')

<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-cu-ink">Akun Menunggu Persetujuan</h1>
                <p class="mt-1 text-sm text-cu-muted">Tinjau dan setujui atau tolak pendaftaran akun baru.</p>
            </div>

            <a href="{{ route('core.users.index') }}" wire:navigate
                class="inline-flex items-center gap-2 text-sm font-medium text-cu-muted transition-colors duration-200 hover:text-cu-ink">
                <x-material-icon name="arrow_back" />
                Kembali ke Daftar User
            </a>
        </div>
    </x-slot>

    <livewire:core.pending-users />
</x-app-layout>
