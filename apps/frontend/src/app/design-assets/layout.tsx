import type { ReactNode } from "react";
import ProductionNavbar from "@/components/layout/navbar";

export default function DesignAssetsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-white text-cu-ink">
      <ProductionNavbar theme="light" sticky={true} viewport="Desktop" />
      <div className="flex flex-1 flex-col w-full mx-auto pt-0 pb-8 px-6 md:px-16 relative z-10">
        {children}
      </div>
    </div>
  );
}
