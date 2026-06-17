<?php

namespace App\Livewire\Core;

use App\Models\Core\User;
use Livewire\Component;

/**
 * DashboardStats — Real-time dashboard statistics
 *
 * Polling setiap 30 detik untuk update stats.
 */
class DashboardStats extends Component
{
    public int $totalActiveUsers = 0;

    public int $totalPendingUsers = 0;

    public string $userRoles = '';

    public function mount(): void
    {
        $this->loadStats();
    }

    public function loadStats(): void
    {
        $user = auth()->user();
        $this->totalActiveUsers = User::active()->count();
        $this->totalPendingUsers = $user->can('approve-users') ? User::pending()->count() : 0;
        $this->userRoles = $user->roles->pluck('name')->join(', ') ?: 'Tidak ada role';
    }

    public function render()
    {
        return view('livewire.core.dashboard-stats');
    }
}
