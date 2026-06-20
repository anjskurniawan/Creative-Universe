<?php

namespace App\Livewire\Core;

use App\Models\Core\User;
use Livewire\Component;
use Livewire\WithPagination;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Contracts\View\View;

class UserManager extends Component
{
    use WithPagination;

    public string $search = '';

    // Edit Authorization Modal State
    public bool $showEditOtorisasiModal = false;
    public ?int $editingUserId = null;
    public ?string $editingUserName = null;
    public ?string $editingUserEmail = null;
    public array $selectedRoles = [];
    public array $selectedPermissions = [];

    // Whitelist Manager Permissions Modal State
    public bool $showWhitelistModal = false;
    public array $whitelistedPermissions = [];

    // Kelola Akun Modal State
    public bool $showKelolaAkunModal = false;
    public ?int $managingUserId = null;
    public ?string $managingUserName = null;
    public ?string $managingUserEmail = null;
    public bool $managingUserIsActive = false;
    public string $newPassword = '';
    public string $newPassword_confirmation = '';
    
    // Root-only audit data
    public array $userActivities = [];
    public array $userSessions = [];

    protected $queryString = [
        'search' => ['except' => ''],
    ];

    public function updatingSearch(): void
    {
        $this->resetPage();
    }

    public function mount(): void
    {
        abort_unless(auth()->user()?->can('manage-users'), 403);
    }

    public function openEditOtorisasi(int $userId): void
    {
        $user = User::findOrFail($userId);

        // Restrict Manager from editing Root users
        if (!auth()->user()->hasRole('Root') && $user->hasRole('Root')) {
            session()->flash('error', 'Manajer tidak dapat mengedit otorisasi pengguna Root.');
            return;
        }

        $this->editingUserId = $user->id;
        $this->editingUserName = $user->name;
        $this->editingUserEmail = $user->email;
        $this->selectedRoles = $user->roles->pluck('name')->all();
        $this->selectedPermissions = $user->permissions->pluck('name')->all();
        $this->showEditOtorisasiModal = true;
    }

    public function closeEditOtorisasi(): void
    {
        $this->showEditOtorisasiModal = false;
        $this->reset(['editingUserId', 'editingUserName', 'editingUserEmail', 'selectedRoles', 'selectedPermissions']);
    }

    public function saveOtorisasi(): void
    {
        $user = User::findOrFail($this->editingUserId);
        $currentUser = auth()->user();

        // Double check permissions to edit
        if (!$currentUser->hasRole('Root') && !$currentUser->hasRole('Manajer')) {
            abort(403);
        }

        if (!$currentUser->hasRole('Root') && $user->hasRole('Root')) {
            session()->flash('error', 'Manajer tidak dapat mengedit otorisasi pengguna Root.');
            return;
        }

        // Role rules for manager
        if (!$currentUser->hasRole('Root')) {
            if (in_array('Root', $this->selectedRoles, true)) {
                session()->flash('error', 'Manajer tidak dapat memberikan peran Root kepada siapa pun.');
                return;
            }
        }

        // Permission rules for manager
        if (!$currentUser->hasRole('Root')) {
            // Get manager whitelisted permissions
            $rootUser = User::role('Root')->first();
            $whitelisted = $rootUser ? $rootUser->getSetting('manageable_manager_permissions', []) : [];

            // Check if any selected permission is not allowed
            foreach ($this->selectedPermissions as $perm) {
                // Must be in whitelist
                if (!in_array($perm, $whitelisted, true)) {
                    session()->flash('error', "Anda tidak memiliki wewenang untuk memberikan permission '{$perm}'.");
                    return;
                }
                // Must not be higher than manager's own permission
                if (!$currentUser->hasPermissionTo($perm)) {
                    session()->flash('error', "Anda tidak dapat memberikan permission '{$perm}' karena Anda sendiri tidak memilikinya.");
                    return;
                }
            }
        }

        $user->syncRoles($this->selectedRoles);
        $user->syncPermissions($this->selectedPermissions);

        // Clear Spatie permissions cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Log action
        activity('rbac')
            ->causedBy($currentUser)
            ->performedOn($user)
            ->withProperties([
                'roles' => $this->selectedRoles,
                'permissions' => $this->selectedPermissions,
                'ip' => request()->ip(),
            ])
            ->log("[CORE] User otorisasi updated: {$user->email}");

        $this->closeEditOtorisasi();
        session()->flash('success', "Otorisasi pengguna {$user->name} berhasil diperbarui.");
    }

    public function openWhitelistModal(): void
    {
        abort_unless(auth()->user()->hasRole('Root'), 403);

        $rootUser = auth()->user();
        $this->whitelistedPermissions = $rootUser->getSetting('manageable_manager_permissions', []);
        $this->showWhitelistModal = true;
    }

    public function closeWhitelistModal(): void
    {
        $this->showWhitelistModal = false;
        $this->reset(['whitelistedPermissions']);
    }

    public function saveWhitelist(): void
    {
        abort_unless(auth()->user()->hasRole('Root'), 403);

        $rootUser = auth()->user();
        $rootUser->setSetting('manageable_manager_permissions', $this->whitelistedPermissions);

        $this->closeWhitelistModal();
        session()->flash('success', 'Daftar izin yang dikelola Manajer berhasil diperbarui.');
    }

