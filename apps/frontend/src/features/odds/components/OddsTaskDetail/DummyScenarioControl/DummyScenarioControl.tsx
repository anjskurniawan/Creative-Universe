"use client";

import { useState } from "react";
import type { QaBoundaryLevels, QaBoundaryTone } from "@/features/odds/components/OddsTaskDetail/QaComponentBoundary/QaComponentBoundary";

export type DummyScenario = "brief_submitted" | "brief_revision" | "queued" | "in_progress" | "leader_review" | "leader_revision" | "client_review" | "client_revision" | "completed";
export type DummyPov = "client" | "designer" | "leader";
export type DummyBriefType = "default" | "table";

const options: Array<{ value: DummyScenario; label: string }> = [
  { value: "brief_submitted", label: "Brief Masuk" }, { value: "brief_revision", label: "Revisi Brief" }, { value: "queued", label: "Antrean" }, { value: "in_progress", label: "Dikerjakan" }, { value: "leader_review", label: "Review Leader" }, { value: "leader_revision", label: "Revisi Leader" }, { value: "client_review", label: "Review Client" }, { value: "client_revision", label: "Revisi Client" }, { value: "completed", label: "Selesai" },
];
const povOptions: Array<{ value: DummyPov; label: string }> = [{ value: "client", label: "Client" }, { value: "designer", label: "Desainer" }, { value: "leader", label: "Leader (SPV/Manajer)" }];
const boundaryOptions: Array<[QaBoundaryTone, string]> = [["primary", "Merah"], ["nested", "Biru"], ["deep", "Hijau"]];

type DummyScenarioControlProps = { value: DummyScenario; onChange: (value: DummyScenario) => void; pov: DummyPov; onPovChange: (value: DummyPov) => void; briefType: DummyBriefType; onBriefTypeChange: (value: DummyBriefType) => void; qaLevels: QaBoundaryLevels; onQaLevelToggle: (tone: QaBoundaryTone) => void };

export function DummyScenarioControl({ value, onChange, pov, onPovChange, briefType, onBriefTypeChange, qaLevels, onQaLevelToggle }: DummyScenarioControlProps) {
  const [open, setOpen] = useState(false);
  return <div className="fixed bottom-5 right-5 z-50 text-xs"><button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="ml-auto flex h-10 items-center gap-2 rounded-xl border border-red-300 bg-red-600 px-3 font-bold text-white shadow-lg transition hover:bg-red-700">QA <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span></button>{open && <div className="mt-2 max-w-[calc(100vw-2.5rem)] rounded-xl border border-red-300 bg-red-50/95 p-3 shadow-lg backdrop-blur"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="font-bold text-red-700">Tahap</span>{options.map((option) => <button key={option.value} type="button" onClick={() => onChange(option.value)} className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${value === option.value ? "bg-red-600 text-white" : "bg-white text-red-700 hover:bg-red-100"}`}>{option.label}</button>)}</div><div className="flex flex-wrap items-center gap-2 border-t border-red-200 pt-2"><span className="font-bold text-red-700">POV</span>{povOptions.map((option) => <button key={option.value} type="button" onClick={() => onPovChange(option.value)} className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${pov === option.value ? "bg-red-600 text-white" : "bg-white text-red-700 hover:bg-red-100"}`}>{option.label}</button>)}</div><div className="mt-2 flex items-center gap-2 border-t border-red-200 pt-2"><span className="font-bold text-red-700">Brief</span>{(["default", "table"] as const).map((type) => <button key={type} type="button" onClick={() => onBriefTypeChange(type)} className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${briefType === type ? "bg-red-600 text-white" : "bg-white text-red-700 hover:bg-red-100"}`}>{type === "default" ? "Default" : "Table"}</button>)}</div><div className="mt-2 flex flex-wrap items-center gap-2 border-t border-red-200 pt-2"><span className="font-bold text-red-700">Boundary</span>{boundaryOptions.map(([tone, label]) => <button key={tone} type="button" onClick={() => onQaLevelToggle(tone)} className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${qaLevels[tone] ? "bg-red-600 text-white" : "bg-white text-red-700 hover:bg-red-100"}`}>{label}: {qaLevels[tone] ? "On" : "Off"}</button>)}</div></div>}</div>;
}
