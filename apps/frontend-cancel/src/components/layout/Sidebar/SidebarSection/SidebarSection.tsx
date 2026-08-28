import SidebarItem from "../SidebarItem/SidebarItem";
import type { SidebarItem as SidebarItemType } from "../Sidebar.types";

export default function SidebarSection({
  items,
  expanded,
  activeHref,
}: {
  items: SidebarItemType[];
  expanded: boolean;
  activeHref?: string;
}) {
  return (
    <nav
      aria-label="Developer navigation"
      className="flex w-full flex-col gap-1"
    >
      {items.map((item, index) => (
        <SidebarItem
          key={`${item.href ?? item.label}-${index}`}
          item={item}
          expanded={expanded}
          activeHref={activeHref}
        />
      ))}
    </nav>
  );
}
