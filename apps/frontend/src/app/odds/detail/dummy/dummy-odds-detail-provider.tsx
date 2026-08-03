"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { OddsTask } from "@/features/odds/api";
import { DummyScenarioControl, type DummyBriefType, type DummyPov, type DummyScenario } from "@/features/odds/components/task-detail/dummy-scenario-control";
import { QaModeProvider } from "@/features/odds/components/task-detail/qa-component-boundary";
import { OddsTaskDetailPreviewProvider } from "@/features/odds/components/task-detail/odds-task-detail-preview-context";

const dummyOddsTask: OddsTask = {
  id: 0, task_number: "ODDS-QA-DUMMY-0001", request_type: "design", design_purpose: "Banner Marketplace Agustus", brief_text: "<p>Buat banner marketplace untuk campaign Agustus dengan fokus pada produk unggulan dan promo utama.</p><p>Gunakan warna brand dan hierarki informasi yang jelas.</p>", reference_visual: "campaign-reference.png", category_snapshot: { sla_minutes: 360, name: "Banner Marketplace" }, deadline: "2026-08-02T16:30:00+07:00", important_matrix: "Q4", status: "spv_review", task_type: "new_task", priority_score: 85, brief_return_count: 1, leader_revision_count: 0, normal_revision_count: 0, created_at: "2026-08-02T10:30:00+07:00", updated_at: "2026-08-02T12:00:00+07:00",
  category: { id: 1, name: "Banner Marketplace", score_weight: 1, normal_revision_limit: 2, sla_minutes: 360, is_active: true }, requester: { id: 101, name: "Client QA", username: "client-qa", roles: ["Client"] }, assigned_designer: { id: 102, name: "Designer Test", username: "designer", roles: ["Designer"] }, current_queue: { id: 1, task_id: 0, designer_id: 102, queue_status: "completed", task_type: "new_task", priority_score: 85, estimated_start_at: "2026-08-02T10:00:00+07:00", estimated_finish_at: "2026-08-02T16:30:00+07:00" }, brief: { id: 1, content: "<p>Buat banner marketplace untuk campaign Agustus dengan fokus pada produk unggulan dan promo utama.</p><p>Gunakan warna brand dan hierarki informasi yang jelas.</p>", reference_visual: "campaign-reference.png", last_return_note: null, ai_summary: null }, results: [], reviews: [], revisions: [], activities: [], history: [], time_logs: [],
};

function getDummyOddsTask(scenario: DummyScenario, briefType: DummyBriefType): OddsTask {
  const result = [{ id: 1, version_number: 1, submitted_by: 102, result_notes: "Total Output: 3\nBanner final untuk review.", status: scenario === "completed" ? "approved" : "pending_spv", submitted_at: "2026-08-02T12:00:00+07:00", asset_links: [] }];
  const base = briefType === "table" ? { ...dummyOddsTask, brief_text: "<table><tbody><tr><th>Kategori</th><td>Banner Marketplace</td></tr></tbody></table><table><tbody><tr><td>1</td><td>Produk unggulan</td><td>Referensi visual</td><td>Promo Agustus</td></tr></tbody></table>", brief: { ...dummyOddsTask.brief!, content: "<table><tbody><tr><th>Kategori</th><td>Banner Marketplace</td></tr></tbody></table><table><tbody><tr><td>1</td><td>Produk unggulan</td><td>Referensi visual</td><td>Promo Agustus</td></tr></tbody></table>" } } : dummyOddsTask;
  if (scenario === "brief_submitted") return { ...base, status: "submitted" };
  if (scenario === "brief_revision") return { ...base, status: "brief_revision_requested", brief_return_count: 1 };
  if (scenario === "queued") return { ...base, status: "queued" };
  if (scenario === "in_progress") return { ...base, status: "in_progress" };
  if (scenario === "leader_revision") return { ...base, status: "in_progress", task_type: "leader_revision", revisions: [{ id: 1, task_id: 0, revision_type: "leader", status: "open", notes: "Sesuaikan hierarki promo.", is_urgent_final: false, created_at: "2026-08-02T12:24:00+07:00" }, { id: 2, task_id: 0, revision_type: "leader", status: "approved", notes: "Perjelas headline promo.", is_urgent_final: false, created_at: "2026-08-02T11:10:00+07:00" }, { id: 3, task_id: 0, revision_type: "leader", status: "approved", notes: "Sesuaikan ukuran produk.", is_urgent_final: false, created_at: "2026-08-02T10:42:00+07:00" }] };
  if (scenario === "client_revision") return { ...base, status: "in_progress", task_type: "client_revision", revisions: [{ id: 1, task_id: 0, revision_type: "normal", status: "open", notes: "Sesuaikan hierarki promo.", is_urgent_final: false, created_at: "2026-08-02T12:24:00+07:00" }] };
  if (scenario === "client_review") return { ...base, status: "client_review", results: result };
  if (scenario === "completed") return { ...base, status: "done", results: result };
  if (scenario === "leader_review") return { ...base, status: "spv_review", results: result, revisions: [] };
  return { ...base, status: "spv_review", results: result };
}

export function DummyOddsDetailProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<DummyScenario>("leader_review");
  const [pov, setPov] = useState<DummyPov>("leader");
  const [briefType, setBriefType] = useState<DummyBriefType>("default");

  useEffect(() => {
    const storedScenario = window.localStorage.getItem("odds-dummy-qa-scenario") as DummyScenario | null;
    const storedPov = window.localStorage.getItem("odds-dummy-qa-pov") as DummyPov | null;
    const storedBriefType = window.localStorage.getItem("odds-dummy-qa-brief-type") as DummyBriefType | null;
    if (storedScenario) setScenario(storedScenario);
    if (storedPov) setPov(storedPov);
    if (storedBriefType) setBriefType(storedBriefType);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("odds-dummy-qa-scenario", scenario);
    window.localStorage.setItem("odds-dummy-qa-pov", pov);
    window.localStorage.setItem("odds-dummy-qa-brief-type", briefType);
  }, [briefType, pov, scenario]);

  const value = useMemo(() => ({ task: getDummyOddsTask(scenario, briefType), scenario, pov }), [briefType, pov, scenario]);
  return <OddsTaskDetailPreviewProvider value={value}><QaModeProvider>{children}</QaModeProvider><DummyScenarioControl value={scenario} onChange={setScenario} pov={pov} onPovChange={setPov} briefType={briefType} onBriefTypeChange={setBriefType} /></OddsTaskDetailPreviewProvider>;
}
