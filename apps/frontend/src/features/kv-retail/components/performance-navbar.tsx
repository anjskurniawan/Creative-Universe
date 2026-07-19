/* eslint-disable @next/next/no-img-element -- avatar URL berasal dari backend dan dapat memakai host eksternal. */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/material-icon";
import { MessageBell } from "@/components/message-bell";
import { NotificationBell } from "@/components/notification-bell";
import { APPLICATION_ICONS, visibleSubApplications } from "@/core/applications";
import { APP_ROUTES } from "@/core/navigation/routes";
import { CreativeUniverseLogo } from "@/design-system/atoms/brand/creative-universe-logo";
import { useAuth } from "@/providers/auth-provider";
import { KV_RETAIL_PERFORMANCE_PAGE } from "@/features/kv-retail/performance-page-config";

function IconButton({ icon, label, onClick, theme }: { icon: string; label: string; onClick?: () => void; theme: "dark" | "light" | "retro" }) {
  const light = theme !== "dark";
  return <button type="button" aria-label={label} onClick={onClick} className={`flex size-8 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${light ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30" : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"}`}><MaterialIcon name={icon} size="auto" className="text-xl" /></button>;
}

export type KvRetailCompactMenuItem = {
  label: string;
  href?: string;
};

const COMPACT_MENU_ITEM_HEIGHT = 64;

function normalizeRoutePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

