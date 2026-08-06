import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export function SidebarFooter({ expanded, onToggleExpanded }: { expanded: boolean; onToggleExpanded?: () => void }) {
  const buttonClass = `flex h-8 items-center rounded-lg text-[#3b4446] transition hover:bg-black/5 focus-visible:outline-none ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"}`;
  return <div className={`flex flex-col gap-1 border-t border-[#e5e5e5] pt-2 ${expanded ? "w-full" : "w-8"}`}><button type="button" onClick={onToggleExpanded} className={buttonClass}><MaterialIcon name="vertical_split" size="auto" className="text-xl" />{expanded && <span className="text-sm font-medium">Ciutkan</span>}</button><Link href="/docs" className={buttonClass}><MaterialIcon name="help_outline" size="auto" className="text-xl" />{expanded && <span className="text-sm font-medium">Bantuan</span>}</Link></div>;
}
