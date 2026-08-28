import Breadcrumb from "@/components/layout/NavBar/Breadcrumb/Breadcrumb";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";
export function BreadcrumbPreview() { return <PreviewWrapper width="full"><div className="flex min-h-[120px] w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-6"><Breadcrumb items={["Developer", "Library", "Component"]} /></div></PreviewWrapper>; }
