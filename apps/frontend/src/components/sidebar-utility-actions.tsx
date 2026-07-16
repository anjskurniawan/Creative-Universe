"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageBell } from "@/components/message-bell";
import { NotificationBell } from "@/components/notification-bell";
import { SideMenuButton, type SideMenuButtonModel } from "@/components/sidemenu/button";
import { MaterialIcon } from "@/components/material-icon";
import { useAuth } from "@/providers/auth-provider";
import { APP_ROUTES } from "@/core/navigation/routes";
import { APPLICATION_ICONS, visibleSubApplications } from "@/core/applications";

const sidebarPanelPosition = "!absolute !bottom-0 !left-full !right-auto !top-auto !mt-0 !ml-3 !w-[280px]";

export function SidebarUtilityActions({ model }: { model: SideMenuButtonModel }) {
  const { user } = useAuth();

  return (
    <>
      <SidebarAppLauncher model={model} />
      {user && (
        <NotificationBell
          userId={user.id}
          panelClassName={sidebarPanelPosition}
          renderTrigger={({ isOpen, unreadCount, toggle }) => (
            <SideMenuButton
              model={model}
              status={isOpen ? "Hover" : "Default"}
              label="Notifikasi"
              icon="notifications"
              badge={unreadCount || undefined}
              onClick={toggle}
            />
          )}
        />
      )}
      {user && (
        <MessageBell
          userId={user.id}
          panelClassName={sidebarPanelPosition}
          renderTrigger={({ isOpen, unreadCount, toggle }) => (
            <SideMenuButton
              model={model}
              status={isOpen ? "Hover" : "Default"}
              label="Pesan"
              icon="chat"
              badge={unreadCount || undefined}
              onClick={toggle}
            />
          )}
        />
      )}
      <SideMenuButton model={model} label="Pengaturan" icon="settings" href={APP_ROUTES.settings} />
    </>
  );
}

function SidebarAppLauncher({ model }: { model: SideMenuButtonModel }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const applications = visibleSubApplications(user?.applications ?? []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <SideMenuButton
        model={model}
        status={isOpen ? "Hover" : "Default"}
        label="App"
        icon="apps"
        onClick={() => setIsOpen((open) => !open)}
      />
      {isOpen && (
        <div className="absolute bottom-0 left-full z-[120] ml-3 w-[280px] rounded-2xl border-[0.5px] border-[#f2f2f2] bg-white p-1.5 text-[#121212] shadow-xl">
          <ul role="menu" aria-label="Menu aplikasi" className="m-0 flex list-none flex-col gap-1 p-0">
            {applications.map((application) => (
              <SidebarAppMenuItem
                key={application.key}
                href={application.frontend_path!}
                icon={APPLICATION_ICONS[application.key] ?? "apps"}
                label={application.display_name}
                badge={application.status === "experimental" ? "Eksperimen" : undefined}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SidebarAppMenuItem({ href, icon, label, badge, onClick }: { href: string; icon: string; label: string; badge?: string; onClick: () => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="group flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium leading-5 text-[#121212] transition-colors hover:bg-[#f2f2f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-cu-focus/30"
        role="menuitem"
      >
        <MaterialIcon name={icon} size="sm" className="text-cu-muted transition-colors group-hover:text-cu-ink" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {badge && <span className="rounded-full bg-[#f2f2f2] px-1.5 py-0.5 text-[10px] font-semibold text-cu-muted">{badge}</span>}
      </Link>
    </li>
  );
}
