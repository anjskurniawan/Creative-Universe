<?php

namespace App\Livewire\Core;

use App\Actions\Core\ApproveUserAction;
use App\Actions\Core\RejectUserAction;
use App\Models\Core\User;
use Livewire\Component;
use Livewire\WithPagination;
use Spatie\Permission\Models\Role;

/**
 * PendingUsers — Livewire component untuk halaman persetujuan akun.
 *
 * Auto-polling setiap 10 detik agar data real-time tanpa reload.
 * Approval/rejection langsung di-handle via Livewire actions.
 */
class PendingUsers extends Component
{
    use WithPagination;

    public string $selectedRole = '';

    public function approve(int $userId): void
    {
        $user = User::findOrFail($userId);

        if (empty($this->selectedRole)) {
            session()->flash('error', 'Pilih role terlebih dahulu.');
            return;
        }

        $roleName = $this->selectedRole;

        app(ApproveUserAction::class)->handle($user, auth()->user(), $roleName);

        $this->selectedRole = '';
        session()->flash('success', "Akun {$user->name} telah disetujui sebagai {$roleName}.");
    }

    public function reject(int $userId): void
    {
        $user = User::findOrFail($userId);
        $name = $user->name;

        app(RejectUserAction::class)->handle($user, auth()->user());

        session()->flash('success', "Akun {$name} telah ditolak.");
    }

    public function render()
    {
        return view('livewire.core.pending-users', [
            'pendingUsers' => User::pending()
                ->latest()
                ->paginate(10),
            'roles' => Role::orderBy('name')->get(),
        ]);
    }
}
