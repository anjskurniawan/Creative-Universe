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
                    <x-material-icon name="pending_actions" />
                    Akun Pending
                </a>
            @endcan
        </div>
    </x-slot>

    <div class="overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-cu-muted">
                <thead class="border-b border-cu-line bg-cu-panel-soft text-xs uppercase text-cu-muted">
                    <tr>
                        <th class="px-6 py-3">Nama</th>
                        <th class="px-6 py-3">Username</th>
                        <th class="px-6 py-3">Email</th>
                        <th class="px-6 py-3">Role</th>
                        <th class="px-6 py-3">Bergabung</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($users as $user)
                        <tr class="border-b border-cu-line transition-colors hover:bg-cu-panel-soft">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <img class="size-8 rounded-full object-cover"
                                        src="{{ $user->avatar_path ? asset('storage/' . $user->avatar_path) : 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&background=0A0A0A&color=fff&size=32' }}"
                                        alt="{{ $user->name }}">
                                    <span class="font-medium text-cu-ink">{{ $user->name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-cu-ink">{{ $user->username }}</td>
                            <td class="px-6 py-4">{{ $user->email }}</td>
                            <td class="px-6 py-4">
                                <div class="flex flex-wrap gap-2">
                                    @foreach($user->roles as $role)
                                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                            {{ $role->name === 'Superadmin' ? 'border border-cu-danger/20 bg-cu-danger-soft text-cu-danger' :
                                               ($role->name === 'Manajer' ? 'border border-cu-info/20 bg-cu-info-soft text-cu-info' :
                                               'border border-cu-success/20 bg-cu-success-soft text-cu-success') }}">
                                            {{ $role->name }}
                                        </span>
                                    @endforeach
                                </div>
                            </td>
                            <td class="px-6 py-4 text-xs text-cu-muted">
                                {{ $user->created_at->format('d M Y') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-cu-muted">
                                Belum ada user yang terdaftar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($users->hasPages())
            <div class="border-t border-cu-line px-6 py-4">
                {{ $users->links() }}
            </div>
        @endif
    </div>
</x-app-layout>
