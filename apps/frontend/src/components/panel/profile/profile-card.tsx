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

// Brand accents, cycled across chips / role dots so color always carries meaning
// (which brand pillar the item belongs to), not decoration.
const ACCENTS = ["#B80257", "#09A8FA", "#FF6F3C"];

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
      <div className="group relative overflow-hidden rounded-2xl border border-cu-line bg-white/80 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col items-center gap-3 text-center">
        <span
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${ACCENTS[0]}, ${ACCENTS[1]}, ${ACCENTS[2]})` }}
          aria-hidden="true"
        />
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl ring-2 ring-white bg-cu-panel-soft text-lg font-bold text-cu-muted shadow-md transition-transform duration-300 group-hover:scale-105">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-cu-ink">{user.name}</h3>
          <p className="text-xs text-cu-muted">@{user.username}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {user.roles.map((role, i) => (
            <span
              key={role}
              className="inline-flex items-center gap-1.5 rounded-full border border-cu-line bg-cu-panel-soft px-2.5 py-0.5 text-[10px] font-semibold text-cu-muted"
            >
              <span className="size-1.5 rounded-full" style={{ background: ACCENTS[i % ACCENTS.length] }} />
              {role}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "horizontal") {
    return (
      <div className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-cu-line bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg sm:flex-row">
        <span
          className="absolute inset-y-0 left-0 w-1"
          style={{ background: `linear-gradient(180deg, ${ACCENTS[0]}, ${ACCENTS[1]}, ${ACCENTS[2]})` }}
          aria-hidden="true"
        />
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-2 ring-white bg-cu-panel-soft text-base font-bold text-cu-muted shadow-sm">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="truncate text-base font-bold text-cu-ink">{user.name}</h3>
          <p className="mt-0.5 text-xs text-cu-muted">@{user.username}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {user.roles.map((role, i) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 rounded-full border border-cu-line bg-cu-panel-soft px-2.5 py-0.5 text-[10px] font-semibold text-cu-muted"
              >
                <span className="size-1.5 rounded-full" style={{ background: ACCENTS[i % ACCENTS.length] }} />
                {role}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/settings/account/profile"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-muted transition hover:border-cu-ink hover:bg-cu-panel-soft hover:text-cu-ink"
          title="Ubah Profil"
        >
          <MaterialIcon name="edit" size="xs" />
        </Link>
      </div>
    );
  }

  // Default: "full"
  const waHref = user.whatsapp_number ? `https://wa.me/${user.whatsapp_number.replace(/[^0-9]/g, "")}` : undefined;
  const mailHref = user.email ? `mailto:${user.email}` : undefined;

  return (
    <section className="overflow-hidden rounded-3xl border border-cu-line bg-cu-surface shadow-sm">
      {/* Banner — layered radial "mesh" over the brand gradient */}
      <div
        className="relative h-32 sm:h-40"
        style={{
          backgroundImage: `
            radial-gradient(120% 140% at 8% 15%, #FFD166 0%, transparent 45%),
            radial-gradient(90% 120% at 88% 8%, ${ACCENTS[1]} 0%, transparent 55%),
            radial-gradient(110% 130% at 65% 100%, ${ACCENTS[0]} 0%, transparent 55%),
            linear-gradient(135deg, ${ACCENTS[2]} 0%, ${ACCENTS[0]} 45%, ${ACCENTS[1]} 100%)
          `,
        }}
      />

      {/* Avatar strip — a real, explicit-height block that sits in normal flow right after
          the banner. The avatar is absolute *inside this strip only* and anchored with
          bottom-0/left-0, so it always aligns to the strip's own edges regardless of the
          avatar's size at any breakpoint — there is no second number anywhere else in the
          layout that has to be kept in sync with it. Whatever the strip's height is, that's
          exactly how far the avatar protrudes below the banner, and the next block (the name)
          simply follows the strip in normal flow. */}
      <div className="relative h-12 px-6 sm:h-14 sm:px-8">
        <div className="absolute bottom-0 left-6 flex size-24 items-center justify-center overflow-hidden rounded-full ring-4 ring-cu-surface bg-cu-panel-soft text-2xl font-semibold text-cu-muted shadow-md sm:left-8 sm:size-28">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={`Foto profil ${user.name}`} className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="px-6 pb-6 pt-4 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: identity + single edit action */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-cu-ink">{user.name}</h1>
            <p className="mt-1 text-sm text-cu-muted">{user.roles.join(", ") || "User"}</p>
            <p className="text-sm text-cu-muted">@{user.username}</p>
            <Link
              href="/settings/account/profile"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-cu-ink px-5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <MaterialIcon name="edit" size="sm" />
              Edit Profil
            </Link>
          </div>

          {/* Right: headline app-access badge (outline, single fact) + role chips (filled,
              a list) — the two styles are deliberately different so a glance tells you which
              kind of information each is. */}
          <div className="flex flex-col gap-4 sm:items-end">
            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cu-muted">
                <MaterialIcon name="apps" size="xs" />
                Akses Aplikasi
              </span>
              <div className="mt-1.5">
                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold"
                  style={{ borderColor: `${ACCENTS[1]}55`, color: ACCENTS[1] }}
                >
                  {apps.length} aplikasi
                </span>
              </div>
            </div>

            {user.roles.length > 0 && (
              <div className="sm:text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cu-muted">
                  <MaterialIcon name="badge" size="xs" />
                  Peran
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5 sm:justify-end">
                  {user.roles.map((role, i) => (
                    <span
                      key={role}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: `${ACCENTS[i % ACCENTS.length]}14`, color: ACCENTS[i % ACCENTS.length] }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom tiles — functional contact shortcuts, not decoration */}
        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-cu-line pt-6 sm:grid-cols-2">
          <ProfileContactTile
            icon="mail"
            label="Email"
            value={user.email || "Belum ditambahkan"}
            href={mailHref}
            accent={ACCENTS[1]}
          />
          <ProfileContactTile
            icon="chat"
            label="WhatsApp"
            value={user.whatsapp_number || "Belum ditambahkan"}
            href={waHref}
            accent={ACCENTS[1]}
          />
        </div>
      </div>
    </section>
  );
}

function ProfileContactTile({
  icon,
  label,
  value,
  href,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
  accent: string;
}) {
  const content = (
    <div
      className={`flex items-center gap-3 rounded-2xl p-4 transition-all duration-200 ${
        href ? "hover:-translate-y-0.5 hover:shadow-sm" : "opacity-70"
      }`}
      style={{ background: `${accent}0d` }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-cu-muted">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-cu-ink">{value}</p>
      </div>
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${accent}1f`, color: accent }}
      >
        <MaterialIcon name={href ? "arrow_forward" : icon} size="sm" />
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}
