"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { useAuth } from "@/hooks/auth";
import { APP_ROUTES } from "@/core/navigation/routes";
import { APPLICATION_ICONS, visibleSubApplications } from "@/core/applications";
import { useCommunicationActions } from "@/hooks/communication-actions";
import AppIcon from "./AppIcon/AppIcon";
import Avatar from "./Avatar/Avatar";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import ButtonMenu from "./ButtonMenu/ButtonMenu";
import AppsDropdown from "./Dropdown/AppsDropdown/AppsDropdown";
import ProfileDropdown from "./Dropdown/ProfileDropdown/ProfileDropdown";

export type NavBarProps = {
  viewport?: "Mobile" | "Desktop";
  responsiveNavigation?: boolean;
  sticky?: boolean;
  breadcrumbItems?: string[];
  theme?: "light" | "dark" | "retro";
  showNavigation?: boolean;
  showApps?: boolean;
  bordered?: boolean;
  className?: string;
};

export default function NavBar({
  sticky = false,
  responsiveNavigation = false,
  breadcrumbItems,
  viewport = "Desktop",
  theme = "light",
  showNavigation = true,
  showApps = true,
  bordered = true,
  className = "",
  onMenuClick,
}: NavBarProps & { onMenuClick?: () => void }) {
  const auth = useAuth();
  const {
    refreshNavDropdowns,
    renderNavMessageDropdown,
    renderNavNotificationDropdown,
  } = useCommunicationActions();
  const { user } = auth;
  const pathname = usePathname();
  const isCreativeAi = pathname.startsWith("/creative-ai");
  
  const [openMenu, setOpenMenu] = useState<
    "developer" | "notifications" | "messages" | "apps" | "profile" | null
  >(null);
  
  const toggle = (menu: typeof openMenu) =>
    setOpenMenu((current) => (current === menu ? null : menu));

  // Keterangan Tema (Dark / Light Theme Indicator)
  const dark = theme === "dark";

  // History Navigation Buttons styling:
  // - Dark theme: text-[#e3e3e3] hover:bg-white/10
  // - Light theme: text-[#3b4446] hover:bg-slate-100
  const historyButtons = (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => window.history.back()}
        aria-label="Kembali"
        className={`flex size-8 items-center justify-center rounded-lg transition ${
          dark ? "text-[#e3e3e3] hover:bg-white/10" : "text-[#3b4446] hover:bg-slate-100"
        }`}
      >
        <MaterialIcon name="arrow_back" size="sm" />
      </button>
      <button
        type="button"
        onClick={() => window.history.forward()}
        aria-label="Maju"
        className={`flex size-8 items-center justify-center rounded-lg transition ${
          dark ? "text-[#e3e3e3] hover:bg-white/10" : "text-[#3b4446] hover:bg-slate-100"
        }`}
      >
        <MaterialIcon name="arrow_forward" size="sm" />
      </button>
    </div>
  );

  const applications = useMemo(
    () =>
      user?.applications?.length
        ? visibleSubApplications(user.applications).map((app) => ({
            key: app.key,
            display_name: app.display_name,
            href: app.frontend_path ?? "#",
            icon: APPLICATION_ICONS[app.key] ?? "apps",
          }))
        : [
            { key: "core", display_name: "Core", href: "/panel", icon: "apps" },
            { key: "kv-retail", display_name: "KV Retail Task", href: "/kv-retail", icon: "apps" },
            { key: "creative-report", display_name: "Creative Report", href: "/creative-report", icon: "apps" },
            { key: "odds", display_name: "One Dashboard Design System", href: "/odds", icon: "apps" },
            { key: "generator", display_name: "Generator", href: "/generator/pricetag", icon: "apps" },
            { key: "creative-ai", display_name: "Creative AI", href: "/creative-ai", icon: "apps" },
            { key: "design-assets", display_name: "Design Assets", href: "/design-assets", icon: "apps" },
          ],
    [user]
  );

  return (
    <header
      className={`
        ${sticky ? "sticky top-0" : "relative"} 
        z-20 flex h-16 shrink-0 items-center justify-between px-4 backdrop-blur-md 
        /* Border styling:
           - Dark: border-white/[0.06]
           - Light: border-slate-100 */
        ${bordered ? (dark ? "border-b border-white/[0.06]" : "border-b border-slate-100") : ""} 
        /* Background styling:
           - Dark: bg-black/20
           - Light: bg-white/55 */
        ${dark ? "bg-black/20" : "bg-white/55"} 
        cu-style ${className}
      `}
    >
      {showNavigation &&
        (viewport === "Mobile" ? (
          <button type="button" onClick={onMenuClick} className="flex size-8 items-center justify-center lg:hidden" aria-label="Menu">
            <ButtonMenu icon="menu" dark={dark} />
          </button>
        ) : responsiveNavigation ? (
          <>
            <button
              type="button"
              onClick={onMenuClick}
              className="flex size-10 items-center justify-center lg:hidden"
              aria-label="Menu"
            >
              <ButtonMenu icon="menu" dark={dark} />
            </button>
            <div className="relative hidden shrink-0 items-center gap-4 lg:flex">
              <AppIcon theme={theme === "dark" ? "dark" : "light"} />
              {!isCreativeAi && historyButtons}
              {!isCreativeAi && <Breadcrumb items={breadcrumbItems} dark={dark} />}
            </div>
          </>
        ) : (
          <>
            <button type="button" onClick={onMenuClick} className="flex size-8 items-center justify-center lg:hidden" aria-label="Menu">
              <ButtonMenu icon="menu" dark={dark} />
            </button>
            <div className="relative hidden shrink-0 items-center gap-4 lg:flex">
            <AppIcon theme={theme === "dark" ? "dark" : "light"} />
            {!isCreativeAi && historyButtons}
            {!isCreativeAi && <Breadcrumb items={breadcrumbItems} dark={dark} />}
            </div>
          </>
        ))}
        
      <div className="ml-auto flex h-full items-center gap-1">
        {user?.roles?.some((role) => role.toLowerCase() === "root") && (
          <div className="relative flex h-full items-center">
            <button
              type="button"
              data-dropdown-trigger
              onClick={() => toggle("developer")}
              className="flex h-full w-10 items-center justify-center"
            >
              <ButtonMenu icon="code" dark={dark} state={openMenu === "developer" ? "Focus" : "Default"} />
            </button>
            {openMenu === "developer" && (
              <AppsDropdown
                isOpen
                onClose={() => setOpenMenu(null)}
                applications={[{ key: "maintenance", display_name: "Maintenance", href: "/maintenance", icon: "build" }]}
              />
            )}
          </div>
        )}
        
        {/* Notifications Dropdown Trigger */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            data-dropdown-trigger
            onClick={() => {
              toggle("notifications");
              void refreshNavDropdowns();
            }}
            className="flex h-full w-10 items-center justify-center"
          >
            <ButtonMenu
              icon="notifications"
              dark={dark}
              state={openMenu === "notifications" ? "Focus" : "Default"}
            />
          </button>
          {openMenu === "notifications" && (
            renderNavNotificationDropdown({ isOpen: true, onClose: () => setOpenMenu(null) })
          )}
        </div>
        
        {/* Messages Dropdown Trigger */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            data-dropdown-trigger
            onClick={() => {
              toggle("messages");
              void refreshNavDropdowns();
            }}
            className="flex h-full w-10 items-center justify-center"
          >
            <ButtonMenu
              icon="chat_bubble"
              dark={dark}
              state={openMenu === "messages" ? "Focus" : "Default"}
            />
          </button>
          {openMenu === "messages" && (
            renderNavMessageDropdown({ isOpen: true, onClose: () => setOpenMenu(null) })
          )}
        </div>
        
        {/* Sub-Apps Dropdown Trigger */}
        {showApps && <div className="relative flex h-full items-center">
          <button
            type="button"
            data-dropdown-trigger
            onClick={() => toggle("apps")}
            className="flex h-full w-10 items-center justify-center"
          >
            <ButtonMenu icon="apps" dark={dark} state={openMenu === "apps" ? "Focus" : "Default"} />
          </button>
          {openMenu === "apps" && (
            <AppsDropdown isOpen onClose={() => setOpenMenu(null)} applications={applications} />
          )}
        </div>}
        
        {/* Profile Dropdown Trigger */}
        {/* Hover styling:
            - Dark: hover:bg-white/10
            - Light: hover:bg-slate-100/50 */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            data-dropdown-trigger
            aria-label="Profile"
            onClick={() => toggle("profile")}
            className={`flex h-full w-10 items-center justify-center rounded-lg p-1 ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100/50"
            }`}
          >
            <Avatar
              name={user?.name ?? "Creative Universe"}
              src={user?.avatar_url}
              dark={dark}
              state={openMenu === "profile" ? "Focus" : "Default"}
            />
          </button>
          {openMenu === "profile" && (
            <ProfileDropdown
              isOpen
              onClose={() => setOpenMenu(null)}
              user={{
                name: user?.name ?? "User",
                role: user?.roles[0] ?? "User",
                avatarUrl: user?.avatar_url,
                initials:
                  user?.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase() ?? "U",
              }}
              menuItems={[
                { label: "Profile", href: APP_ROUTES.profile, icon: "person" },
                { label: "Dashboard", href: APP_ROUTES.dashboard, icon: "dashboard" },
                { label: "Settings", href: APP_ROUTES.settings, icon: "settings" },
              ]}
              onSignOut={() => void auth.logout()}
            />
          )}
        </div>
      </div>
    </header>
  );
}
