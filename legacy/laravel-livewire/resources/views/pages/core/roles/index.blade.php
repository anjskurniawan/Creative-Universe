@section('title', 'Kelola Role')

<x-app-layout>
    <x-slot name="header">
        <div>
            <h1 class="text-2xl font-semibold text-cu-ink">Kelola Role</h1>
            <p class="mt-1 text-sm text-cu-muted">Buat role baru dan atur permission akses Creative Universe.</p>
        </div>
    </x-slot>

    <livewire:core.role-manager />
</x-app-layout>
