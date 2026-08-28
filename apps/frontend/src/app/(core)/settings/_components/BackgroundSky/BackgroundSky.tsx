import type { ReactNode } from "react";

interface BackgroundSkyProps {
  children: ReactNode;
}

export function BackgroundSky({ children }: BackgroundSkyProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
      {children}
    </div>
  );
}
