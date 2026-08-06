"use client";

import { useAuth } from "@/providers/auth-provider";
import { useStatus } from "./hooks/use-status";
import { useEmergency } from "./hooks/use-emergency";
import { useConsole } from "./hooks/use-console";

export function useMaintenance() {
  const { hasRole } = useAuth();
  const isRoot = hasRole("Root");

  const { status, loading: isLoading, load } = useStatus();
  const { active: emergencyActive, loading: isEmergencyLoading, saving: isEmergencySaving, toggle: updateEmergencyMode } = useEmergency();
  
  const { executing: isExecuting, output: consoleOutput, active: activeCommand, run: runCommand, clear: clearConsole } = useConsole(() => {
    void load(true);
  });

  return {
    isRoot,
    status,
    isLoading,
    isExecuting,
    consoleOutput,
    activeCommand,
    emergencyActive,
    isEmergencyLoading,
    isEmergencySaving,
    updateEmergencyMode,
    runCommand,
    clearConsole,
  };
}
