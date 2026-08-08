import { ReportSummaryInfo } from "@/components/creative-report/report-summary-info";
import { PreviewWrapper } from "../preview-wrapper";
export function ReportSummaryInfoPreview() { return <PreviewWrapper width="lg"><div className="p-4 bg-white rounded-xl border border-slate-100"><ReportSummaryInfo monthLabel="Agustus 2026" count={12} /></div></PreviewWrapper>; }
