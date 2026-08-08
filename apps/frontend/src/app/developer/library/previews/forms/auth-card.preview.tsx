import { AuthCard } from "@/components/auth/auth-card";
import { PreviewWrapper } from "../preview-wrapper";
export function AuthCardPreview() { return <PreviewWrapper width="md"><AuthCard title="Autentikasi" footerText="Butuh bantuan?" showCloseButton onHeaderButtonClick={() => {}}><div className="w-full space-y-3 p-6"><div className="h-10 rounded-lg bg-slate-100" /><div className="h-10 rounded-lg bg-slate-100" /></div></AuthCard></PreviewWrapper>; }
