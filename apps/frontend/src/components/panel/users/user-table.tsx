import React from "react";
import Image from "next/image";
import { ManagedUser, UserManagementOptions, formatDate, initials } from "@/core/admin";
import { Table, Column } from "@/components/ui/table";

interface UserTableProps {
  users: ManagedUser[];
  options: UserManagementOptions | null;
  isLoading: boolean;
  isRoot: boolean;
  onOpenUser: (user: ManagedUser) => void;
}

export function UserTable({
  users,
  options,
  isLoading,
  isRoot,
  onOpenUser,
}: UserTableProps) {
  const columns: Column<ManagedUser>[] = [
    {
      header: "Nama",
      headerClassName: "px-3 py-4 text-center",
      className: "px-3 py-2 align-middle",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar user={user} />
          <div className="min-w-0">
            <span className="block truncate font-semibold text-cu-ink" title={user.name}>
              {user.name}
            </span>
            <span className="text-xs text-cu-muted">ID #{user.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Username",
      headerClassName: "px-3 py-4 text-center",
      className: "px-3 py-2 align-middle",
      render: (user) => (
        <span className="block truncate text-cu-ink" title={user.username}>
          @{user.username}
        </span>
      ),
    },
    {
      header: "Peran & izin",
      headerClassName: "px-3 py-4 text-center",
      className: "px-3 py-2 align-middle",
      render: (user) => (
        <div className="flex flex-wrap gap-1.5">
          {user.roles.map((role) => (
            <Badge key={role} tone={role === "Root" ? "danger" : role === "Manajer" ? "info" : "neutral"}>
              {role}
            </Badge>
          ))}
          {user.permissions.slice(0, 2).map((permission) => (
            <Badge key={permission} tone="soft">
              +{options?.permission_aliases[permission] ?? permission}
            </Badge>
          ))}
          {user.permissions.length > 2 && (
            <Badge tone="soft">+{user.permissions.length - 2} lagi</Badge>
          )}
        </div>
      ),
    },
    {
      header: "Bergabung",
      headerClassName: "px-3 py-4 text-center",
      className: "px-3 py-2 text-center align-middle text-[10px] text-cu-muted",
      render: (user) => <span className="whitespace-nowrap">{formatDate(user.created_at)}</span>,
    },
    {
      header: "Aksi",
      headerClassName: "px-3 py-4 text-center",
      className: "px-3 py-2 text-center align-middle",
      render: (user) => {
        const protectedFromManager = !isRoot && user.roles.includes("Root");
        return protectedFromManager ? (
          <span className="text-xs italic text-cu-muted">Protected</span>
        ) : (
          <button
            type="button"
            onClick={() => onOpenUser(user)}
            className="rounded-full border border-cu-line bg-cu-surface px-3 py-1.5 text-xs font-semibold text-cu-ink transition hover:border-cu-ink hover:bg-cu-panel-soft"
          >
            Kelola
          </button>
        );
      },
    },
  ];

  return (
    <div className="hidden min-h-0 flex-1 max-w-full overflow-y-auto overflow-x-hidden md:block">
      <Table
        data={users}
        columns={columns}
        keyExtractor={(user) => user.id}
        emptyState={
          isLoading
            ? "Memuat pengguna..."
            : "Tidak ada pengguna yang sesuai."
        }
        tableClassName="table-fixed"
      />
    </div>
  );
}

function Avatar({ user }: { user: ManagedUser }) {
  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cu-line ${
        user.avatar_url ? "bg-white" : "bg-cu-panel-soft"
      }`}
    >
      {user.avatar_url ? (
        <Image
          unoptimized
          width={36}
          height={36}
          src={user.avatar_url}
          alt={user.name}
          className="size-full object-cover"
        />
      ) : (
        <span className="text-xs font-bold text-cu-muted">{initials(user.name)}</span>
      )}
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: string }) {
  const tones = {
    neutral: "bg-cu-panel-soft text-cu-muted border-cu-line",
    info: "bg-cu-info-soft text-cu-info border-cu-info/20",
    danger: "bg-cu-danger-soft text-cu-danger border-cu-danger/20",
    soft: "bg-cu-panel-soft/60 text-cu-muted border-cu-line/40",
  };
  const toneClass = tones[tone as keyof typeof tones] || tones.neutral;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${toneClass}`}
    >
      {children}
    </span>
  );
}
