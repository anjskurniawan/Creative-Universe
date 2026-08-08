import { CreativeReportMetricCard } from "@/components/creative-report/report-metric-card";
import { PreviewWrapper } from "../preview-wrapper";

export function CreativeReportMetricCardPreview() {
  return (
    <PreviewWrapper width="lg">
      <div className="w-full max-w-[320px]">
        <CreativeReportMetricCard metric={{ label: "Total Staff", value: "24", icon: "groups", tone: "bg-[#ede9fe]", accent: "bg-[#6d46eb]" }} />
      </div>
    </PreviewWrapper>
  );
}
