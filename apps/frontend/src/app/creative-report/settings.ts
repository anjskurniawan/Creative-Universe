export interface CreativeReportAspect {
  name: string;
  maxPoints: number;
}

export interface CreativeReportAspectGroupTitles {
  collab: string;
  perf: string;
}

export const DEFAULT_ASPECT_GROUP_TITLES: CreativeReportAspectGroupTitles = {
  collab: "Aspek Penilaian 30% (Kolaborasi)",
  perf: "Aspek Penilaian 50% (Performa)",
};

export const DEFAULT_DETAIL_CARD_ASPECT_INDEXES = [0, 1, 2, 3, 4];

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

export function getAspectGroupTitles(): CreativeReportAspectGroupTitles {
  if (typeof window === "undefined") return DEFAULT_ASPECT_GROUP_TITLES;
  const stored = localStorage.getItem("creative_report_aspect_group_titles");
  if (!stored) return DEFAULT_ASPECT_GROUP_TITLES;
  try {
    const parsed = JSON.parse(stored) as Partial<CreativeReportAspectGroupTitles>;
    return {
      collab: parsed.collab?.trim() || DEFAULT_ASPECT_GROUP_TITLES.collab,
      perf: parsed.perf?.trim() || DEFAULT_ASPECT_GROUP_TITLES.perf,
    };
  } catch {
    return DEFAULT_ASPECT_GROUP_TITLES;
  }
}

export function saveAspectGroupTitles(titles: CreativeReportAspectGroupTitles) {
  if (typeof window !== "undefined") {
    localStorage.setItem("creative_report_aspect_group_titles", JSON.stringify(titles));
  }
}

export function getDetailCardAspectIndexes(): number[] {
  if (typeof window === "undefined") return DEFAULT_DETAIL_CARD_ASPECT_INDEXES;
  const stored = localStorage.getItem("creative_report_detail_card_aspects");
  if (!stored) return DEFAULT_DETAIL_CARD_ASPECT_INDEXES;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length === 5 && parsed.every((item) => Number.isInteger(item) && item >= 0)
      ? parsed
      : DEFAULT_DETAIL_CARD_ASPECT_INDEXES;
  } catch {
    return DEFAULT_DETAIL_CARD_ASPECT_INDEXES;
  }
}

export function saveDetailCardAspectIndexes(indexes: number[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("creative_report_detail_card_aspects", JSON.stringify(indexes));
  }
}
