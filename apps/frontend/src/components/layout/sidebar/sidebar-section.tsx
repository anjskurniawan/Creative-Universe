import { Fragment } from "react";
import { SidebarItem } from "./sidebar-item";
import type { SidebarItem as SidebarItemData } from "./sidebar.types";

export function SidebarSection({ items, expanded, activeHref, settingsHref }: { items: SidebarItemData[]; expanded: boolean; activeHref: string; settingsHref?: string }) {
  const render = (item: SidebarItemData) => <SidebarItem item={item} expanded={expanded} activeHref={activeHref} />;
  return <div className={`flex flex-col gap-2 ${expanded ? "w-full" : "w-8"}`}><div className="flex flex-col gap-1">{items.map((item, index) => <Fragment key={item.label}>{index > 0 && item.group && item.group !== items[index - 1]?.group && <span className="my-2 h-px w-full border-t border-[#e5e5e5]" />}{render(item)}</Fragment>)}</div>{settingsHref && <div className="border-t border-[#e5e5e5] pt-2">{render({ label: "Setting", icon: "settings", href: settingsHref })}</div>}</div>;
}
