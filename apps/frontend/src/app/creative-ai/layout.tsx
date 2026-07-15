"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Navbar } from "@/components/navbar";

export default function CreativeAiLayout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const syncTheme = () => setDark(document.body.classList.contains("creative-ai-dark-active"));
    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-cu-ink antialiased">
      <div className="absolute left-0 top-0 z-[100] w-full">
        <Navbar variant={dark ? "dark" : "light"} sticky={false} />
      </div>
      <div className="relative z-10 flex w-full flex-1 flex-col">{children}</div>
    </div>
  );
}
