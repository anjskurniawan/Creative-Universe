import { CreativeReportMetricCard } from "@/app/creative-report/performa/_components/ReportToolbar/CreativeReportMetricCard/CreativeReportMetricCard";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function CreativeReportMetricCardPreview() {
  return (
    <PreviewWrapper width="lg">
      <div className="w-full max-w-[320px]">
        <CreativeReportMetricCard metric={{ label: "Total Staff", value: "24", icon: "groups", tone: "bg-[#ede9fe]", accent: "bg-[#6d46eb]" }} />
      </div>
    </PreviewWrapper>
  );
}
