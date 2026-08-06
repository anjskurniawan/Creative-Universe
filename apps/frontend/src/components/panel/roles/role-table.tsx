import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { ManagedRole } from "@/core/admin";
import { Table, Column } from "@/components/ui/table";

interface RoleTableProps {
  roles: ManagedRole[];
  isLoading: boolean;
  onEdit: (role: ManagedRole) => void;
  onDelete: (role: ManagedRole) => void;
}

export function RoleTable({ roles, isLoading, onEdit, onDelete }: RoleTableProps) {
  const columns: Column<ManagedRole>[] = [
    {
      header: "Role",
      headerClassName: "px-6 py-4",
      className: "px-6 py-4 align-top",
      render: (role) => (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-cu-ink">{role.name}</span>
            {role.protected && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cu-warning/20 bg-cu-warning-soft px-2 py-0.5 text-[10px] font-semibold text-cu-warning">
                <MaterialIcon name="lock" size="xs" /> Dilindungi
              </span>
            )}
          </div>
          <p className="mt-1 text-[10px] text-cu-muted">Guard: {role.guard_name}</p>
        </>
      ),
    },
    {
      header: "Permission",
      headerClassName: "px-6 py-4",
      className: "px-6 py-4 align-top",
      render: (role) => (
        <div className="flex max-w-3xl flex-wrap gap-1.5">
          {role.permissions.length === 0 ? (
            <span className="text-xs text-cu-muted italic">Belum ada permission.</span>
          ) : (
            role.permissions.map((permission) => (
              <span
                key={permission}
                className="rounded-full border border-cu-info/20 bg-cu-info-soft px-2.5 py-0.5 text-[10px] font-semibold text-cu-info"
              >
                {permission}
              </span>
            ))
          )}
        </div>
      ),
    },
    {
      header: "User Aktif",
      headerClassName: "px-6 py-4",
      className: "px-6 py-4 align-top text-slate-600",
      render: (role) => (
        <>
          <span className="font-bold text-cu-ink">{role.active_users_count}</span>
          <span className="text-[10px] text-cu-muted"> / {role.users_count} total</span>
        </>
      ),
    },
    {
      header: "Aksi",
      headerClassName: "px-6 py-4 text-right",
      className: "px-6 py-4 align-top text-right",
      render: (role) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(role)}
            aria-label={`Ubah permission ${role.name}`}
            className="inline-flex size-8 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-ink transition hover:border-cu-ink hover:bg-cu-panel-soft"
          >
            <MaterialIcon name="edit" size="xs" />
          </button>
          <button
            type="button"
            disabled={role.protected}
            onClick={() => onDelete(role)}
            aria-label={`Hapus ${role.name}`}
            className="inline-flex size-8 items-center justify-center rounded-full border border-cu-danger/30 text-cu-danger transition hover:bg-cu-danger-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MaterialIcon name="delete" size="xs" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
      <Table
        data={roles}
        columns={columns}
        keyExtractor={(role) => role.id}
        emptyState={isLoading ? "Memuat role..." : "Belum ada role terdaftar."}
        tableClassName="min-w-[760px]"
      />
    </div>
  );
}
