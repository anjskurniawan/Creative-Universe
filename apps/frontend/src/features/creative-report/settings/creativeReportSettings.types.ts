export interface CreativeReportAspect {
  name: string;
  maxPoints: number;
}

export interface CreativeReportAspectGroupTitles {
  collab: string;
  perf: string;
}

export interface CreativeReportSettings {
  collabAspects: CreativeReportAspect[];
  perfAspects: CreativeReportAspect[];
  groupTitles: CreativeReportAspectGroupTitles;
  detailCardAspectIndexes: number[];
}
