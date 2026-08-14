import type { AccessibleApplication } from "@/core/applications";

export type PlanetConfig = { orbit: "outer" | "middle"; position: string; color: string };

export interface AppUniverseProps {
  applications: AccessibleApplication[];
  isReady: boolean;
  className?: string;
  isExiting?: boolean;
}
