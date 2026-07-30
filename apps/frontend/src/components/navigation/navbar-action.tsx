import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export type NavbarTone = "light" | "dark" | "transparent-dark";
export const navbarActionClass = (tone: NavbarTone) => `relative inline-flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full p-1 transition-colors focus:outline-none focus-visible:ring-2 ${tone !== "light" ? "text-white hover:bg-white/10 focus-visible:ring-white/30" : "text-black hover:bg-black/5 focus-visible:ring-black/20"}`;

export function NavbarAction({ icon, label, tone, href, onClick }: { icon: string; label: string; tone: NavbarTone; href?: string; onClick?: () => void }) {
  const content = <><span className="sr-only">{label}</span><MaterialIcon name={icon} size="md" /></>;
  return href ? <Link href={href} title={label} aria-label={label} className={navbarActionClass(tone)}>{content}</Link> : <button type="button" aria-label={label} className={navbarActionClass(tone)} onClick={onClick}>{content}</button>;
}
