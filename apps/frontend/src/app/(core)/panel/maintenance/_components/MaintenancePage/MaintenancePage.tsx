"use client";

import React from "react";

import { ContentTitle } from "@/components/ui/ContentTitle/ContentTitle";
import { AccessDenied } from "@/components/ui/AccessDenied/AccessDenied";

import { EmergencyMaintenanceCard } from "@/features/panel-maintenance/components/EmergencyMaintenanceCard/EmergencyMaintenanceCard";
import { SystemStatusGrid } from "@/features/panel-maintenance/components/SystemStatusGrid/SystemStatusGrid";
import { MaintenanceActionsGrid } from "@/features/panel-maintenance/components/MaintenanceActionsGrid/MaintenanceActionsGrid";
import { ConsoleOutputPanel } from "@/features/panel-maintenance/components/ConsoleOutputPanel/ConsoleOutputPanel";
import { useMaintenance } from "@/features/panel-maintenance/hooks/useMaintenance";

export default function MaintenancePage() {
  const {
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
  } = useMaintenance();

  if (!isRoot) {
    return <AccessDenied message="Hanya Root yang dapat membuka halaman pemeliharaan sistem." />;
  }

  return (
    <div className="w-full space-y-6">
      <ContentTitle
        title="Operasi & Pemeliharaan"
              />

      <EmergencyMaintenanceCard
        emergencyActive={emergencyActive}
        isEmergencyLoading={isEmergencyLoading}
        isEmergencySaving={isEmergencySaving}
        onToggle={updateEmergencyMode}
      />

      <SystemStatusGrid status={status} isLoading={isLoading} />

      <MaintenanceActionsGrid
        runCommand={runCommand}
        isExecuting={isExecuting}
        activeCommand={activeCommand}
      />

      <ConsoleOutputPanel
        consoleOutput={consoleOutput}
        onClear={clearConsole}
      />
    </div>
  );
}
