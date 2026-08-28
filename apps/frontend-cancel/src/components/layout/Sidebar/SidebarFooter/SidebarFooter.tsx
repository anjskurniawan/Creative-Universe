import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function SidebarFooter({
  expanded,
  onToggleExpanded,
}: {
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  return (
    <div className="flex w-full items-center border-t border-slate-200 px-1 pt-4">
      <button
        type="button"
        onClick={onToggleExpanded}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"
      >
        <MaterialIcon
          name={expanded ? "left_panel_close" : "left_panel_open"}
          size="sm"
        />
        {expanded && <span>Creative Universe</span>}
      </button>
    </div>
  );
}
