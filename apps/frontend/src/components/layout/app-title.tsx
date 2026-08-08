"use client";

import { MaterialIcon } from "@/components/ui/material-icon";

interface AppTitleProps {
  title: string;
  subtitle: string;
  icon?: string;
}

export function AppTitle({ title, subtitle, icon }: AppTitleProps) {
  return (
    <div className="w-full flex-1 min-h-[70vh] flex flex-col items-center justify-center text-center p-6 md:p-12 relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(109,70,235,0.03)] transition-all duration-300">
      {/* Decorative Aurora Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00a4ff]/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#6d46eb]/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-6">
        {/* Animated App Icon Wrapper */}
        {icon && (
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6d46eb]/10 to-[#00a4ff]/10 border border-[#6d46eb]/20 shadow-inner group hover:scale-110 transition-transform duration-300">
            <MaterialIcon 
              name={icon} 
              className="text-[#6d46eb] text-4xl group-hover:text-[#00a4ff] transition-colors duration-300" 
            />
          </div>
        )}

        {/* Title and Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-800">
            <span className="bg-gradient-to-r from-[#6d46eb] via-[#5263eb] to-[#00a4ff] bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-base md:text-lg text-[#7b868a] leading-relaxed max-w-lg mx-auto font-medium">
            {subtitle}
          </p>
        </div>

        {/* Subtle Decorative Bottom Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-[#6d46eb] to-[#00a4ff] rounded-full opacity-60" />
      </div>
    </div>
  );
}
