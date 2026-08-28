import { AuthCardHeader } from "@/features/auth/components/AuthCard";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";
export function AuthCardHeaderPreview() { return <PreviewWrapper width="md"><div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white"><AuthCardHeader title="Autentikasi" showCloseButton buttonAriaLabel="Tutup preview" onButtonClick={() => {}} /></div></PreviewWrapper>; }
