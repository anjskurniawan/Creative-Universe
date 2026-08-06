import React from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export interface ProfileCardProps {
  user: {
    name: string;
    username: string;
    email?: string | null;
    whatsapp_number?: string | null;
    avatar_url?: string | null;
    roles: string[];
    applications?: Array<{ key: string; display_name: string }>;
  };
  type?: "full" | "compact" | "horizontal";
}

export function ProfileCard({ user, type = "full" }: ProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const apps = user.applications || [];

  if (type === "compact") {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-cu-line bg-white/75 backdrop-blur-md p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col items-center text-center gap-3">
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border-2 border-slate-100 bg-cu-panel-soft text-lg font-bold text-cu-muted shadow-sm transition-transform duration-300 group-hover:scale-105">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-cu-ink truncate">{user.name}</h3>
          <p className="text-xs text-cu-muted">@{user.username}</p>
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {user.roles.map((role) => (
            <span
              key={role}
              className="rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "horizontal") {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-cu-line bg-white/75 backdrop-blur-md p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col sm:flex-row items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-cu-panel-soft text-base font-bold text-cu-muted shadow-sm">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-base font-bold text-cu-ink truncate">{user.name}</h3>
          <p className="text-xs text-cu-muted mt-0.5">@{user.username}</p>
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
            {user.roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-[#f8fafc] border border-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/settings/profile"
          className="shrink-0 inline-flex size-9 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-muted transition hover:border-cu-ink hover:text-cu-ink hover:bg-cu-panel-soft"
          title="Ubah Profil"
        >
          <MaterialIcon name="edit" size="xs" />
        </Link>
      </div>
    );
  }

  // Default: "full"
  return (
    <section className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] sm:h-40">
        <span className="absolute -right-10 -top-16 size-52 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
        <span className="absolute bottom-[-70px] left-[20%] size-44 rounded-full border-[18px] border-white/15" aria-hidden="true" />
      </div>

      {/* Info Body */}
      <div className="relative px-5 pb-6 sm:px-7">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-cu-surface bg-cu-panel-soft text-2xl font-semibold text-cu-muted shadow-sm sm:size-28">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={`Foto profil ${user.name}`} className="size-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-semibold text-cu-ink">{user.name}</h1>
              <p className="mt-1 text-sm text-cu-muted">@{user.username}</p>
            </div>
          </div>
          <Link
            href="/settings/profile"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-line bg-cu-surface px-4 text-sm font-medium text-cu-ink transition hover:border-cu-ink hover:bg-cu-panel-soft"
          >
            <MaterialIcon name="edit" size="sm" />
            Edit Profil
          </Link>
        </div>

        {/* Details Grid */}
        <dl className="mt-8 grid gap-4 border-t border-cu-line pt-6 sm:grid-cols-2">
          <ProfileDetailItem icon="mail" label="Email" value={user.email || "Belum ditambahkan"} />
          <ProfileDetailItem icon="phone" label="WhatsApp" value={user.whatsapp_number || "Belum ditambahkan"} />
          <ProfileDetailItem icon="badge" label="Peran" value={user.roles.join(", ") || "User"} />
          <ProfileDetailItem
            icon="apps"
            label="Aplikasi yang dapat diakses"
            value={`${apps.length} aplikasi`}
          />
        </dl>
      </div>
    </section>
  );
}

function ProfileDetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-cu-panel-soft/70 p-4">
      <MaterialIcon name={icon} size="sm" className="mt-0.5 text-cu-muted" />
      <div className="min-w-0">
        <dt className="text-xs font-medium text-cu-muted">{label}</dt>
        <dd className="mt-1 break-words text-sm font-medium text-cu-ink">{value}</dd>
      </div>
    </div>
  );
}
