import { ReportSummaryInfo } from "@/app/creative-report/performa/_components/ReportSummaryInfo/ReportSummaryInfo";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";
export function ReportSummaryInfoPreview() { return <PreviewWrapper width="lg"><div className="p-4 bg-white rounded-xl border border-slate-100"><ReportSummaryInfo monthLabel="Agustus 2026" count={12} /></div></PreviewWrapper>; }
