import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SideBarItem } from "@/components/layout/SideBar";
import type { MenuOverlayItem } from "@/components/layout/Workspace/MenuOverlay/MenuOverlay";

export function useWorkspaceLogic(
  menuItems: MenuOverlayItem[],
  activeMenuHref: string,
  onMenuItemClick?: (item: MenuOverlayItem, index: number) => void,
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const query = searchParams.toString();
  const currentHref = query ? `${pathname}?${query}` : pathname;
  const explicitActiveHref = menuItems.find((item) => item.isActive)?.href;

  // 1. Cocokkan explicitActiveHref
  // 2. Cocokkan exact match dengan currentHref (termasuk query)
  // 3. Cocokkan exact match dengan pathname murni
  // 4. Jika pathname berada di bawah path item (misal /panel/users/create di bawah /panel/users)
  // 5. Khusus route dashboard / root sub-app: jika pathname === '/panel' dan item.href === '/panel/detail' atau sebaliknya
  const resolvedActiveHref =
    explicitActiveHref ??
    menuItems.find((item) => item.href === currentHref)?.href ??
    menuItems.find((item) => item.href === pathname)?.href ??
    (pathname === "/panel" ? menuItems.find((item) => item.href === "/panel/detail" || item.href === "/panel")?.href : undefined) ??
    menuItems
      .filter(
        (item) =>
          item.href &&
          item.href !== "/" &&
          !item.href.includes("?") &&
          (pathname.startsWith(`${item.href}/`) || (item.href === "/panel/detail" && pathname === "/panel")),
      )
      .sort(
        (left, right) => (right.href?.length ?? 0) - (left.href?.length ?? 0),
      )[0]?.href ??
    activeMenuHref;

  const sidebarItems = useMemo<SideBarItem[]>(
    () =>
      menuItems.map((item) => ({
        ...item,
        icon: item.icon ?? "folder",
        isActive: resolvedActiveHref ? item.href === resolvedActiveHref : false,
      })),
    [menuItems, resolvedActiveHref],
  );

  const matchedItem = menuItems.find((item) => item.href === resolvedActiveHref);
  const activeMenuLabel =
    matchedItem?.label ??
    (pathname.includes("/detail") || pathname.includes("/dashboard")
      ? "Dashboard"
      : pathname.includes("/users")
      ? "Pengguna"
      : pathname.includes("/roles")
      ? "Role"
      : pathname.includes("/maintenance")
      ? "Maintenance"
      : pathname.includes("/profile")
      ? "Profil"
      : "Dashboard");
  const handleMenuItemClick = (item: MenuOverlayItem, index: number) => {
    setMenuOpen(false);
    if (onMenuItemClick) {
      onMenuItemClick(item, index);
      return;
    }
    if (item.href && item.href !== currentHref) router.push(item.href);
  };

  return {
    pathname,
    currentHref,
    menuOpen,
    setMenuOpen,
    resolvedActiveHref,
    sidebarItems,
    activeMenuLabel,
    handleMenuItemClick,
  };
}
