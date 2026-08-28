import Dropdown from "../Dropdown";
import type { NavBarNotification } from "../../NavBar.types";

export default function Notification({ items, onClose }: { items: NavBarNotification[]; onClose: () => void }) {
  return <Dropdown onClose={onClose}><div className="mb-1 border-b border-slate-100 px-2 py-2 font-semibold">Notifications</div>{items.length ? items.map((item) => <div role="menuitem" key={item.id} className={`rounded-md px-2 py-2 ${item.read ? "text-slate-500" : "bg-sky-50 text-slate-800"}`}><div className="font-medium">{item.title}</div><div className="text-xs text-slate-500">{item.content}</div></div>) : <div className="px-2 py-3 text-slate-500">No notifications.</div>}</Dropdown>;
}
