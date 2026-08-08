import Sidebar from "@/components/layout/sidebar";
import { PreviewWrapper } from "../preview-wrapper";
export function SidebarPreview() { return <PreviewWrapper width="full"><div className="flex min-h-[260px] w-full justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50"><Sidebar primaryItems={[{ label: "Dashboard", href: "#", icon: "dashboard" }, { label: "Settings", href: "#", icon: "settings" }]} /></div></PreviewWrapper>; }
