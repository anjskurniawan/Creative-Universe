<div>
    @if (session()->has('success'))
        <x-app-alert type="success" class="mb-4">
            {{ session('success') }}
        </x-app-alert>
    @endif

    @if (session()->has('error'))
        <x-app-alert type="danger" class="mb-4">
            {{ session('error') }}
        </x-app-alert>
    @endif

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h2 class="text-lg font-semibold text-cu-ink">Role & Permission</h2>
            <p class="text-sm text-cu-muted">Atur role dinamis dan akses aplikasi dari satu tempat.</p>
        </div>

        <button type="button" wire:click="openCreateModal"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-4 text-sm font-medium text-cu-surface transition-colors hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2">
            <x-material-icon name="add" />
            Buat Role
        </button>
    </div>

    <div class="overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-cu-muted">
                <thead class="border-b border-cu-line bg-cu-panel-soft text-xs uppercase text-cu-muted">
                    <tr>
                        <th class="px-6 py-3">Role</th>
                        <th class="px-6 py-3">Permission</th>
                        <th class="px-6 py-3">User Aktif</th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($roles as $role)
                        <tr class="border-b border-cu-line transition-colors hover:bg-cu-panel-soft" wire:key="role-row-{{ $role->id }}">
                            <td class="px-6 py-4 align-top">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="font-medium text-cu-ink">{{ $role->name }}</span>
                                    @if (in_array($role->name, $protectedRoles, true))
                                        <span class="inline-flex items-center gap-1 rounded-full border border-cu-warning/20 bg-cu-warning-soft px-2 py-0.5 text-xs font-medium text-cu-warning">
                                            <x-material-icon name="lock" size="xs" />
                                            Dilindungi
                                        </span>
                                    @endif
                                </div>
                                <p class="mt-1 text-xs text-cu-muted">Guard: {{ $role->guard_name }}</p>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <div class="flex max-w-3xl flex-wrap gap-2">
                                    @forelse ($role->permissions as $permission)
                                        <span class="rounded-full border border-cu-info/20 bg-cu-info-soft px-2.5 py-1 text-xs font-medium text-cu-info">
                                            {{ $permission->name }}
                                        </span>
                                    @empty
                                        <span class="text-sm text-cu-muted">Belum ada permission.</span>
                                    @endforelse
                                </div>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <span class="text-cu-ink">{{ $role->active_users_count }}</span>
                                <span class="text-xs text-cu-muted">/ {{ $role->users_count }} total</span>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <div class="flex justify-end gap-2">
                                    <button type="button" wire:click="editRole({{ $role->id }})"
                                        class="inline-flex size-10 items-center justify-center rounded-full border border-cu-border text-cu-ink transition-colors hover:border-cu-border-hover hover:bg-cu-panel-soft focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2">
                                        <x-material-icon name="edit" size="xs" />
                                        <span class="sr-only">Ubah permission {{ $role->name }}</span>
                                    </button>

                                    <button type="button" wire:click="confirmDeleteRole({{ $role->id }})"
                                        @disabled(in_array($role->name, $protectedRoles, true))
                                        class="inline-flex size-10 items-center justify-center rounded-full border border-cu-danger/30 text-cu-danger transition-colors hover:bg-cu-danger-soft focus:outline-none focus:ring-2 focus:ring-cu-danger focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">
                                        <x-material-icon name="delete" size="xs" />
                                        <span class="sr-only">Hapus {{ $role->name }}</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-12 text-center text-cu-muted">
                                Belum ada role yang terdaftar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if ($showRoleModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-cu-overlay/40 px-4 py-6 backdrop-blur-sm">
            <div class="w-full max-w-2xl rounded-lg border border-cu-line bg-cu-panel shadow-xl">
                <form wire:submit.prevent="{{ $editingRoleId ? 'updateRolePermissions' : 'createRole' }}">
                    <div class="border-b border-cu-line px-6 py-4">
                        <h3 class="text-lg font-semibold text-cu-ink">
                            {{ $editingRoleId ? 'Ubah Permission Role' : 'Buat Role Baru' }}
                        </h3>
                        <p class="mt-1 text-sm text-cu-muted">
                            {{ $editingRoleId ? 'Nama role inti tidak diubah dari panel ini.' : 'Gunakan format Title Case, contoh: Koordinator Creative.' }}
                        </p>
                    </div>

                    <div class="space-y-5 px-6 py-5">
                        <div>
                            <label for="role-name" class="mb-2 block text-sm font-medium text-cu-ink">Nama Role</label>
                            <input id="role-name" type="text" wire:model="form.name" @disabled((bool) $editingRoleId)
                                class="block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
                                placeholder="Koordinator Creative">
                            @error('form.name')
                                <p class="mt-2 text-sm text-cu-danger">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <div class="mb-3 flex items-center justify-between">
                                <label class="block text-sm font-medium text-cu-ink">Permission</label>
                                <span class="text-xs text-cu-muted">{{ count($form->permissions) }} dipilih</span>
                            </div>

                            <div class="max-h-72 overflow-y-auto rounded-lg border border-cu-line bg-cu-panel-soft p-3">
                                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    @foreach ($permissions as $permission)
                                        <label class="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink transition-colors hover:border-cu-border-hover">
                                            <input type="checkbox" wire:model="form.permissions" value="{{ $permission->name }}"
                                                class="size-4 rounded border-cu-border text-cu-ink focus:ring-cu-ink">
                                            <span>{{ $permission->name }}</span>
                                        </label>
                                    @endforeach
                                </div>
                            </div>

                            @error('form.permissions')
                                <p class="mt-2 text-sm text-cu-danger">{{ $message }}</p>
                            @enderror
                            @error('form.permissions.*')
                                <p class="mt-2 text-sm text-cu-danger">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-3 border-t border-cu-line px-6 py-4">
                        <button type="button" wire:click="closeRoleModal"
                            class="inline-flex h-10 items-center justify-center rounded-full border border-cu-border bg-cu-surface px-5 text-sm font-medium text-cu-ink transition-colors hover:border-cu-border-hover hover:bg-cu-panel-soft focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2">
                            Batal
                        </button>
                        <button type="submit" wire:loading.attr="disabled"
                            wire:target="{{ $editingRoleId ? 'updateRolePermissions' : 'createRole' }}"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium text-cu-surface transition-colors hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70">
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
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-cu-overlay/40 px-4 py-6 backdrop-blur-sm">
            <div class="w-full max-w-md rounded-lg border border-cu-line bg-cu-panel shadow-xl">
                <div class="border-b border-cu-line px-6 py-4">
                    <h3 class="text-lg font-semibold text-cu-ink">Hapus Role</h3>
                    <p class="mt-1 text-sm text-cu-muted">Role akan dihapus permanen dari sistem.</p>
                </div>

                <div class="px-6 py-5">
                    <p class="text-sm text-cu-muted">
                        Yakin ingin menghapus role <span class="font-semibold text-cu-ink">{{ $deletingRoleName }}</span>?
                    </p>
                </div>

                <div class="flex items-center justify-end gap-3 border-t border-cu-line px-6 py-4">
                    <button type="button" wire:click="closeDeleteModal"
                        class="inline-flex h-10 items-center justify-center rounded-full border border-cu-border bg-cu-surface px-5 text-sm font-medium text-cu-ink transition-colors hover:border-cu-border-hover hover:bg-cu-panel-soft focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2">
                        Batal
                    </button>
                    <button type="button" wire:click="deleteRole" wire:loading.attr="disabled" wire:target="deleteRole"
                        class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-danger bg-cu-danger px-5 text-sm font-medium text-cu-surface transition-colors hover:border-cu-danger-hover hover:bg-cu-danger-hover focus:outline-none focus:ring-2 focus:ring-cu-danger focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70">
                        <span wire:loading.remove wire:target="deleteRole">Hapus Role</span>
                        <span wire:loading wire:target="deleteRole">Menghapus...</span>
                    </button>
                </div>
            </div>
        </div>
    @endif
</div>
