import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export function SideBarFooter({ expanded, onToggleExpanded }: { expanded: boolean; onToggleExpanded?: () => void }) {
  const buttonClass = `flex h-8 items-center rounded-lg text-[#3b4446] transition hover:bg-black/5 focus-visible:outline-none ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"}`;
  return <div className={`flex flex-col gap-1 border-t border-[#e5e5e5] pt-2 ${expanded ? "w-full" : "w-8"}`}><button type="button" onClick={onToggleExpanded} className={buttonClass}><MaterialIcon name="vertical_split" size="auto" className="text-xl" />{expanded && <span className="text-sm font-medium">Ciutkan</span>}</button></div>;
}
