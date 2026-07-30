import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export function NavbarMenuItem({ href, icon, label, tone, badge, onClick, highlighted = false }: { href: string; icon: string; label: string; tone: "light" | "dark" | "transparent-dark"; badge?: string; onClick?: () => void; highlighted?: boolean }) {
  const dark = tone !== "light";
  return <li><Link href={href} onClick={onClick} role="menuitem" className={`group flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium leading-5 transition-colors focus:outline-none focus-visible:ring-2 ${dark ? `${highlighted ? "bg-[#0a0d12]" : ""} text-[#f9fafb] hover:bg-[#0a0d12] focus-visible:ring-white/30` : `${highlighted ? "bg-[#f2f2f2]" : ""} text-[#121212] hover:bg-[#f2f2f2] focus-visible:ring-cu-focus/30`}`}><MaterialIcon name={icon} size="sm" className={dark ? "text-white/55 transition-colors group-hover:text-white" : "text-cu-muted transition-colors group-hover:text-cu-ink"} /><span className="min-w-0 truncate">{label}</span>{badge && <span className="ml-auto rounded-full bg-cu-panel-soft px-2 py-0.5 text-[10px] text-cu-muted">{badge}</span>}</Link></li>;
}
