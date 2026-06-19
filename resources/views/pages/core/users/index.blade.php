@section('title', 'Kelola User')

<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-cu-ink">Kelola User</h1>
                <p class="mt-1 text-sm text-cu-muted">Daftar semua user aktif di Creative Universe.</p>
            </div>

            @can('approve-users')
                <a href="{{ route('core.users.pending') }}" wire:navigate
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-warning bg-cu-warning px-4 text-sm font-medium text-cu-surface transition-colors duration-200 hover:border-cu-warning-hover hover:bg-cu-warning-hover">
                    <x-material-icon class="cu-icon-pending-actions" />
                    Akun Pending
                </a>
            @endcan
        </div>
    </x-slot>

    @livewire('core.user-manager')
</x-app-layout>
