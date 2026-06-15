@section('title', 'Kelola User')

<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-white">Kelola User</h1>
                <p class="text-gray-400 text-sm mt-1">Daftar semua user aktif di Creative Universe.</p>
            </div>
            @can('approve-users')
            <a href="{{ route('core.users.pending') }}" wire:navigate
               class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Akun Pending
            </a>
            @endcan
        </div>
    </x-slot>

    <!-- User Table -->
    <div class="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-400">
                <thead class="text-xs text-gray-400 uppercase bg-gray-800/80 border-b border-gray-700/50">
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
                        <tr class="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <img class="w-8 h-8 rounded-full object-cover"
                                         src="{{ $user->avatar_path ? asset('storage/' . $user->avatar_path) : 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&background=0D8ABC&color=fff&size=32' }}"
                                         alt="{{ $user->name }}">
                                    <span class="text-white font-medium">{{ $user->name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-300">{{ $user->username }}</td>
                            <td class="px-6 py-4">{{ $user->email }}</td>
                            <td class="px-6 py-4">
                                @foreach($user->roles as $role)
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        {{ $role->name === 'Superadmin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                           ($role->name === 'Manajer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                           'bg-green-500/10 text-green-400 border border-green-500/20') }}">
                                        {{ $role->name }}
                                    </span>
                                @endforeach
                            </td>
                            <td class="px-6 py-4 text-gray-500 text-xs">
                                {{ $user->created_at->format('d M Y') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                Belum ada user yang terdaftar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($users->hasPages())
            <div class="px-6 py-4 border-t border-gray-700/50">
                {{ $users->links() }}
            </div>
        @endif
    </div>
</x-app-layout>
