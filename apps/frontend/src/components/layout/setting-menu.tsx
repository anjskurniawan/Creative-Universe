"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  SideNav,
  SideNavHeader,
  SideNavItem,
  SideNavItemContent,
  SideNavItemLink,
  SideNavSection,
  Text,
} from "@react-spectrum/s2/SideNav";
import { useAuth } from "@/providers/auth-provider";
import { NAV_GROUPS, hrefMatches, isCollapsible, type SettingsNavItem } from "@/components/layout/settings-navigation-config";

function getSelectedRoute(pathname: string | null, searchParams: URLSearchParams | null) {
  return NAV_GROUPS.flatMap((group) => group.items.flatMap((item) => (isCollapsible(item) ? item.children : [item])))
    .find((item) => hrefMatches(item.href, pathname, searchParams))?.href ?? null;
}

function renderItem(item: SettingsNavItem, hasPermission: (permission: string) => boolean) {
  if (item.permission && !hasPermission(item.permission)) return null;

  return (
    <SideNavItem key={item.href} id={item.href} href={item.href} textValue={item.label}>
      <SideNavItemContent>
        <SideNavItemLink>
          <Text>{item.label}</Text>
        </SideNavItemLink>
      </SideNavItemContent>
    </SideNavItem>
  );
}

export default function SettingMenu({ isMobileDetail }: { isMobileDetail: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasPermission } = useAuth();
  const selectedRoute = getSelectedRoute(pathname, searchParams);

  return (
    <div className={`${isMobileDetail ? "hidden lg:block" : "block"} w-full lg:col-span-3`}>
      <SideNav aria-label="Settings navigation" selectedRoute={selectedRoute} defaultExpandedKeys={[]}>
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => !item.permission || hasPermission(item.permission));
          if (visibleItems.length === 0) return null;

          return (
            <SideNavSection key={group.title}>
              <SideNavHeader>{group.title}</SideNavHeader>
              {visibleItems.map((item) => {
                if (!isCollapsible(item)) return renderItem(item, hasPermission);

                const visibleChildren = item.children.filter((child) => !child.permission || hasPermission(child.permission));
                if (visibleChildren.length === 0) return null;

                return (
                  <SideNavItem key={item.label} id={item.label} textValue={item.label}>
                    <SideNavItemContent><Text>{item.label}</Text></SideNavItemContent>
                    {visibleChildren.map((child) => renderItem(child, hasPermission))}
                  </SideNavItem>
                );
              })}
            </SideNavSection>
          );
        })}
      </SideNav>
    </div>
  );
}
