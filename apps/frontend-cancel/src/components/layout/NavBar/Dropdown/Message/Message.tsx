import Dropdown from "../Dropdown";
import type { NavBarMessage } from "../../NavBar.types";

export default function Message({ items, onClose }: { items: NavBarMessage[]; onClose: () => void }) {
  return <Dropdown onClose={onClose}><div className="mb-1 border-b border-slate-100 px-2 py-2 font-semibold">Messages</div>{items.length ? items.map((item) => <div role="menuitem" key={item.id} className={`rounded-md px-2 py-2 ${item.unread ? "bg-sky-50" : ""}`}><div className="font-medium">{item.sender}</div><div className="truncate text-xs text-slate-500">{item.preview}</div></div>) : <div className="px-2 py-3 text-slate-500">No messages.</div>}</Dropdown>;
}
