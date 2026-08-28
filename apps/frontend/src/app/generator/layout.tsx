import type { ReactNode } from "react";
import NavBar from "@/components/layout/NavBar/NavBar";

export default function GeneratorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-black text-white">
      <NavBar theme="dark" sticky={false} viewport="Desktop" />
      <div className="flex flex-1 flex-col w-full mx-auto pt-16 pb-8 px-6 md:px-16 relative z-10">
        {children}
      </div>
    </div>
  );
}
