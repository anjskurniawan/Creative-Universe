/* eslint-disable @next/next/no-img-element -- avatar URL berasal dari backend dan dapat memakai host eksternal. */
export function getInitials(name?: string | null) { return name ? name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() : "AK"; }

export function NavbarAvatar({ name, avatarUrl, tone, onClick, expanded }: { name: string; avatarUrl?: string | null; tone: "light" | "dark" | "transparent-dark"; onClick?: () => void; expanded?: boolean }) {
  return <button type="button" onClick={onClick} aria-label="Buka menu akun" aria-expanded={expanded} aria-haspopup="menu" className={`flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition focus:outline-none focus-visible:ring-2 ${tone !== "light" ? "border-white/10 bg-white text-black focus-visible:ring-white/30" : "border-cu-line bg-black text-white focus-visible:ring-black/20"}`}>{avatarUrl ? <img className="size-full object-cover" src={avatarUrl} alt={`Foto profil ${name}`} /> : <span className="text-sm font-semibold">{getInitials(name)}</span>}</button>;
}
