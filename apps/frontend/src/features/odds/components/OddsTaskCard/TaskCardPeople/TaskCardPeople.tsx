function initials(name?: string | null) {
  return (name ?? "?").split(" ").filter(Boolean).slice(0, 2).map((item) => item[0]).join("").toUpperCase() || "?";
}

export function TaskCardPerson({ name, role, accent = false, compact = false }: { name: string; role: string; accent?: boolean; compact?: boolean }) {
  return <div className="flex min-w-0 items-center gap-2"><span className={`flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${compact ? "size-6" : "size-7"} ${accent ? "bg-sky-100 text-[#0077bf]" : "bg-slate-100 text-[#3b4446]"}`}>{initials(name)}</span><div className="min-w-0"><p className={`truncate font-semibold text-[#3b4446] ${compact ? "text-[11px]" : "text-[13px]"}`}>{name}</p><p className={`truncate text-[#7d7c7c] ${compact ? "text-[9px]" : "text-[10px]"}`}>{role}</p></div></div>;
}

export function TaskCardPeople({ requesterName, requesterRole, designerName, compact = false }: { requesterName: string; requesterRole: string; designerName: string; compact?: boolean }) {
  if (compact) {
    return <div className="flex min-w-0 items-center gap-1 text-[11px] text-[#3b4446]"><span className="truncate font-medium">{requesterName}</span><span className="shrink-0 text-[#7d7c7c]">|</span><span className="truncate font-medium text-[#0077bf]">{designerName}</span></div>;
  }
  return <div className={`flex min-w-0 ${compact ? "gap-3" : "gap-5"}`}><TaskCardPerson name={requesterName} role={requesterRole} accent compact={compact} /><TaskCardPerson name={designerName} role="Designer" compact={compact} /></div>;
}

export function TaskCardWidePeople({ requesterName, requesterRole, designerName, lineClass }: { requesterName: string; requesterRole: string; designerName: string; lineClass: string }) {
  return (
    <div className="flex flex-col w-full min-w-0 justify-center">
      <div className="min-w-0 px-4 py-2">
        <TaskCardPerson name={requesterName} role={requesterRole} accent compact />
      </div>
      <div className={`min-w-0 border-t px-4 py-2 ${lineClass}`}>
        <TaskCardPerson name={designerName} role="Designer" compact />
      </div>
    </div>
  );
}
