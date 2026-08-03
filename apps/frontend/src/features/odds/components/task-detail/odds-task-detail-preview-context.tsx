"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { OddsTask } from "@/features/odds/api";
import type { DummyPov, DummyScenario } from "./dummy-scenario-control";

type OddsTaskDetailPreview = { task: OddsTask; scenario: DummyScenario; pov: DummyPov };
const OddsTaskDetailPreviewContext = createContext<OddsTaskDetailPreview | null>(null);

export function OddsTaskDetailPreviewProvider({ value, children }: { value: OddsTaskDetailPreview; children: ReactNode }) {
  return <OddsTaskDetailPreviewContext.Provider value={value}>{children}</OddsTaskDetailPreviewContext.Provider>;
}

export function useOddsTaskDetailPreview() {
  return useContext(OddsTaskDetailPreviewContext);
}
