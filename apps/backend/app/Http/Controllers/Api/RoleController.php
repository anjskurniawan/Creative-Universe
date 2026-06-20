<?php

namespace App\Http\Controllers\Api;

use App\Actions\Core\CreateRoleAction;
use App\Actions\Core\DeleteRoleAction;
use App\Actions\Core\UpdateRolePermissionsAction;
use App\Http\Requests\Api\StoreRoleRequest;
use App\Http\Requests\Api\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Core\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $modelHasRolesTable = config('permission.table_names.model_has_roles', 'model_has_roles');

        $roles = Role::with('permissions')
            ->select('roles.*')
            ->addSelect([
                'users_count' => DB::table($modelHasRolesTable)
                    ->selectRaw('count(*)')
                    ->whereColumn("{$modelHasRolesTable}.role_id", 'roles.id')
                    ->where("{$modelHasRolesTable}.model_type", User::class),
                'active_users_count' => DB::table($modelHasRolesTable)
                    ->join('users', "{$modelHasRolesTable}.model_id", '=', 'users.id')
                    ->selectRaw('count(*)')
                    ->whereColumn("{$modelHasRolesTable}.role_id", 'roles.id')
                    ->where("{$modelHasRolesTable}.model_type", User::class)
                    ->where('users.is_active', true)
                    ->whereNull('users.deleted_at'),
            ])
            ->orderBy('name')
            ->get();

        return $this->sendResponse(
            RoleResource::collection($roles),
            'Daftar peran berhasil diambil.'
        );
    }

    public function store(StoreRoleRequest $request, CreateRoleAction $action): JsonResponse
    {
        $roleData = (object) [
            'name' => $request->input('name'),
            'permissions' => $request->input('permissions', []),
        ];

        $role = $action->handle($roleData, $request->user());

        return $this->sendResponse(
            new RoleResource($role),
            "Role {$role->name} berhasil dibuat.",
            201
        );
    }

    public function update(UpdateRoleRequest $request, Role $role, UpdateRolePermissionsAction $action): JsonResponse
    {
        $action->handle($role, $request->input('permissions'), $request->user());

        $role->load('permissions');

        return $this->sendResponse(
            new RoleResource($role),
            "Permission role {$role->name} berhasil diperbarui."
        );
    }

    public function destroy(Request $request, Role $role, DeleteRoleAction $action): JsonResponse
    {
        try {
            $action->handle($role, $request->user());

            return $this->sendResponse(null, "Role {$role->name} berhasil dihapus.");
        } catch (\RuntimeException $e) {
            return $this->sendError($e->getMessage(), [], 422);
        }
    }

    public function permissions(Request $request): JsonResponse
    {
        $permissions = Permission::orderBy('name')->get();

        return $this->sendResponse(
            $permissions->pluck('name')->values()->all(),
            'Daftar izin berhasil diambil.'
        );
    }
}
