import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export function Button({ label, icon, onClick, disabled = false, variant = "default" }: { label: string; icon: string; onClick?: () => void; disabled?: boolean; variant?: "default" | "blue" | "red" }) {
  const blue = variant === "blue";
  const red = variant === "red";
  return <button type="button" disabled={disabled} onClick={onClick} className={`inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A4FF]/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${blue ? "border border-[#00A4FF] bg-[#00A4FF] text-white hover:bg-[#0095E8] active:bg-[#0088D5] disabled:hover:bg-[#00A4FF]" : red ? "border border-red-500 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:hover:bg-red-500" : "border border-[#BDEAFF] bg-white text-[#04044A] hover:bg-[#F3FAFF] hover:text-[#00A4FF] active:bg-[#E5F6FF] disabled:hover:bg-white disabled:hover:text-[#04044A]"}`}><MaterialIcon name={icon} size="sm" />{label}{disabled && <span className="rounded bg-current/10 px-1.5 py-0.5 text-[8px] font-bold tracking-normal">Soon</span>}</button>;
}