/** Figma node 27:256, isolated so it applies only to the KV Retail shell. */
export function PerformanceNavbar({
  theme,
  title = KV_RETAIL_PERFORMANCE_PAGE.title,
  parentTitle = KV_RETAIL_PERFORMANCE_PAGE.parentTitle,
  compact = false,
  compactMenuItems = [],
}: {
  theme: "dark" | "light" | "retro";
  title?: string;
  parentTitle?: string;
  /** Mobile KV Retail navbar: keep the desktop shell/actions but omit history controls and breadcrumb. */
  compact?: boolean;
  /** Text-only full-screen navigation shown by the mobile hamburger. */
  compactMenuItems?: KvRetailCompactMenuItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [appsOpen, setAppsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const [compactMenuPivot, setCompactMenuPivot] = useState(0);
  const appsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const compactMenuScrollRef = useRef<HTMLDivElement>(null);
  const compactMenuAutoOpenRef = useRef<number | null>(null);
  const isPositioningCompactMenu = useRef(false);
  const applications = visibleSubApplications(user?.applications ?? []);
  const light = theme !== "dark";
  const retro = theme === "retro";
  const appsMenuSurface = retro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[0_3px_0_#24252b]" : light ? "border border-[#bdeaff] bg-[#f3fbff]/95 shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md" : "border border-[#b0ff5e]/25 bg-[#121916] shadow-[0_12px_28px_rgba(0,0,0,0.34)]";
  const appsMenuItem = retro ? "text-[#24252b] hover:bg-[#dfe2d3]" : light ? "text-[#04044A] hover:bg-[#dff6ff]" : "text-[#f1f1f1] hover:bg-[#b0ff5e]/10";
  const sharedDropdownPosition = compact
    ? "!fixed !left-4 !right-4 !top-[4.75rem] !mt-0 !w-auto !max-h-[calc(100dvh-5.5rem)]"
    : "!absolute !left-auto !right-0 !top-[calc(100%+8px)] !mt-0 !w-[280px] !max-h-[calc(100dvh-96px)]";
  const compactDropdownPlacement = compact
    ? "fixed left-4 right-4 top-[4.75rem] z-[110] w-auto"
    : "absolute right-0 top-[calc(100%+8px)] z-50 w-[280px]";
  const bellPanelClass = `${sharedDropdownPosition} ${retro ? "cu-performance-bell-retro !border-2 !border-[#24252b] !bg-[#eceee6] !text-[#24252b] !shadow-[0_3px_0_#24252b]" : light ? "cu-performance-bell-light !border !border-[#bdeaff] !bg-[#f3fbff] !text-[#04044A] !shadow-[0_10px_24px_rgba(0,4,117,0.18)]" : "cu-performance-bell-dark !border !border-[#b0ff5e]/25 !bg-[#121916] !text-[#f1f1f1] !shadow-[0_12px_28px_rgba(0,0,0,0.34)]"}`;

  const closeCompactMenu = () => {
    if (compactMenuAutoOpenRef.current) window.clearTimeout(compactMenuAutoOpenRef.current);
    compactMenuAutoOpenRef.current = null;
    setCompactMenuOpen(false);
  };

  const openCompactMenuRoute = (index: number) => {
    const item = compactMenuItems[index];
    if (!item?.href) return;
    if (normalizeRoutePath(item.href) === normalizeRoutePath(pathname)) return;
    closeCompactMenu();
    router.push(item.href);
  };

  const handleCompactMenuScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isPositioningCompactMenu.current) return;
    const nextPivot = Math.max(0, Math.min(compactMenuItems.length - 1, Math.round(event.currentTarget.scrollTop / COMPACT_MENU_ITEM_HEIGHT)));
    setCompactMenuPivot(nextPivot);
    if (compactMenuAutoOpenRef.current) window.clearTimeout(compactMenuAutoOpenRef.current);
    compactMenuAutoOpenRef.current = null;
  };

  const handleCompactMenuScrollEnd = (event: React.UIEvent<HTMLDivElement>) => {
    if (isPositioningCompactMenu.current) return;
    const pivot = Math.max(0, Math.min(compactMenuItems.length - 1, Math.round(event.currentTarget.scrollTop / COMPACT_MENU_ITEM_HEIGHT)));
    if (compactMenuAutoOpenRef.current) window.clearTimeout(compactMenuAutoOpenRef.current);
    compactMenuAutoOpenRef.current = window.setTimeout(() => openCompactMenuRoute(pivot), 900);
  };

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      if (appsRef.current && !appsRef.current.contains(event.target as Node)) setAppsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  useEffect(() => {
    if (!compactMenuOpen) return;
    const activeIndex = Math.max(0, compactMenuItems.findIndex((item) => item.href && normalizeRoutePath(item.href) === normalizeRoutePath(pathname)));
    isPositioningCompactMenu.current = true;
    requestAnimationFrame(() => {
      setCompactMenuPivot(activeIndex);
      compactMenuScrollRef.current?.scrollTo({ top: activeIndex * COMPACT_MENU_ITEM_HEIGHT, behavior: "auto" });
      requestAnimationFrame(() => { isPositioningCompactMenu.current = false; });
    });
    return () => {
      if (compactMenuAutoOpenRef.current) window.clearTimeout(compactMenuAutoOpenRef.current);
      compactMenuAutoOpenRef.current = null;
    };
  }, [compactMenuOpen, compactMenuItems, pathname]);

  return <nav className={`flex h-16 shrink-0 items-center justify-between ${compact ? "px-4" : "px-5"} ${retro ? "border-b-[3px] border-[#24252b] bg-[#eceee6]" : theme === "light" ? "border-b border-black/[0.045] bg-white/55" : "border-b border-white/[0.06] bg-[#111413]/55"}`} aria-label={`Navigasi ${title}`} data-kv-retail-navbar data-compact={compact || undefined}>
    <div className="flex items-center gap-4">
      {compact ? (
        <IconButton
          icon="menu"
          label={compactMenuOpen ? "Tutup menu KV Retail" : "Buka menu KV Retail"}
          onClick={() => compactMenuOpen ? closeCompactMenu() : setCompactMenuOpen(true)}
          theme={theme}
        />
      ) : (
        <Link href={APP_ROUTES.dashboard} aria-label="Creative Universe" className={`flex size-8 items-center justify-center rounded-lg p-1 ${light ? "bg-black text-white" : "bg-white text-black"}`}><CreativeUniverseLogo className="h-4 w-[14.739px]" /></Link>
      )}
      {!compact && (
        <div className="flex items-center gap-[7px]">
          <div className="flex items-center gap-[3px]">
            <IconButton icon="arrow_back" label="Kembali" onClick={() => router.back()} theme={theme} />
            <IconButton icon="arrow_forward" label="Maju" onClick={() => router.forward()} theme={theme} />
          </div>
          <div className="flex items-center gap-0.5 text-sm whitespace-nowrap">
            <span className={light ? "text-[#aeb6b8]" : "text-[#7b7b7b]"}>{parentTitle}</span>
            <MaterialIcon name="chevron_right" size="auto" className="text-xl text-[#7b7b7b]" />
            <span className={`font-medium ${light ? "text-[#3b4446]" : "text-white"}`}>{title}</span>
          </div>
        </div>
      )}
    </div>
    <div className="flex items-center gap-1">
      <IconButton icon="code" label="Developer panel" onClick={() => router.push(APP_ROUTES.maintenance)} theme={theme} />
      {user ? <MessageBell userId={user.id} variant={light ? "light" : "dark"} panelClassName={bellPanelClass} renderTrigger={({ toggle }) => <IconButton icon="chat_bubble" label="Pesan" onClick={toggle} theme={theme} />} /> : <IconButton icon="chat_bubble" label="Pesan" onClick={() => router.push(APP_ROUTES.messages)} theme={theme} />}
      {user ? <NotificationBell userId={user.id} variant={light ? "light" : "dark"} panelClassName={bellPanelClass} renderTrigger={({ toggle }) => <IconButton icon="notifications" label="Notifikasi" onClick={toggle} theme={theme} />} /> : <IconButton icon="notifications" label="Notifikasi" onClick={() => router.push(APP_ROUTES.notifications)} theme={theme} />}
      <div ref={appsRef} className="relative"><IconButton icon="apps" label="Aplikasi" onClick={() => setAppsOpen((open) => !open)} theme={theme} />{appsOpen && <div className={`${compactDropdownPlacement} rounded-xl p-1.5 ${appsMenuSurface}`}><ul role="menu" aria-label="Menu aplikasi" className="m-0 flex list-none flex-col gap-1 p-0">{applications.map((application) => <li key={application.key}><Link href={application.frontend_path!} onClick={() => setAppsOpen(false)} role="menuitem" className={`flex h-10 items-center gap-2 rounded-lg px-3 text-sm ${appsMenuItem}`}><MaterialIcon name={APPLICATION_ICONS[application.key] ?? "apps"} size="auto" className="text-lg" /><span className="truncate">{application.display_name}</span></Link></li>)}</ul></div>}</div>
      <div ref={profileRef} className="relative ml-1"><button type="button" aria-label="Menu profil" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)} className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-[#d9d9d9] text-[11px] font-semibold text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30">{user?.avatar_url ? <img src={user.avatar_url} alt="Foto profil" className="size-full object-cover" /> : user?.name?.slice(0, 1).toUpperCase() ?? "U"}</button>{profileOpen && <div className={`absolute right-0 top-[calc(100%+8px)] z-50 flex w-[280px] flex-col overflow-hidden rounded-2xl p-1.5 ${appsMenuSurface}`}><div className={`flex items-center gap-3 rounded-xl px-3 py-3 ${light ? "bg-white/55" : "bg-white/5"}`}><span className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold ${light ? "bg-[#04044A] text-white" : "bg-white text-[#181818]"}`}>{user?.avatar_url ? <img src={user.avatar_url} alt="Foto profil" className="size-full object-cover" /> : user?.name?.slice(0, 1).toUpperCase() ?? "U"}</span><div className="min-w-0"><p className={`truncate text-sm font-medium ${light ? "text-[#04044A]" : "text-[#f1f1f1]"}`}>{user?.name ?? "Pengguna"}</p><p className={`truncate text-xs ${light ? "text-[#5b7190]" : "text-[#b9b9b9]"}`}>{user?.roles?.[0] ?? "User"}</p></div></div><ul role="menu" aria-label="Menu akun" className="m-0 flex list-none flex-col gap-1 py-1">{[[APP_ROUTES.profile, "person", "Profile"], [APP_ROUTES.dashboard, "dashboard", "Dashboard"], [APP_ROUTES.settings, "settings", "Settings"], [APP_ROUTES.documentation, "help", "Help Center"]].map(([href, icon, label], index) => <li key={label}><Link href={href} onClick={() => setProfileOpen(false)} className={`flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm ${appsMenuItem} ${index === 0 ? light ? "bg-[#dff6ff]" : "bg-[#b0ff5e]/10" : ""}`}><MaterialIcon name={icon} size="auto" className="text-lg" />{label}</Link></li>)}</ul><button type="button" onClick={() => { setProfileOpen(false); void logout(); }} className={`flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm ${appsMenuItem}`}><MaterialIcon name="logout" size="auto" className="text-lg" />Sign Out</button></div>}</div>
    </div>
    {compact && compactMenuOpen && typeof document !== "undefined" && createPortal(
      <div className={`fixed inset-0 z-[120] flex min-h-dvh flex-col px-6 py-7 backdrop-blur-2xl ${retro ? "bg-[#dfe2d3]/32 text-[#24252b]" : light ? "bg-[#f3faff]/24 text-[#04044a]" : "bg-[#0b0d0c]/28 text-[#f1f1f1]"}`} role="dialog" aria-modal="true" aria-label="Menu KV Retail">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium uppercase tracking-[0.12em]">KV Retail</p>
          <button type="button" onClick={closeCompactMenu} className="text-sm font-medium underline underline-offset-4">Tutup</button>
        </div>
        <nav aria-label="Menu KV Retail" className="my-auto h-[52dvh] overflow-hidden">
          <div
            ref={compactMenuScrollRef}
            onScroll={handleCompactMenuScroll}
            onScrollEnd={handleCompactMenuScrollEnd}
            className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain py-[calc(26dvh-32px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {compactMenuItems.map((item, index) => {
              const distance = Math.abs(index - compactMenuPivot);
              const pivot = distance === 0;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => openCompactMenuRoute(index)}
                  className={`flex h-16 w-full snap-center items-center text-left transition-[opacity,transform,font-size] duration-200 ${pivot ? "scale-100 text-5xl font-medium leading-none tracking-[-0.05em] opacity-100" : distance === 1 ? "scale-95 text-2xl font-medium opacity-45" : "scale-90 text-xl font-medium opacity-20"}`}
                  aria-current={pivot ? "true" : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    , document.body)}
  </nav>;
}
