import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import Dropdown from "../Dropdown";
import type { NavBarApplication } from "../../NavBar.types";

export default function Apps({ applications, onClose }: { applications: NavBarApplication[]; onClose: () => void }) {
  return <Dropdown onClose={onClose}>{applications.map((app) => <Link role="menuitem" key={app.key} href={app.href} onClick={onClose} className="flex items-center gap-3 rounded-md px-2 py-2 text-slate-700 hover:bg-slate-50"><MaterialIcon name={app.icon ?? "apps"} size="sm" /><span className="truncate">{app.display_name}</span></Link>)}</Dropdown>;
}
