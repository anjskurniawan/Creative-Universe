import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { SidebarItem as SidebarItemType } from "../Sidebar.types";

export default function SidebarItem({
  item,
  expanded,
  activeHref,
}: {
  item: SidebarItemType;
  expanded: boolean;
  activeHref?: string;
}) {
  const active = item.isActive || (!!item.href && item.href === activeHref);
  const content = (
    <>
      <MaterialIcon name={item.icon ?? "folder"} size="sm" />
      <span className={expanded ? "truncate" : "sr-only"}>{item.label}</span>
      {expanded && item.badge !== undefined && (
        <span className="ml-auto text-xs">{item.badge}</span>
      )}
    </>
  );
  return item.href ? (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-sky-500 font-semibold text-white" : "text-slate-700 hover:bg-slate-100"}`}
    >
      {content}
    </Link>
  ) : (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
    >
      {content}
    </button>
  );
}
