import { AuthCard } from "@/features/auth/components/AuthCard";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";
export function AuthCardPreview() { return <PreviewWrapper width="md"><AuthCard title="Autentikasi" footerText="Butuh bantuan?" showCloseButton onHeaderButtonClick={() => {}}><div className="w-full space-y-3 p-6"><div className="h-10 rounded-lg bg-slate-100" /><div className="h-10 rounded-lg bg-slate-100" /></div></AuthCard></PreviewWrapper>; }
