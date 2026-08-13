import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SideBarItem } from "@/components/universe/SideBar";
import type { MenuOverlayItem } from "@/components/universe/MenuOverlay/MenuOverlay";

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
  const resolvedActiveHref =
    explicitActiveHref ??
    menuItems.find((item) => item.href === currentHref)?.href ??
    menuItems.find((item) => item.href === pathname)?.href ??
    menuItems
      .filter(
        (item) =>
          item.href &&
          !item.href.includes("?") &&
          pathname.startsWith(`${item.href}/`),
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
  const activeMenuLabel =
    menuItems.find((item) => item.href === resolvedActiveHref)?.label ?? "Menu";
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
