<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Core\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UserController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $roleFilter = trim((string) $request->query('role', ''));
        $perPage = min(max($request->integer('per_page', 15), 1), 50);

        $query = User::query();

        if ($search !== '') {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter !== '') {
            $query->role($roleFilter);
        }

        $users = $query
            ->with(['roles', 'permissions'])
            ->latest()
            ->paginate($perPage);

        return $this->sendResponse(
            UserResource::collection($users)->response()->getData(true),
            'Daftar pengguna berhasil diambil.'
        );
    }

    public function options(Request $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $isRoot = $actor->hasRole('Root');

        $roles = Role::query()->orderBy('name')->pluck('name');
        if (! $isRoot) {
            $roles = $roles->reject(fn (string $role) => $role === 'Root')->values();
        }

        $allPermissions = Permission::query()->orderBy('name')->pluck('name');
        $whitelisted = [];
        $canManageUsers = $actor->can('manage-users');

        if ($isRoot && $canManageUsers) {
            $manageablePermissions = $allPermissions;
            $whitelisted = $actor->getSetting('manageable_manager_permissions', []);
        } elseif ($canManageUsers) {
            $rootUser = User::role('Root')->first();
            $whitelisted = $rootUser?->getSetting('manageable_manager_permissions', []) ?? [];
            $manageablePermissions = $allPermissions
                ->filter(fn (string $permission) => in_array($permission, $whitelisted, true)
                    && $actor->hasPermissionTo($permission))
                ->values();
        } else {
            $manageablePermissions = collect();
        }

        return $this->sendResponse([
            'roles' => $roles->values()->all(),
            'permissions' => $manageablePermissions->values()->all(),
            'all_permissions' => $isRoot && $canManageUsers ? $allPermissions->values()->all() : [],
            'manager_whitelist' => $isRoot && $canManageUsers ? array_values($whitelisted) : [],
            'is_root' => $isRoot,
        ], 'Opsi pengelolaan pengguna berhasil diambil.');
    }

    public function show(Request $request, User $user): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();

        if (! $this->canManageTarget($actor, $user)) {
            return $this->sendError('Manajer tidak dapat melihat detail pengguna Root.', [], 403);
        }

        $user->load(['roles', 'permissions']);
        $canViewAudit = $actor->hasRole('Root');

        return $this->sendResponse([
            'user' => (new UserResource($user))->resolve($request),
            'sessions' => $canViewAudit ? $this->sessionsFor($user) : [],
            'activities' => $canViewAudit ? $this->activitiesFor($user) : [],
            'can_view_audit' => $canViewAudit,
        ], 'Detail pengelolaan pengguna berhasil diambil.');
    }

    // Removed pending, approve, reject

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();

        if (! $this->canManageTarget($actor, $user)) {
            return $this->sendError('Manajer tidak dapat mengedit otorisasi pengguna Root.', [], 403);
        }

        $selectedRoles = $request->input('roles', []);
        $selectedPermissions = $request->input('permissions', []);
        $permissionsToSync = $selectedPermissions;

        if (! $actor->hasRole('Root')) {
            if (in_array('Root', $selectedRoles, true)) {
                return $this->sendError('Manajer tidak dapat memberikan peran Root kepada siapa pun.', [], 403);
            }

            $rootUser = User::role('Root')->first();
            $whitelisted = $rootUser?->getSetting('manageable_manager_permissions', []) ?? [];

            foreach ($selectedPermissions as $permission) {
                if (! in_array($permission, $whitelisted, true)) {
                    return $this->sendError("Anda tidak memiliki wewenang untuk memberikan permission '{$permission}'.", [], 403);
                }

                if (! $actor->hasPermissionTo($permission)) {
                    return $this->sendError("Anda tidak dapat memberikan permission '{$permission}' karena Anda sendiri tidak memilikinya.", [], 403);
                }
            }

            $protectedExistingPermissions = $user->permissions()
                ->pluck('name')
                ->reject(fn (string $permission) => in_array($permission, $whitelisted, true)
                    && $actor->hasPermissionTo($permission))
                ->all();
            $permissionsToSync = array_values(array_unique([
                ...$protectedExistingPermissions,
                ...$selectedPermissions,
            ]));
        }

        $statusChanged = DB::transaction(function () use ($request, $user, $actor, $selectedRoles, $permissionsToSync) {
            $user->fill([
                'name' => $request->string('name')->toString(),
                'email' => $request->string('email')->toString(),
                'whatsapp_number' => $request->input('whatsapp_number'),
                'updated_by' => $actor->id,
            ]);

            if ($request->filled('password')) {
                $user->password = Hash::make($request->string('password')->toString());
            }

            $user->save();
            $user->syncRoles($selectedRoles);
            $user->syncPermissions($permissionsToSync);
            app(PermissionRegistrar::class)->forgetCachedPermissions();

            activity('user-management')
                ->causedBy($actor)
                ->performedOn($user)
                ->withProperties([
                    'password_reset' => $request->filled('password'),
                    'roles' => $selectedRoles,
                    'permissions' => $permissionsToSync,
                    'ip' => $request->ip(),
                ])
                ->log("[CORE] User account settings managed: {$user->email}");

            return true;
        });

        $user->load(['roles', 'permissions']);

        return $this->sendResponse(
            (new UserResource($user))->resolve($request),
            "Pengaturan akun {$user->name} berhasil diperbarui."
        );
    }

    public function destroySession(Request $request, User $user, string $session): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();

        if (! $actor->hasRole('Root')) {
            return $this->sendError('Hanya Root yang dapat mencabut sesi pengguna lain.', [], 403);
        }

        $deleted = DB::table('sessions')
            ->where('id', $session)
            ->where('user_id', $user->id)
            ->delete();

        if ($deleted === 0) {
            return $this->sendError('Sesi pengguna tidak ditemukan.', [], 404);
        }

        activity('user-management')
            ->causedBy($actor)
            ->performedOn($user)
            ->withProperties(['session_id' => $session, 'ip' => $request->ip()])
            ->log("[CORE] User session revoked: {$user->email}");

        return $this->sendResponse(null, 'Sesi pengguna berhasil dicabut.');
    }

    public function audit(Request $request, User $user): JsonResponse
    {
        if (! $request->user()->hasRole('Root')) {
            return $this->sendError('Hanya Root yang dapat melihat audit pengguna lain.', [], 403);
        }

        return $this->sendResponse(
            $this->activitiesFor($user),
            'Audit pengguna berhasil diambil.'
        );
    }

    public function sessions(Request $request, User $user): JsonResponse
    {
        if (! $request->user()->hasRole('Root')) {
            return $this->sendError('Hanya Root yang dapat melihat sesi pengguna lain.', [], 403);
        }

        return $this->sendResponse(
            $this->sessionsFor($user),
            'Sesi pengguna berhasil diambil.'
        );
    }

    public function getWhitelist(Request $request): JsonResponse
    {
        $whitelisted = $request->user()->getSetting('manageable_manager_permissions', []);

        return $this->sendResponse(array_values($whitelisted), 'Daftar izin yang dikelola Manajer berhasil diambil.');
    }

    public function saveWhitelist(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        /** @var User $rootUser */
        $rootUser = $request->user();
        $permissions = array_values($validated['permissions']);
        $rootUser->setSetting('manageable_manager_permissions', $permissions);

        activity('rbac')
            ->causedBy($rootUser)
            ->withProperties([
                'manageable_permissions' => $permissions,
                'ip' => $request->ip(),
            ])
            ->log('[CORE] Whitelist manager permissions updated');

        return $this->sendResponse($permissions, 'Daftar izin yang dikelola Manajer berhasil diperbarui.');
    }

    private function canManageTarget(User $actor, User $target): bool
    {
        return $actor->hasRole('Root') || ! $target->hasRole('Root');
    }

    // Removed isPending

    private function sessionsFor(User $user): array
    {
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'ip_address' => $session->ip_address,
                'user_agent' => $session->user_agent,
                'last_activity' => CarbonImmutable::createFromTimestamp($session->last_activity)->toIso8601String(),
            ])
            ->all();
    }

    private function activitiesFor(User $user): array
    {
        return Activity::query()
            ->where('causer_id', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Activity $activity) => [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'event' => $activity->event,
                'created_at' => $activity->created_at?->toIso8601String(),
            ])
            ->all();
    }
}
