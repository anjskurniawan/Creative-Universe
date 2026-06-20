<?php

namespace App\Livewire\Core;

use App\Actions\Core\CreateRoleAction;
use App\Actions\Core\DeleteRoleAction;
use App\Actions\Core\UpdateRolePermissionsAction;
use App\Livewire\Forms\Core\RoleForm;
use Illuminate\Contracts\View\View;
use Livewire\Component;
use RuntimeException;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleManager extends Component
{
    public RoleForm $form;

    public bool $showRoleModal = false;

    public bool $showDeleteModal = false;

    public ?int $editingRoleId = null;

    public ?int $deletingRoleId = null;

    public string $deletingRoleName = '';

    public function mount(): void
    {
        $this->authorizeRoleManagement();
    }

    public function openCreateModal(): void
    {
        $this->authorizeRoleManagement();

        $this->resetErrorBag();
        $this->form->reset();
        $this->editingRoleId = null;
        $this->showRoleModal = true;
    }

    public function editRole(int $roleId): void
    {
        $this->authorizeRoleManagement();

        $role = Role::with('permissions')->findOrFail($roleId);

        $this->resetErrorBag();
        $this->editingRoleId = $role->id;
        $this->form->name = $role->name;
        $this->form->permissions = $role->permissions->pluck('name')->all();
        $this->showRoleModal = true;
    }

    public function closeRoleModal(): void
    {
        $this->showRoleModal = false;
        $this->editingRoleId = null;
        $this->form->reset();
        $this->resetErrorBag();
    }

    public function createRole(CreateRoleAction $action): void
    {
        $this->authorizeRoleManagement();

        $this->form->name = trim((string) preg_replace('/\s+/', ' ', $this->form->name));
        $this->form->validate();

        $role = $action->handle($this->form, auth()->user());

        $this->closeRoleModal();
        session()->flash('success', "Role {$role->name} berhasil dibuat.");
    }

    public function updateRolePermissions(UpdateRolePermissionsAction $action): void
    {
        $this->authorizeRoleManagement();

        $this->validate($this->form->permissionRules(), $this->form->messages());

        $role = Role::findOrFail($this->editingRoleId);

        $action->handle($role, $this->form->permissions, auth()->user());

        $this->closeRoleModal();
        session()->flash('success', "Permission role {$role->name} berhasil diperbarui.");
    }

    public function confirmDeleteRole(int $roleId): void
    {
        $this->authorizeRoleManagement();

        $role = Role::findOrFail($roleId);

        $this->deletingRoleId = $role->id;
        $this->deletingRoleName = $role->name;
        $this->showDeleteModal = true;
    }

    public function closeDeleteModal(): void
    {
        $this->showDeleteModal = false;
        $this->deletingRoleId = null;
        $this->deletingRoleName = '';
    }

    public function deleteRole(DeleteRoleAction $action): void
    {
        $this->authorizeRoleManagement();

        $role = Role::findOrFail($this->deletingRoleId);

        try {
            $action->handle($role, auth()->user());
            session()->flash('success', "Role {$role->name} berhasil dihapus.");
            $this->closeDeleteModal();
        } catch (RuntimeException $exception) {
            session()->flash('error', $exception->getMessage());
            $this->closeDeleteModal();
        }
    }

    public function render(): View
    {
        return view('livewire.core.role-manager', [
            'roles' => Role::with('permissions')
                ->withCount([
                    'users',
                    'users as active_users_count' => fn ($query) => $query->where('is_active', true),
                ])
                ->orderBy('name')
                ->get(),
            'permissions' => Permission::orderBy('name')->get(),
            'protectedRoles' => DeleteRoleAction::PROTECTED_ROLES,
        ]);
    }

    private function authorizeRoleManagement(): void
    {
        abort_unless(auth()->user()?->can('manage-roles'), 403);
    }
}
