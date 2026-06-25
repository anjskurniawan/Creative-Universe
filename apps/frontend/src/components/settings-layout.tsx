"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { useAuth } from "@/providers/auth-provider";

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────

interface NavItemBase {
  /** Display label */
  label: string;
  /** Material icon name (optional – sub-items usually have none) */
  icon?: string;
  /** Required permission to display this item */
  permission?: string;
}

export interface SettingsNavItem extends NavItemBase {
  /** Full href including query string, e.g. "/profile?tab=security" */
  href: string;
  /** Dedicated page used by the mobile settings flow. */
  mobileHref?: string;
  /** If true this is an indented child item (e.g. billing sub-menu) */
  isChild?: boolean;
}

export interface SettingsNavCollapsible extends NavItemBase {
  /** Children shown when expanded */
  children: SettingsNavItem[];
}

export interface SettingsNavGroup {
  /** Group heading */
  title: string;
  /** Navigation items – mix of links and collapsible parents */
  items: (SettingsNavItem | SettingsNavCollapsible)[];
}

interface SettingsLayoutProps {
  children: React.ReactNode;
}

// ─────────────────────────────────────────────────
// Helper: type guards
// ─────────────────────────────────────────────────

function isCollapsible(
  item: SettingsNavItem | SettingsNavCollapsible
): item is SettingsNavCollapsible {
  return "children" in item;
}

// ─────────────────────────────────────────────────
// Navigation config – single source of truth
// ─────────────────────────────────────────────────

const NAV_GROUPS: SettingsNavGroup[] = [
  {
    title: "Pengaturan Akun",
    items: [
      { href: "/profile", mobileHref: "/settings/profile", label: "Profil & Tampilan", icon: "person" },
    ],
  },
  {
    title: "Keamanan & Akses",
    items: [
      { href: "/profile?tab=security", mobileHref: "/settings/security", label: "Sandi & Perangkat", icon: "security" },
    ],
  },
  {
    title: "Hak Akses",
    items: [
      {
        href: "/profile?tab=role_settings",
        mobileHref: "/settings/role-settings",
        label: "Pengaturan Peran",
        icon: "admin_panel_settings",
        permission: "manage-settings",
      },
    ],
  },
  {
    title: "Log Audit",
    items: [
      { href: "/profile?tab=activity_log", mobileHref: "/settings/activity-log", label: "Jejak Aktivitas", icon: "history" },
    ],
  },
  /*
   * TEMPLATE MENU DENGAN SUBMENU
   * Blok ini sengaja dinonaktifkan dan dipertahankan sebagai referensi ketika
   * navigasi pengaturan membutuhkan parent menu yang dapat collapse/expand.
   * {
   *   title: "Access",
   *   items: [
   *     {
   *       label: "Billing and licensing",
   *       icon: "credit_card",
   *       children: [
   *         { href: "/profile?tab=billing_overview", label: "Overview", isChild: true },
   *         { href: "/profile?tab=billing_usage", label: "Usage", isChild: true },
   *         { href: "/profile?tab=billing_ai", label: "AI usage", isChild: true },
   *         { href: "/profile?tab=billing_budgets", label: "Budgets and alerts", isChild: true },
   *       ],
   *     },
   *   ],
   * },
   */
  {
    title: "Administrasi",
    items: [
      {
        href: "/roles",
        mobileHref: "/settings/roles",
        label: "Kelola Role",
        icon: "shield_person",
        permission: "manage-roles",
      },
    ],
  },
];

// ─────────────────────────────────────────────────
// Active-state helpers
// ─────────────────────────────────────────────────

function hrefMatches(
  href: string,
  pathname: string | null,
  searchParams: URLSearchParams | null
): boolean {
  const [hrefPath, hrefQuery] = href.split("?");

  // Pathname must match (exact or prefix for nested routes like /users/pending)
  const pathMatch =
    pathname === hrefPath || (pathname?.startsWith(hrefPath + "/") ?? false);

  if (!pathMatch) return false;

  // If the nav item has a query string, compare the `tab` param
  if (hrefQuery) {
    const expectedTab = new URLSearchParams(hrefQuery).get("tab");
    const actualTab = searchParams?.get("tab") ?? null;
    return expectedTab === actualTab;
  }

  // Item has no query → only active when there is no `tab` query param either
  // (so "/profile" is active only when there's no ?tab=...)
  if (hrefPath === "/profile") {
    return !searchParams?.get("tab");
  }

  return true;
}

