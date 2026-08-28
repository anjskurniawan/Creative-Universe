"use client";

import { ReportHeader } from "@/app/creative-report/performa/_components/ReportHeader/ReportHeader";
import { ReportToolbar } from "@/app/creative-report/performa/_components/ReportToolbar/ReportToolbar";
import { GroupAccordion } from "@/app/creative-report/performa/_components/GroupAccordion/GroupAccordion";
import { AssessmentTable } from "@/app/creative-report/performa/_components/AssessmentTable/AssessmentTable";
import { AssessmentMobileCards } from "@/app/creative-report/performa/_components/AssessmentMobileCards/AssessmentMobileCards";
import { HrdRulesFooter } from "@/app/creative-report/performa/_components/HrdRulesFooter/HrdRulesFooter";
import { Toast } from "@/components/feedback/Toast/Toast";
import { ReportSummaryInfo } from "@/app/creative-report/performa/_components/ReportSummaryInfo/ReportSummaryInfo";
import { useCreativeReportPerformance, JOBDESKS } from "@/app/creative-report/performa/use-creative-report-performance";

export default function CreativeReportPage() {
  const {
    canEdit,
    month,
    setMonth,
    jobdesk,
    setJobdesk,
    search,
    setSearch,
    openGroups,
    report,
    error,
    setError,
    showNotice,
    setShowNotice,
    assessments,
    metrics,
    monthLabel,
    toggle,
    reorderGroupMembers,
    load,
  } = useCreativeReportPerformance();

  return (
    <main className="cu-style w-full min-w-0 flex-1">
      <div className="flex min-h-full w-full flex-col">
        <ReportHeader month={month} monthLabel={monthLabel} onMonthChange={setMonth} />

        <ReportToolbar
          search={search}
          onSearchChange={setSearch}
          jobdesk={jobdesk}
          onJobdeskChange={setJobdesk}
          jobdesks={JOBDESKS}
          metrics={metrics}
          showMetrics={false}
        />

        {error && <Toast message={error} status="error" onClose={() => setError(null)} />}

        {showNotice && report?.notice && (
          <Toast message={report.notice} status="success" onClose={() => setShowNotice(false)} />
        )}

        <ReportSummaryInfo monthLabel={monthLabel} count={assessments.length} />

        <section className="py-4 space-y-3">
          {report?.groups.map((group, index) => (
            <GroupAccordion
              key={group.id}
              group={group}
              index={index}
              isOpen={openGroups.includes(group.id)}
              onToggle={toggle}
            >
              <AssessmentTable
                group={group}
                onChanged={() => load()}
                canEdit={canEdit}
                month={month}
                onReorder={reorderGroupMembers}
              />
              <AssessmentMobileCards group={group} onChanged={() => load()} canEdit={canEdit} onReorder={reorderGroupMembers} />
            </GroupAccordion>
          ))}
        </section>

        <HrdRulesFooter />
      </div>
    </main>
  );
}
