"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AuthUser } from "@/core/auth";
import { useAuth } from "@/providers/auth-provider";
import { APP_ROUTES } from "@/core/navigation/routes";
import { APPLICATION_ICONS } from "@/core/applications";
import { CreativeUniverseLogo } from "@/design-system/atoms/brand/creative-universe-logo";
import { NavbarAction, navbarActionClass, type NavbarTone } from "@/design-system/atoms/navigation/navbar-action";
import { NavbarAvatar } from "@/design-system/atoms/navigation/navbar-avatar";
import { NavbarMenuItem } from "@/design-system/molecules/navigation/navbar-menu-item";
import { NavbarUserSummary } from "@/design-system/molecules/navigation/navbar-user-summary";
import { MaterialIcon } from "@/components/material-icon";
import { MessageBell } from "@/components/message-bell";
import { NotificationBell } from "@/components/notification-bell";

export type NavbarVariant = NavbarTone;
export type NavbarSession = "connected" | "guest" | "preview-authenticated";
export interface NavbarProps { variant?: NavbarVariant; sticky?: boolean; session?: NavbarSession; previewUser?: AuthUser; interactive?: boolean }

export function Navbar({ variant = "light", sticky = true, session = "connected", previewUser, interactive = true }: NavbarProps) {
  const auth = useAuth();
  const user = session === "preview-authenticated" ? previewUser ?? createPreviewUser() : session === "guest" ? null : auth.user;
  const authenticated = session === "preview-authenticated" ? true : session === "guest" ? false : auth.isAuthenticated;
  const [appsOpen, setAppsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const dark = variant !== "light";
  const navbarSurface = variant === "transparent-dark" ? "bg-transparent text-white" : dark ? "bg-black text-white" : "bg-white text-black";

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (appsRef.current && !appsRef.current.contains(event.target as Node)) setAppsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setAppsOpen(false); setProfileOpen(false); }
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("mousedown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, []);

  const panel = dark ? "bg-black text-[#f9fafb]" : "border-[0.5px] border-[#f2f2f2] bg-white text-[#121212]";
  const toggleApps = () => { if (interactive) { setAppsOpen((value) => !value); setProfileOpen(false); } };
  const toggleProfile = () => { if (interactive) { setProfileOpen((value) => !value); setAppsOpen(false); } };
  const bellVariant = dark ? "dark" : "light";

  return (
    <nav data-component="navbar" data-variant={variant} className={`${sticky ? "sticky top-0" : "relative"} isolate z-[100] h-[72px] ${navbarSurface}`}>
      <div className="flex h-full w-full items-center justify-between px-4 md:px-16">
        <Link href={APP_ROUTES.home} className="inline-flex size-9 shrink-0 items-center justify-center" aria-label="Creative Universe"><CreativeUniverseLogo className="size-9" /></Link>
        {authenticated && user && <div className="flex items-center justify-end gap-2">
          {user.roles.some((role) => role.toLowerCase() === "root") && <NavbarAction href={APP_ROUTES.maintenance} label="Developer Panel" icon="code" tone={variant} />}
          {session === "connected" ? <><NotificationBell userId={user.id} variant={bellVariant} /><MessageBell userId={user.id} variant={bellVariant} /></> : <><NavbarAction icon="notifications" label="Notifikasi" tone={variant} /><NavbarAction icon="chat_bubble" label="Pesan" tone={variant} /></>}
          <div className="relative" ref={appsRef}>
            <button type="button" className={navbarActionClass(variant)} onClick={toggleApps} aria-expanded={appsOpen} aria-haspopup="menu"><span className="sr-only">Buka menu aplikasi</span><MaterialIcon name="apps" size="md" /></button>
            {appsOpen && <div className={`fixed left-4 right-4 top-[4.75rem] z-[110] mt-2 max-h-[calc(100dvh-5.5rem)] overflow-hidden rounded-2xl p-1.5 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-[280px] ${panel} animate-slide-up`}><ul role="menu" aria-label="Menu aplikasi" className="m-0 flex list-none flex-col gap-1 p-0">{user.applications.filter((app) => app.type === "sub_app" && app.frontend_path).sort((a,b) => a.sort_order-b.sort_order).map((app) => <NavbarMenuItem key={app.key} href={app.frontend_path!} icon={APPLICATION_ICONS[app.key] ?? "apps"} label={app.display_name} badge={app.status === "experimental" ? "Eksperimen" : undefined} tone={variant} onClick={() => setAppsOpen(false)} />)}</ul></div>}
          </div>
          <div className="relative" ref={profileRef}>
            <NavbarAvatar name={user.name} avatarUrl={user.avatar_url} tone={variant} onClick={toggleProfile} expanded={profileOpen} />
            {profileOpen && <ProfilePanel user={user} tone={variant} onClose={() => setProfileOpen(false)} onLogout={() => { setProfileOpen(false); if (session === "connected") void auth.logout(); }} />}
          </div>
        </div>}
      </div>
    </nav>
  );
}

function ProfilePanel({ user, tone, onClose, onLogout }: { user: AuthUser; tone: NavbarTone; onClose: () => void; onLogout: () => void }) {
  const dark = tone !== "light";
  return <div className={`absolute right-0 z-[110] mt-2 flex max-h-[calc(100dvh-5.5rem)] w-[min(280px,calc(100vw-2rem))] flex-col items-start overflow-hidden rounded-2xl p-1.5 ${dark ? "bg-black text-[#f9fafb]" : "border-[0.5px] border-[#f2f2f2] bg-white text-[#121212]"}`}><NavbarUserSummary name={user.name} role={user.roles[0] ?? "User"} avatarUrl={user.avatar_url} tone={tone} /><ul role="menu" aria-label="Account navigation" className="m-0 flex w-full list-none flex-col gap-1 py-1"><NavbarMenuItem href={APP_ROUTES.profile} icon="person" label="Profile" tone={tone} highlighted onClick={onClose} /><NavbarMenuItem href={APP_ROUTES.dashboard} icon="dashboard" label="Dashboard" tone={tone} onClick={onClose} /><NavbarMenuItem href={APP_ROUTES.settings} icon="settings" label="Settings" tone={tone} onClick={onClose} /><NavbarMenuItem href={APP_ROUTES.documentation} icon="help" label="Help Center" tone={tone} onClick={onClose} /></ul><button type="button" onClick={onLogout} className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium ${dark ? "hover:bg-[#0a0d12]" : "hover:bg-[#f2f2f2]"}`}><MaterialIcon name="logout" size="sm" />Sign Out</button></div>;
}

export function createPreviewUser(): AuthUser { return { id: 0, name: "Alicia Creative", username: "alicia", email: "alicia@example.test", whatsapp_number: null, avatar_url: null, is_onboarded: true, division_id: null, position_id: null, roles: ["Root"], permissions: [], settings: null, applications: [{ key: "kv-retail", name: "KV Retail Task", display_name: "KV Retail Task", type: "sub_app", status: "active", frontend_path: "/kv-retail", sort_order: 20 }, { key: "odds", name: "One Dashboard Design System", display_name: "One Dashboard Design System", type: "sub_app", status: "active", frontend_path: "/odds", sort_order: 40 }, { key: "cai", name: "Creative Artificial Intelligence", display_name: "Creative AI", type: "sub_app", status: "experimental", frontend_path: "/creative-ai", sort_order: 60 }] }; }
