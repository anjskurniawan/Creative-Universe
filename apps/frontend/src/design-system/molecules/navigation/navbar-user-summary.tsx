/* eslint-disable @next/next/no-img-element -- avatar URL berasal dari backend dan dapat memakai host eksternal. */
import { getInitials } from "@/design-system/atoms/navigation/navbar-avatar";

export function NavbarUserSummary({ name, role, avatarUrl, tone }: { name: string; role: string; avatarUrl?: string | null; tone: "light" | "dark" | "transparent-dark" }) {
  const dark = tone !== "light";
  return <div className={`flex h-16 w-full shrink-0 items-center justify-between rounded-xl border px-3 py-2.5 ${dark ? "border-[#1f2937]" : "border-[#f2f2f2]"}`}><div className="flex min-w-0 flex-1 flex-col gap-1"><p className={`w-full truncate text-sm font-semibold leading-5 ${dark ? "text-[#f9fafb]" : "text-[#121212]"}`}>{name}</p><p className="w-full truncate text-xs leading-4 text-[#9ca3af]">{role.toUpperCase()}</p></div><div className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ${dark ? "bg-white text-black" : "bg-[#121212] text-white"}`}>{avatarUrl ? <img className="size-full object-cover" src={avatarUrl} alt="" /> : <span className="text-xs font-medium">{getInitials(name)}</span>}</div></div>;
}
