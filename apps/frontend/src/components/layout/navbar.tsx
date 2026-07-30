"use client";

import { useCallback, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { useAuth } from "@/providers/auth-provider";
import { APP_ROUTES } from "@/core/navigation/routes";
import { APPLICATION_ICONS, visibleSubApplications } from "@/core/applications";
import { apiFetch, resolveStorageUrl } from "@/core/api/client";
import { chatApi } from "@/core/chat";
import AppIcon from "./navbar/app-icon";
import Avatar from "./navbar/avatar";
import Breadcrumb from "./navbar/breadcrumb";
import ButtonMenu from "./navbar/button-menu";
import AppsDropdown from "./navbar/apps-dropdown";
import MessageDropdown from "./navbar/message-dropdown";
import NotificationDropdown from "./navbar/notification-dropdown";
import ProfileDropdown from "./navbar/profile-dropdown";

export type GlobalLayoutNavbarProps = { viewport?: "Mobile" | "Desktop"; sticky?: boolean; breadcrumbItems?: string[]; theme?: "light" | "dark" | "retro" };

export default function GlobalLayoutNavbar({ sticky = false, breadcrumbItems, viewport = "Desktop", theme = "light", onMenuClick }: GlobalLayoutNavbarProps & { onMenuClick?: () => void }) {
  const auth = useAuth();
  const { user } = auth;
  const [openMenu, setOpenMenu] = useState<"developer" | "notifications" | "messages" | "apps" | "profile" | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; sender: string; preview: string; time: string; unread?: boolean }>>([]);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; content: string; time: string; read?: boolean; icon?: string }>>([]);
  const toggle = (menu: typeof openMenu) => setOpenMenu((current) => current === menu ? null : menu);
  const dark = theme === "dark";
  const historyButtons = <div className="flex items-center gap-0.5"><button type="button" onClick={() => window.history.back()} aria-label="Kembali" className={`flex size-8 items-center justify-center rounded-lg transition ${dark ? "text-[#e3e3e3] hover:bg-white/10" : "text-[#3b4446] hover:bg-slate-100"}`}><MaterialIcon name="arrow_back" size="sm" /></button><button type="button" onClick={() => window.history.forward()} aria-label="Maju" className={`flex size-8 items-center justify-center rounded-lg transition ${dark ? "text-[#e3e3e3] hover:bg-white/10" : "text-[#3b4446] hover:bg-slate-100"}`}><MaterialIcon name="arrow_forward" size="sm" /></button></div>;
  const applications = useMemo(() => (user?.applications?.length ? visibleSubApplications(user.applications).map((app) => ({ key: app.key, display_name: app.display_name, href: app.frontend_path ?? "#", icon: APPLICATION_ICONS[app.key] ?? "apps" })) : [
    { key: "core", display_name: "Core", href: "/dashboard", icon: "apps" },
    { key: "kv-retail", display_name: "KV Retail Task", href: "/kv-retail", icon: "apps" },
    { key: "creative-report", display_name: "Creative Report", href: "/creative-report", icon: "apps" },
    { key: "odds", display_name: "One Dashboard Design System", href: "/odds", icon: "apps" },
    { key: "generator", display_name: "Generator", href: "/generator/pricetag", icon: "apps" },
    { key: "creative-ai", display_name: "Creative AI", href: "/creative-ai", icon: "apps" },
    { key: "design-assets", display_name: "Design Assets", href: "/design-assets", icon: "apps" },
  ]), [user]);
  const refreshBackendDropdowns = useCallback(async () => {
    if (!user) return;
    const [conversations, notificationResult] = await Promise.allSettled([
      chatApi.conversations({ skipAuthRedirect: true }),
      apiFetch<{ notifications: Array<{ id: string; message: string; type: string; created_at: string | null; is_read: boolean }> }>("/notifications"),
    ]);
    if (conversations.status === "fulfilled") setMessages(conversations.value.map((conversation) => ({ id: String(conversation.id), sender: conversation.task?.task_number ?? conversation.partner?.name ?? "Conversation", preview: conversation.last_message?.body ?? "No message preview.", time: conversation.last_message?.created_at ?? conversation.updated_at ?? "", unread: conversation.last_message?.is_read === false, avatarUrl: resolveStorageUrl(conversation.partner?.avatar_path ?? conversation.partner?.avatar) ?? undefined })));
    if (notificationResult.status === "fulfilled") setNotifications(notificationResult.value.notifications.map((notification) => ({ id: String(notification.id), title: notification.type || "Notification", content: notification.message, time: notification.created_at ?? "", read: notification.is_read, icon: "notifications" })));
  }, [user]);
  return <header className={`${sticky ? "sticky top-0" : "relative"} z-20 flex h-16 shrink-0 items-center justify-between px-4 backdrop-blur-md ${dark ? "border-b border-white/[0.06] bg-[#111413]/55" : "border-b border-slate-100 bg-[rgba(255,255,255,0.55)]"}`}>
    {viewport === "Mobile" ? <button type="button" onClick={onMenuClick} className="flex size-10 items-center justify-center" aria-label="Menu"><ButtonMenu icon="menu" dark={dark} /></button> : <div className="relative flex shrink-0 items-center gap-4"><AppIcon />{historyButtons}<Breadcrumb items={breadcrumbItems} dark={dark} /></div>}
    <div className="flex h-full items-center gap-1">
      <div className="relative flex h-full items-center"><button type="button" data-dropdown-trigger onClick={() => toggle("developer")} className="flex h-full w-10 items-center justify-center"><ButtonMenu icon="code" dark={dark} state={openMenu === "developer" ? "Focus" : "Default"} /></button>{openMenu === "developer" && <AppsDropdown isOpen onClose={() => setOpenMenu(null)} applications={[{ key: "maintenance", display_name: "Maintenance", href: "/maintenance", icon: "build" }]} />}</div>
      <div className="relative flex h-full items-center"><button type="button" data-dropdown-trigger onClick={() => { toggle("notifications"); void refreshBackendDropdowns(); }} className="flex h-full w-10 items-center justify-center"><ButtonMenu icon="notifications" dark={dark} state={openMenu === "notifications" ? "Focus" : "Default"} /></button>{openMenu === "notifications" && <NotificationDropdown isOpen onClose={() => setOpenMenu(null)} notifications={notifications} />}</div>
      <div className="relative flex h-full items-center"><button type="button" data-dropdown-trigger onClick={() => { toggle("messages"); void refreshBackendDropdowns(); }} className="flex h-full w-10 items-center justify-center"><ButtonMenu icon="chat_bubble" dark={dark} state={openMenu === "messages" ? "Focus" : "Default"} /></button>{openMenu === "messages" && <MessageDropdown isOpen onClose={() => setOpenMenu(null)} messages={messages} />}</div>
      <div className="relative flex h-full items-center"><button type="button" data-dropdown-trigger onClick={() => toggle("apps")} className="flex h-full w-10 items-center justify-center"><ButtonMenu icon="apps" dark={dark} state={openMenu === "apps" ? "Focus" : "Default"} /></button>{openMenu === "apps" && <AppsDropdown isOpen onClose={() => setOpenMenu(null)} applications={applications} />}</div>
      <div className="relative flex h-full items-center"><button type="button" data-dropdown-trigger aria-label="Profile" onClick={() => toggle("profile")} className={`flex h-full w-10 items-center justify-center rounded-lg p-1 ${dark ? "hover:bg-white/10" : "hover:bg-slate-100/50"}`}><Avatar name={user?.name ?? "Creative Universe"} src={user?.avatar_url} dark={dark} state={openMenu === "profile" ? "Focus" : "Default"} /></button>{openMenu === "profile" && <ProfileDropdown isOpen onClose={() => setOpenMenu(null)} user={{ name: user?.name ?? "User", role: user?.roles[0] ?? "User", avatarUrl: user?.avatar_url, initials: user?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "U" }} menuItems={[{ label: "Profile", href: APP_ROUTES.profile, icon: "person" }, { label: "Dashboard", href: APP_ROUTES.dashboard, icon: "dashboard" }, { label: "Settings", href: APP_ROUTES.settings, icon: "settings" }, { label: "Help Center", href: APP_ROUTES.documentation, icon: "help" }]} onSignOut={() => void auth.logout()} />}</div>
    </div>
  </header>;
}
