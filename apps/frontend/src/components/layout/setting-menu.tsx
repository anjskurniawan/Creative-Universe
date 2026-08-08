"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { useAuth } from "@/providers/auth-provider";
import { NAV_GROUPS, hrefMatches, isCollapsible, type SettingsNavItem } from "@/components/layout/settings-navigation-config";

export default function SettingMenu({ isMobileDetail }: { isMobileDetail: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ "Billing and licensing": true });

  const renderLinkItem = (item: SettingsNavItem) => {
    const isActive = hrefMatches(item.href, pathname, searchParams);
    const mobileHref = item.mobileHref ?? item.href;
    return (
      <div key={item.href} className="relative flex items-center w-full px-3">
        {isActive && <span className="absolute left-[3px] top-1/2 hidden h-[20px] w-[4px] -translate-y-1/2 rounded-full bg-cu-info animate-fade-in lg:block" />}
        <Link href={mobileHref} className={`flex items-center gap-2.5 rounded-md py-2 text-sm transition-all cursor-pointer w-full text-left lg:hidden ${item.isChild ? "pr-3 pl-[42px]" : "px-3"} text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/40`}>
          {item.icon && <MaterialIcon name={item.icon} size="sm" />}<span>{item.label}</span>
        </Link>
        <Link href={item.href} className={`hidden w-full cursor-pointer items-center gap-2.5 rounded-md py-2 text-left text-sm transition-all lg:flex ${item.isChild ? "pr-3 pl-[42px]" : "px-3"} ${isActive ? "bg-cu-panel-soft font-semibold text-cu-ink" : "text-cu-muted hover:bg-cu-panel-soft/40 hover:text-cu-ink"}`}>
          {item.icon && <MaterialIcon name={item.icon} size="sm" />}<span>{item.label}</span>
        </Link>
      </div>
    );
  };

  return (
    <nav className={`${isMobileDetail ? "hidden lg:block" : "block"} w-full space-y-5 lg:col-span-3`} aria-label="Settings navigation">
      {NAV_GROUPS.map((group) => {
        const visibleItems = group.items.filter((item) => !item.permission || hasPermission(item.permission));
        if (visibleItems.length === 0) return null;
        return <div key={group.title} className="space-y-1"><span className="px-3 text-[10px] font-bold uppercase tracking-wider text-cu-muted block">{group.title}</span><div className="flex flex-col gap-1 w-full">{visibleItems.map((item) => {
          if (!isCollapsible(item)) return renderLinkItem(item);
          const isExpanded = expandedMenus[item.label] ?? false;
          const visibleChildren = item.children.filter((child) => !child.permission || hasPermission(child.permission));
          if (visibleChildren.length === 0) return null;
          return <div key={item.label}><div className="relative flex items-center w-full px-3"><button onClick={() => setExpandedMenus((prev) => ({ ...prev, [item.label]: !prev[item.label] }))} type="button" className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-cu-ink hover:bg-cu-panel-soft/40 transition-all cursor-pointer w-full text-left font-semibold"><div className="flex items-center gap-2.5">{item.icon && <MaterialIcon name={item.icon} size="sm" />}<span>{item.label}</span></div><MaterialIcon name={isExpanded ? "expand_less" : "expand_more"} size="sm" className="text-cu-muted" /></button></div>{isExpanded && <div className="flex flex-col gap-1 w-full">{visibleChildren.map(renderLinkItem)}</div>}</div>;
        })}</div></div>;
      })}
    </nav>
  );
}
