"use client";

import React from "react";

import { ContentTitle } from "@/components/ui/content-title";
import { AccessDenied } from "@/components/ui/access-denied";

import { EmergencyMaintenanceCard } from "@/components/panel/maintenance/emergency-maintenance-card";
import { SystemStatusGrid } from "@/components/panel/maintenance/system-status-grid";
import { MaintenanceActionsGrid } from "@/components/panel/maintenance/maintenance-actions-grid";
import { ConsoleOutputPanel } from "@/components/panel/maintenance/console-output-panel";

import { useMaintenance } from "./use-maintenance";

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
    <div className="space-y-6">
      <ContentTitle
        title="Operasi & Pemeliharaan"
        subtitle="Kelola status internal Laravel, cache, antrean queue, dan fondasi database hosting secara aman tanpa terminal SSH."
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
