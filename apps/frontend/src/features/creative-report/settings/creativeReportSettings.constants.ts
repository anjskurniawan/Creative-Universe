import type { CreativeReportAspect, CreativeReportAspectGroupTitles, CreativeReportSettings } from "./creativeReportSettings.types";

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

export const GLOBAL_SETTING_KEYS = [
  "creative_report_collab_aspects",
  "creative_report_perf_aspects",
  "creative_report_aspect_group_titles",
  "creative_report_detail_card_aspects",
];

export const DEFAULT_SETTINGS: CreativeReportSettings = {
  collabAspects: DEFAULT_COLLAB_ASPECTS,
  perfAspects: DEFAULT_PERF_ASPECTS,
  groupTitles: DEFAULT_ASPECT_GROUP_TITLES,
  detailCardAspectIndexes: DEFAULT_DETAIL_CARD_ASPECT_INDEXES,
};
