@section('title', 'Kelola Role')

<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-white">Kelola Role</h1>
                <p class="mt-1 text-sm text-gray-400">Buat role baru dan atur permission akses Creative Universe.</p>
            </div>
        </div>
    </x-slot>

    <livewire:core.role-manager />
</x-app-layout>