// ─────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, hasPermission } = useAuth();
  const activeTab = searchParams.get("tab");

  // Normalisasi: hapus trailing slash agar /settings/ == /settings
  const normalizedPath = (pathname ?? "").replace(/\/$/, "") || "/";

  const urlShowsMobileDetail =
    (normalizedPath !== "/profile" && normalizedPath !== "/settings") ||
    (normalizedPath === "/profile" &&
      (searchParams.get("view") === "detail" || Boolean(activeTab)));
  const isMobileDetail = urlShowsMobileDetail;

  // Collapsible menu state
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "Billing and licensing": true,
  });

  const toggleMenu = (label: string) =>
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  if (!user) return null;

  const userInitials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const activeMobileLabel = NAV_GROUPS.flatMap((group) =>
    group.items.flatMap((item) => (isCollapsible(item) ? item.children : [item]))
  ).find((item) =>
    hrefMatches(item.href, normalizedPath, searchParams) || item.mobileHref === normalizedPath
  )?.label ?? "Pengaturan";

  // ── Render a single link item ──
  const renderLinkItem = (item: SettingsNavItem) => {
    const isActive = hrefMatches(item.href, normalizedPath, searchParams);
    const mobileHref = item.mobileHref ?? item.href;

    return (
      <div
        key={item.href}
        className="relative flex items-center w-full px-3"
      >
        {isActive && (
          <span className="absolute left-[3px] top-1/2 hidden h-[20px] w-[4px] -translate-y-1/2 rounded-full bg-cu-info animate-fade-in lg:block" />
        )}
        <Link
          href={mobileHref}
          className={`flex items-center gap-2.5 rounded-md py-2 text-sm transition-all cursor-pointer w-full text-left lg:hidden ${
            item.isChild ? "pr-3 pl-[42px]" : "px-3"
          } text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/40`}
        >
          {item.icon && <MaterialIcon name={item.icon} size="sm" />}
          <span>{item.label}</span>
        </Link>
        <Link
          href={item.href}
          className={`hidden w-full cursor-pointer items-center gap-2.5 rounded-md py-2 text-left text-sm transition-all lg:flex ${
            item.isChild ? "pr-3 pl-[42px]" : "px-3"
          } ${isActive ? "bg-cu-panel-soft font-semibold text-cu-ink" : "text-cu-muted hover:bg-cu-panel-soft/40 hover:text-cu-ink"}`}
        >
          {item.icon && <MaterialIcon name={item.icon} size="sm" />}
          <span>{item.label}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="flex w-full max-w-7xl flex-col gap-0 lg:mx-auto lg:gap-6">
      {/* Top Profile Header (GitHub Style Personal Account Card) */}
      <div className={`${isMobileDetail ? "hidden lg:flex" : "flex"} flex-col items-start justify-between gap-4 border-b border-cu-line/60 pb-5 pt-1 sm:flex-row sm:items-center lg:pt-4`}>
        <div className="flex items-center gap-4">
          <div
            className={`relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-cu-line sm:size-14 ${
              user.avatar_url ? "bg-white" : "bg-cu-panel-soft"
            }`}
          >
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                className="size-full object-cover"
                alt="Avatar"
              />
            ) : (
              <span className="text-xl font-bold uppercase text-cu-muted">
                {userInitials}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-cu-ink flex flex-col sm:flex-row sm:items-baseline gap-1">
              <span>{user.name}</span>
              <span className="text-sm font-normal text-cu-muted">
                ({user.username})
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-start gap-6 lg:mt-2 lg:flex-row">
        {/* Left sidebar navigation */}
        <nav
          className={`${isMobileDetail ? "hidden lg:block" : "block"} w-full shrink-0 space-y-5 lg:w-64`}
          aria-label="Settings navigation"
        >
          {NAV_GROUPS.map((group) => {
            // Filter items by permission
            const visibleItems = group.items.filter(
              (item) => !item.permission || hasPermission(item.permission)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-cu-muted block">
                  {group.title}
                </span>
                <div className="flex flex-col gap-1 w-full">
                  {visibleItems.map((item) => {
                    // Collapsible parent
                    if (isCollapsible(item)) {
                      const isExpanded = expandedMenus[item.label] ?? false;
                      const visibleChildren = item.children.filter(
                        (c) => !c.permission || hasPermission(c.permission)
                      );
                      if (visibleChildren.length === 0) return null;

                      return (
                        <div key={item.label}>
                          <div className="relative flex items-center w-full px-3">
                            <button
                              onClick={() => toggleMenu(item.label)}
                              type="button"
                              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-cu-ink hover:bg-cu-panel-soft/40 transition-all cursor-pointer w-full text-left font-semibold"
                            >
                              <div className="flex items-center gap-2.5">
                                {item.icon && (
                                  <MaterialIcon name={item.icon} size="sm" />
                                )}
                                <span>{item.label}</span>
                              </div>
                              <MaterialIcon
                                name={isExpanded ? "expand_less" : "expand_more"}
                                size="sm"
                                className="text-cu-muted"
                              />
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="flex flex-col gap-1 w-full">
                              {visibleChildren.map(renderLinkItem)}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Regular link
                    return renderLinkItem(item);
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right content panel */}
        <div className={`${isMobileDetail ? "block" : "hidden lg:block"} w-full flex-1 p-0 sm:p-4`}>
          <div className="mb-5 flex items-center gap-3 border-b border-cu-line pb-4 lg:hidden">
            <Link
              href="/settings"
              aria-label="Kembali ke menu pengaturan"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-ink transition hover:bg-cu-panel-soft"
            >
              <MaterialIcon name="arrow_back" size="sm" />
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">Pengaturan</p>
              <h1 className="truncate text-base font-semibold text-cu-ink">{activeMobileLabel}</h1>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
