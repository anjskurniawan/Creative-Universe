<?php

namespace App\Http\Controllers\Core;

use App\Actions\Core\ApproveUserAction;
use App\Actions\Core\RejectUserAction;
use App\Http\Controllers\Controller;
use App\Models\Core\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * UserController — SRD v6.2 Seksi 8.2
 *
 * Manajemen user: daftar semua user, pending approval, approve, reject.
 * Akses: hanya Superadmin (manage-users, approve-users).
 */
class UserController extends Controller
{
    /**
     * Daftar semua user aktif.
     */
    public function index(): View
    {
        $users = User::active()
            ->with('roles')
            ->latest()
            ->paginate(20);

        return view('pages.core.users.index', compact('users'));
    }

    /**
     * Daftar user pending approval.
     * SRD v6.2 Seksi 8.2 step [4]
     */
    public function pending(): View
    {
        return view('pages.core.users.pending');
    }

    /**
     * Approve user pending.
     * SRD v6.2 Seksi 8.2 step [5a]
     */
    public function approve(Request $request, User $user, ApproveUserAction $action): RedirectResponse
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ], [
            'role.required' => 'Role wajib dipilih untuk user yang disetujui.',
            'role.exists' => 'Role yang dipilih tidak valid.',
        ]);

        $action->handle($user, $request->user(), $request->input('role'));

        return back()->with('success', "Akun {$user->name} berhasil disetujui.");
    }

    /**
     * Reject user pending.
     * SRD v6.2 Seksi 8.2 step [5b]
     */
    public function reject(User $user, RejectUserAction $action): RedirectResponse
    {
        $action->handle($user, request()->user());

        return back()->with('success', "Akun {$user->name} telah ditolak dan dihapus.");
    }
}
