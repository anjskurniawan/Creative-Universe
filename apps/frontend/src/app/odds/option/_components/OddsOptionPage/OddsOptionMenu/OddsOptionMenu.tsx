"use client";

type OddsOptionMenuProps = {
  items: Array<{ label: string; id: string }>;
  activeId?: string;
  onChange?: (id: string) => void;
};

export function OddsOptionMenu({ items, activeId, onChange }: OddsOptionMenuProps) {
  return (
    <nav aria-label="Menu pengaturan" className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const className = `rounded-lg px-3 py-2 text-left text-sm font-medium transition ${item.id === (activeId ?? items[0]?.id) ? "bg-[#e9f7ff] text-[#0077bf]" : "text-[#526677] hover:bg-[#f1f9fd] hover:text-[#0077bf]"}`;
        return <button key={item.id} type="button" onClick={() => onChange?.(item.id)} className={className}>{item.label}</button>;
      })}
    </nav>
  );
}
