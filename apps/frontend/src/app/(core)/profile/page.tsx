"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-4xl py-4 md:py-8">
      <section className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
        <div className="relative h-32 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] sm:h-40">
          <span className="absolute -right-10 -top-16 size-52 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
          <span className="absolute bottom-[-70px] left-[20%] size-44 rounded-full border-[18px] border-white/15" aria-hidden="true" />
        </div>
        <div className="relative px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-cu-surface bg-cu-panel-soft text-2xl font-semibold text-cu-muted shadow-sm sm:size-28">
                {user.avatar_url ? <img src={user.avatar_url} alt={`Foto profil ${user.name}`} className="size-full object-cover" /> : initials}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-semibold text-cu-ink">{user.name}</h1>
                <p className="mt-1 text-sm text-cu-muted">@{user.username}</p>
              </div>
            </div>
            <Link href="/settings/profile" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-line bg-cu-surface px-4 text-sm font-medium text-cu-ink transition hover:border-cu-ink hover:bg-cu-panel-soft">
              <MaterialIcon name="edit" size="sm" />
              Edit Profil
            </Link>
          </div>

          <dl className="mt-8 grid gap-4 border-t border-cu-line pt-6 sm:grid-cols-2">
            <ProfileDetail icon="mail" label="Email" value={user.email || "Belum ditambahkan"} />
            <ProfileDetail icon="phone" label="WhatsApp" value={user.whatsapp_number || "Belum ditambahkan"} />
            <ProfileDetail icon="badge" label="Peran" value={user.roles.join(", ") || "User"} />
            <ProfileDetail icon="apps" label="Aplikasi yang dapat diakses" value={`${user.applications.length} aplikasi`} />
          </dl>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-cu-ink">Aplikasi Saya</h2>
        <p className="mt-1 text-sm text-cu-muted">Aplikasi yang tersedia untuk akun Anda.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {user.applications.filter((application) => application.type === "sub_app").map((application) => (
            <span key={application.key} className="rounded-full border border-cu-line bg-cu-panel-soft px-3 py-1.5 text-xs font-medium text-cu-ink">
              {application.display_name}
            </span>
          ))}
          {user.applications.length === 0 && <span className="text-sm text-cu-muted">Belum ada aplikasi yang dapat diakses.</span>}
        </div>
      </section>
    </div>
  );
}

function ProfileDetail({ icon, label, value }: { icon: string; label: string; value: string }) {
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
