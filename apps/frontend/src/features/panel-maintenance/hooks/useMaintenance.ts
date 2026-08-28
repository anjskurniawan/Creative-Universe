"use client";

import { useAuth } from "@/hooks/auth";
import { useStatus } from "./useStatus";
import { useEmergency } from "./useEmergency";
import { useConsole } from "./useConsole";

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
