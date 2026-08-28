import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import Dropdown from "../Dropdown";
import type { NavBarUser } from "../../NavBar.types";

export default function Profile({ user, onClose, onSignOut }: { user: NavBarUser; onClose: () => void; onSignOut?: () => void }) {
  return <Dropdown onClose={onClose}><div className="border-b border-slate-100 px-2 py-2"><div className="font-semibold">{user.name}</div><div className="text-xs text-slate-500">{user.role ?? "User"}</div></div>{[["Profile", "/profile", "person"], ["Dashboard", "/panel", "dashboard"], ["Settings", "/settings", "settings"]].map(([label, href, icon]) => <Link role="menuitem" key={label} href={href} onClick={onClose} className="flex items-center gap-3 rounded-md px-2 py-2 text-slate-700 hover:bg-slate-50"><MaterialIcon name={icon} size="sm" />{label}</Link>)}{onSignOut && <button type="button" role="menuitem" onClick={() => { onClose(); onSignOut(); }} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-red-600 hover:bg-red-50"><MaterialIcon name="logout" size="sm" />Sign out</button>}</Dropdown>;
}
