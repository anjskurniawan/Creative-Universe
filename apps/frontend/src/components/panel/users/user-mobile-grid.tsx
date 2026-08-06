import React from "react";
import Image from "next/image";
import { ManagedUser, UserManagementOptions, formatDate, initials } from "@/core/admin";

interface UserMobileGridProps {
  users: ManagedUser[];
  options: UserManagementOptions | null;
  isLoading: boolean;
  isRoot: boolean;
  onOpenUser: (user: ManagedUser) => void;
}

export function UserMobileGrid({
  users,
  options,
  isLoading,
  isRoot,
  onOpenUser,
}: UserMobileGridProps) {
  if (isLoading) {
    return (
      <div className="block bg-white p-3 md:hidden">
        <div className="rounded-[24px] border border-cu-line bg-cu-surface px-4 py-8 text-center text-sm text-cu-muted">
          Memuat pengguna...
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="block bg-white p-3 md:hidden">
        <div className="rounded-[24px] border border-cu-line bg-cu-surface px-4 py-8 text-center text-sm text-cu-muted">
          Tidak ada pengguna yang sesuai.
        </div>
      </div>
    );
  }

  return (
    <div className="block space-y-2 bg-white p-3 md:hidden">
      {users.map((user) => {
        const protectedFromManager = !isRoot && user.roles.includes("Root");
        return (
          <article key={user.id} className="rounded-[24px] border border-cu-line bg-cu-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar user={user} />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold leading-tight text-cu-ink">{user.name}</h2>
                  <p className="truncate text-[11px] leading-tight text-cu-muted">@{user.username}</p>
                </div>
              </div>
              {protectedFromManager ? (
                <span className="shrink-0 rounded-full bg-cu-panel-soft px-2 py-1 text-[10px] font-semibold text-cu-muted">
                  Protected
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenUser(user)}
                  className="shrink-0 rounded-full border border-cu-line bg-white px-3 py-1.5 text-[11px] font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
                >
                  Kelola
                </button>
              )}
            </div>
            <p className="mt-3 truncate text-xs text-cu-muted">{user.email}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
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
            <div className="mt-3 flex items-center justify-between border-t border-cu-line/70 pt-3 text-[11px] text-cu-muted">
              <span>ID #{user.id}</span>
              <span>{formatDate(user.created_at)}</span>
            </div>
          </article>
        );
      })}
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
