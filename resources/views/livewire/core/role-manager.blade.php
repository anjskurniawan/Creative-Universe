<div>
    @if (session()->has('success'))
        <div class="mb-4 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm" role="alert">
            {{ session('success') }}
        </div>
    @endif

    @if (session()->has('error'))
        <div class="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm" role="alert">
            {{ session('error') }}
        </div>
    @endif

    <div class="mb-4 flex items-center justify-between gap-3">
        <div>
            <h2 class="text-lg font-semibold text-white">Role & Permission</h2>
            <p class="text-sm text-gray-400">Atur role dinamis dan akses aplikasi dari satu tempat.</p>
        </div>

        <button type="button"
            wire:click="openCreateModal"
            class="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Buat Role
        </button>
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800/50">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-400">
                <thead class="border-b border-gray-700/50 bg-gray-800/80 text-xs uppercase text-gray-400">
                    <tr>
                        <th class="px-6 py-3">Role</th>
                        <th class="px-6 py-3">Permission</th>
                        <th class="px-6 py-3">User Aktif</th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($roles as $role)
                        <tr class="border-b border-gray-700/30 transition-colors hover:bg-gray-700/20" wire:key="role-row-{{ $role->id }}">
                            <td class="px-6 py-4 align-top">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="font-medium text-white">{{ $role->name }}</span>
                                    @if (in_array($role->name, $protectedRoles, true))
                                        <span class="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300">
                                            Dilindungi
                                        </span>
                                    @endif
                                </div>
                                <p class="mt-1 text-xs text-gray-500">Guard: {{ $role->guard_name }}</p>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <div class="flex max-w-3xl flex-wrap gap-2">
                                    @forelse ($role->permissions as $permission)
                                        <span class="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
                                            {{ $permission->name }}
                                        </span>
                                    @empty
                                        <span class="text-sm text-gray-500">Belum ada permission.</span>
                                    @endforelse
                                </div>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <span class="text-gray-200">{{ $role->active_users_count }}</span>
                                <span class="text-xs text-gray-500">/ {{ $role->users_count }} total</span>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <div class="flex justify-end gap-2">
                                    <button type="button"
                                        wire:click="editRole({{ $role->id }})"
                                        class="inline-flex items-center justify-center rounded-md border border-gray-600 px-3 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                        </svg>
                                        <span class="sr-only">Ubah permission {{ $role->name }}</span>
                                    </button>

                                    <button type="button"
                                        wire:click="confirmDeleteRole({{ $role->id }})"
                                        @disabled(in_array($role->name, $protectedRoles, true))
                                        class="inline-flex items-center justify-center rounded-md border border-red-600/30 px-3 py-2 text-xs font-medium text-red-300 transition-colors hover:bg-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-40">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21.75H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        <span class="sr-only">Hapus {{ $role->name }}</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                                Belum ada role yang terdaftar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if ($showRoleModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
            <div class="w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
                <form wire:submit.prevent="{{ $editingRoleId ? 'updateRolePermissions' : 'createRole' }}">
                    <div class="border-b border-gray-700 px-6 py-4">
                        <h3 class="text-lg font-semibold text-white">
                            {{ $editingRoleId ? 'Ubah Permission Role' : 'Buat Role Baru' }}
                        </h3>
                        <p class="mt-1 text-sm text-gray-400">
                            {{ $editingRoleId ? 'Nama role inti tidak diubah dari panel ini.' : 'Gunakan format Title Case, contoh: Koordinator Creative.' }}
                        </p>
                    </div>

                    <div class="space-y-5 px-6 py-5">
                        <div>
                            <label for="role-name" class="mb-2 block text-sm font-medium text-gray-200">Nama Role</label>
                            <input id="role-name"
                                type="text"
                                wire:model="form.name"
                                @disabled((bool) $editingRoleId)
                                class="block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-800/60 disabled:text-gray-500"
                                placeholder="Koordinator Creative">
                            @error('form.name')
                                <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <div class="mb-3 flex items-center justify-between">
                                <label class="block text-sm font-medium text-gray-200">Permission</label>
                                <span class="text-xs text-gray-500">{{ count($form->permissions) }} dipilih</span>
                            </div>

                            <div class="max-h-72 overflow-y-auto rounded-md border border-gray-700 bg-gray-950/40 p-3">
                                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    @foreach ($permissions as $permission)
                                        <label class="flex items-center gap-3 rounded-md border border-gray-700/60 bg-gray-800/40 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-blue-500/40 hover:bg-gray-800">
                                            <input type="checkbox"
                                                wire:model="form.permissions"
                                                value="{{ $permission->name }}"
                                                class="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600">
                                            <span>{{ $permission->name }}</span>
                                        </label>
                                    @endforeach
                                </div>
                            </div>

                            @error('form.permissions')
                                <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                            @enderror
                            @error('form.permissions.*')
                                <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-3 border-t border-gray-700 px-6 py-4">
                        <button type="button"
                            wire:click="closeRoleModal"
                            class="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Batal
                        </button>
                        <button type="submit"
                            wire:loading.attr="disabled"
                            wire:target="{{ $editingRoleId ? 'updateRolePermissions' : 'createRole' }}"
                            class="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70">
                            <span wire:loading.remove wire:target="{{ $editingRoleId ? 'updateRolePermissions' : 'createRole' }}">
                                {{ $editingRoleId ? 'Simpan Permission' : 'Buat Role' }}
                            </span>
                            <span wire:loading wire:target="{{ $editingRoleId ? 'updateRolePermissions' : 'createRole' }}">
                                Menyimpan...
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endif

    @if ($showDeleteModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
            <div class="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
                <div class="border-b border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-semibold text-white">Hapus Role</h3>
                    <p class="mt-1 text-sm text-gray-400">Role akan dihapus permanen dari sistem.</p>
                </div>

                <div class="px-6 py-5">
                    <p class="text-sm text-gray-300">
                        Yakin ingin menghapus role <span class="font-semibold text-white">{{ $deletingRoleName }}</span>?
                    </p>
                </div>

                <div class="flex items-center justify-end gap-3 border-t border-gray-700 px-6 py-4">
                    <button type="button"
                        wire:click="closeDeleteModal"
                        class="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Batal
                    </button>
                    <button type="button"
                        wire:click="deleteRole"
                        wire:loading.attr="disabled"
                        wire:target="deleteRole"
                        class="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-70">
                        <span wire:loading.remove wire:target="deleteRole">Hapus Role</span>
                        <span wire:loading wire:target="deleteRole">Menghapus...</span>
                    </button>
                </div>
            </div>
        </div>
    @endif
</div>