    public function openKelolaAkun(int $userId): void
    {
        $user = User::findOrFail($userId);
        $currentUser = auth()->user();

        // Restrict Manager from managing Root users
        if (!$currentUser->hasRole('Root') && $user->hasRole('Root')) {
            session()->flash('error', 'Manajer tidak dapat mengelola akun pengguna Root.');
            return;
        }

        $this->managingUserId = $user->id;
        $this->managingUserName = $user->name;
        $this->managingUserEmail = $user->email;
        $this->managingUserIsActive = $user->is_active;
        $this->newPassword = '';
        $this->newPassword_confirmation = '';

        // If root, load user sessions and activity logs
        if ($currentUser->hasRole('Root')) {
            $this->userSessions = \Illuminate\Support\Facades\DB::table('sessions')
                ->where('user_id', $user->id)
                ->orderBy('last_activity', 'desc')
                ->get()
                ->toArray();

            $this->userActivities = \Spatie\Activitylog\Models\Activity::where('causer_id', $user->id)
                ->latest()
                ->take(10)
                ->get()
                ->toArray();
        } else {
            $this->userSessions = [];
            $this->userActivities = [];
        }

        $this->showKelolaAkunModal = true;
    }

    public function closeKelolaAkun(): void
    {
        $this->showKelolaAkunModal = false;
        $this->reset(['managingUserId', 'managingUserName', 'managingUserEmail', 'managingUserIsActive', 'newPassword', 'newPassword_confirmation', 'userActivities', 'userSessions']);
        $this->resetErrorBag();
    }

    public function saveKelolaAkun(): void
    {
        $currentUser = auth()->user();
        
        // Double check permissions to edit
        if (!$currentUser->hasRole('Root') && !$currentUser->hasRole('Manajer')) {
            abort(403);
        }

        $user = User::findOrFail($this->managingUserId);

        if (!$currentUser->hasRole('Root') && $user->hasRole('Root')) {
            session()->flash('error', 'Manajer tidak dapat mengelola akun pengguna Root.');
            return;
        }

        // Validate password if filled
        if (!empty($this->newPassword)) {
            $this->validate([
                'newPassword' => 'string|min:8|confirmed',
            ], [
                'newPassword.min' => 'Kata sandi baru minimal 8 karakter.',
                'newPassword.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            ]);

            $user->password = bcrypt($this->newPassword);
        }

        // Check if is_active status changed
        $statusChanged = $user->is_active !== $this->managingUserIsActive;
        if ($statusChanged) {
            $user->is_active = $this->managingUserIsActive;
            
            // If deactivated, revoke all their active sessions
            if (!$this->managingUserIsActive) {
                \Illuminate\Support\Facades\DB::table('sessions')
                    ->where('user_id', $user->id)
                    ->delete();
            }
        }

        $user->save();

        // Log action
        activity('user-management')
            ->causedBy($currentUser)
            ->performedOn($user)
            ->withProperties([
                'status_changed' => $statusChanged,
                'is_active' => $user->is_active,
                'password_reset' => !empty($this->newPassword),
                'ip' => request()->ip(),
            ])
            ->log("[CORE] User account settings managed: {$user->email}");

        if ($statusChanged) {
            event(new \App\Events\Core\UserStatusUpdated());
        }

        $this->closeKelolaAkun();
        session()->flash('success', "Pengaturan akun {$user->name} berhasil diperbarui.");
    }

    public function render(): View
    {
        $currentUser = auth()->user();

        $users = User::whereNot(function($q) {
                $q->where('is_active', false)->whereNull('approved_by');
            })
            ->where(function($query) {
                $query->where('name', 'like', '%'.$this->search.'%')
                      ->orWhere('username', 'like', '%'.$this->search.'%')
                      ->orWhere('email', 'like', '%'.$this->search.'%');
            })
            ->with(['roles', 'permissions'])
            ->latest()
            ->paginate(15);

        // For managers: get manageable permissions (whitelisted + manager possesses)
        $manageablePermissionsList = [];
        if (!$currentUser->hasRole('Root') && $currentUser->hasRole('Manajer')) {
            $rootUser = User::role('Root')->first();
            $whitelisted = $rootUser ? $rootUser->getSetting('manageable_manager_permissions', []) : [];

            $allPermissions = Permission::orderBy('name')->get();
            foreach ($allPermissions as $perm) {
                if (in_array($perm->name, $whitelisted, true) && $currentUser->hasPermissionTo($perm->name)) {
                    $manageablePermissionsList[] = $perm;
                }
            }
        } else {
            $manageablePermissionsList = Permission::orderBy('name')->get();
        }

        // Roles list for managers (exclude Root)
        $rolesList = Role::orderBy('name')->get();
        if (!$currentUser->hasRole('Root')) {
            $rolesList = $rolesList->reject(fn($role) => $role->name === 'Root');
        }

        return view('livewire.core.user-manager', [
            'users' => $users,
            'rolesList' => $rolesList,
            'permissionsList' => Permission::orderBy('name')->get(),
            'manageablePermissionsList' => $manageablePermissionsList,
        ]);
    }
}
