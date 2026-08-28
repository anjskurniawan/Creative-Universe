import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import type { SideBarItem } from "../SideBar.types";

export function SideBarItem({ item, expanded, activeHref }: { item: SideBarItem; expanded: boolean; activeHref: string }) {
  const active = item.isActive ?? item.href === activeHref;
  const itemClass = active ? "bg-[#00a4ff] text-white" : item.isHighlighted ? "border-[#00a4ff] text-[#00a4ff]" : "text-[#3b4446] hover:bg-black/5";
  return <Link href={item.href ?? "#"} aria-current={active ? "page" : undefined} className={`flex h-8 items-center rounded-lg border-2 border-transparent transition ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"} ${itemClass}`}><span className="relative flex items-center justify-center"><MaterialIcon name={item.icon} size="auto" className="shrink-0 text-xl" />{!expanded && item.badge !== undefined && <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ec4899] px-1 text-[9px] font-semibold text-white">{item.badge}</span>}</span>{expanded && <span className="flex-1 truncate text-sm font-medium">{item.label}</span>}</Link>;
}
