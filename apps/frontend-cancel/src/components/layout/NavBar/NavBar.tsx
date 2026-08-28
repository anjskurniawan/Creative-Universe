"use client";

import { useState } from "react";
import AppIcon from "./AppIcon/AppIcon";
import Avatar from "./Avatar/Avatar";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import ButtonMenu from "./ButtonMenu/ButtonMenu";
import Apps from "./Dropdown/Apps/Apps";
import Message from "./Dropdown/Message/Message";
import Notification from "./Dropdown/Notification/Notification";
import Profile from "./Dropdown/Profile/Profile";
import { DEFAULT_DEVELOPER_APPLICATIONS, DEFAULT_NAVBAR_APPLICATIONS, DEFAULT_NAVBAR_USER } from "./NavBar.config";
import type { NavBarMenu, NavBarProps } from "./NavBar.types";

export type { NavBarProps } from "./NavBar.types";

export default function NavBar({
  user = DEFAULT_NAVBAR_USER,
  applications = DEFAULT_NAVBAR_APPLICATIONS,
  notifications = [],
  messages = [],
  viewport = "Desktop",
  sticky = false,
  breadcrumbItems,
  theme = "light",
  showNavigation = true,
  showApps = true,
  showDeveloper = true,
  showNotifications = true,
  showMessages = true,
  showProfile = true,
  bordered = true,
  className = "",
  onSignOut,
  onMenuClick,
  developerApplications = DEFAULT_DEVELOPER_APPLICATIONS,
  onBack,
  onForward,
}: NavBarProps) {
  const [openMenu, setOpenMenu] = useState<NavBarMenu | null>(null);
  const toggle = (menu: NavBarMenu) => setOpenMenu((current) => current === menu ? null : menu);
  const close = () => setOpenMenu(null);
  const dark = theme === "dark";
  const showDesktopNavigation = showNavigation && viewport !== "Mobile";
  // Keep the mobile trigger in the DOM so CSS can switch it on at the mobile breakpoint,
  // even when the component uses the default Desktop viewport configuration.
  const showMobileNavigation = showNavigation;

  return (
    <header className={`cu-style ${sticky ? "sticky top-0" : "relative"} z-20 flex h-16 shrink-0 items-center justify-between px-4 backdrop-blur-md ${bordered ? (dark ? "border-b border-white/[0.06]" : "border-b border-slate-100") : ""} ${dark ? "bg-black/20" : "bg-white/75"} ${className}`.trim()}>
      <div className="flex items-center gap-4">
        {showMobileNavigation && <div className="lg:hidden"><ButtonMenu icon="menu" label="Menu" dark={dark} size={viewport === "Mobile" ? "sm" : "md"} onClick={onMenuClick} /></div>}
        {showDesktopNavigation && <div className="hidden items-center gap-4 lg:flex"><AppIcon theme={dark ? "dark" : "light"} /><div className="flex items-center gap-1"><ButtonMenu icon="arrow_back" label="Kembali" dark={dark} onClick={onBack ?? (() => window.history.back())} /><ButtonMenu icon="arrow_forward" label="Maju" dark={dark} onClick={onForward ?? (() => window.history.forward())} /></div><Breadcrumb items={breadcrumbItems} dark={dark} /></div>}
      </div>
      <div className="flex items-center gap-1 text-slate-700">
        {showDeveloper && user.isRoot && <div className="relative"><ButtonMenu icon="code" label="Developer tools" active={openMenu === "developer"} onClick={() => toggle("developer")} />{openMenu === "developer" && <Apps applications={developerApplications} onClose={close} />}</div>}
        {showNotifications && <div className="relative"><ButtonMenu icon="notifications" label="Notifications" dark={dark} active={openMenu === "notifications"} onClick={() => toggle("notifications")} />{openMenu === "notifications" && <Notification items={notifications} onClose={close} />}</div>}
        {showMessages && <div className="relative"><ButtonMenu icon="chat_bubble" label="Messages" dark={dark} active={openMenu === "messages"} onClick={() => toggle("messages")} />{openMenu === "messages" && <Message items={messages} onClose={close} />}</div>}
        {showApps && <div className="relative"><ButtonMenu icon="apps" label="Applications" dark={dark} active={openMenu === "apps"} onClick={() => toggle("apps")} />{openMenu === "apps" && <Apps applications={applications} onClose={close} />}</div>}
        {showProfile && <div className="relative"><button type="button" aria-label="Profile" onClick={() => toggle("profile")} className="flex size-10 items-center justify-center rounded-lg p-1 hover:bg-slate-50"><Avatar name={user.name} src={user.avatarUrl} initials={user.initials} active={openMenu === "profile"} /></button>{openMenu === "profile" && <Profile user={user} onClose={close} onSignOut={onSignOut} />}</div>}
      </div>
    </header>
  );
}
