export interface CreativeReportAspect {
  name: string;
  maxPoints: number;
}

export const DEFAULT_COLLAB_ASPECTS: CreativeReportAspect[] = [
  { name: "Komunikasi Aktif", maxPoints: 6 },
  { name: "Dapat Diandalkan", maxPoints: 6 },
  { name: "Inisiatif Tim", maxPoints: 6 },
  { name: "Pemahaman Brief", maxPoints: 6 },
  { name: "Skill & Powerful", maxPoints: 6 },
];

export const DEFAULT_PERF_ASPECTS: CreativeReportAspect[] = [
  { name: "Timeline On Time", maxPoints: 10 },
  { name: "Hasil Rapi", maxPoints: 10 },
  { name: "Responsif Revisi", maxPoints: 10 },
  { name: "Cepat Tanggap", maxPoints: 10 },
  { name: "Todo & Report", maxPoints: 10 },
];

export function getCollabAspects(): CreativeReportAspect[] {
  if (typeof window === "undefined") return DEFAULT_COLLAB_ASPECTS;
  const stored = localStorage.getItem("creative_report_collab_aspects");
  if (!stored) return DEFAULT_COLLAB_ASPECTS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_COLLAB_ASPECTS;
  }
}

export function getPerfAspects(): CreativeReportAspect[] {
  if (typeof window === "undefined") return DEFAULT_PERF_ASPECTS;
  const stored = localStorage.getItem("creative_report_perf_aspects");
  if (!stored) return DEFAULT_PERF_ASPECTS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PERF_ASPECTS;
  }
}

export function saveCollabAspects(aspects: CreativeReportAspect[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("creative_report_collab_aspects", JSON.stringify(aspects));
  }
}

export function savePerfAspects(aspects: CreativeReportAspect[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("creative_report_perf_aspects", JSON.stringify(aspects));
  }
}
