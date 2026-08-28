import type { ReactNode } from "react";
import AuthCardFooter from "./AuthCardFooter";
import AuthCardHeader from "./AuthCardHeader";
export default function AuthCard({ title, footerText, children }: { title: string; footerText: string; children: ReactNode }) { return <section className="relative z-10 w-full max-w-[450px] animate-[cu-auth-card-in_700ms_ease-out] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_8px_12px_rgba(0,0,0,0.15)]"><AuthCardHeader title={title} />{children}<AuthCardFooter>{footerText}</AuthCardFooter></section>; }
