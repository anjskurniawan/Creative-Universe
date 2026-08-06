import ProfileCard from "@/components/layout/profile/card";
import Content from "@/components/layout/content";
import Breadcrumb from "@/components/layout/navbar/breadcrumb";
import Sidebar from "@/components/layout/sidebar";

export function ProfileCardPreview() {
  return (
    <div className="flex min-h-[200px] w-full justify-center rounded-xl border border-slate-100 bg-slate-50 p-6">
      <div className="w-80">
        <ProfileCard name="Rian Setiawan" role="Lead Frontend Engineer" departments={["Creative Tech"]} />
      </div>
    </div>
  );
}

export function ContentPreview() {
  return <div className="w-full"><Content className="h-48 rounded-xl border border-slate-100 bg-slate-50 p-6"><p className="text-sm text-slate-600">Area content utama.</p></Content></div>;
}

export function BreadcrumbPreview() {
  return <div className="flex min-h-[120px] w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-6"><Breadcrumb items={["Developer", "Library", "Component"]} /></div>;
}

export function SidebarPreview() {
  return <div className="flex min-h-[260px] w-full justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50"><Sidebar primaryItems={[{ label: "Dashboard", href: "#", icon: "dashboard" }, { label: "Settings", href: "#", icon: "settings" }]} /></div>;
}
