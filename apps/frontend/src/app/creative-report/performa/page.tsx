"use client";

import { ReportHeader } from "@/components/creative-report/report-header";
import { ReportToolbar } from "@/components/creative-report/report-toolbar";
import { GroupAccordion } from "@/components/creative-report/group-accordion";
import { AssessmentTable } from "@/components/creative-report/assessment-table";
import { AssessmentMobileCards } from "@/components/creative-report/assessment-mobile-cards";
import { HrdRulesFooter } from "@/components/creative-report/hrd-rules-footer";
import { Toast } from "@/components/ui/toast";
import { ReportSummaryInfo } from "@/components/creative-report/report-summary-info";
import { useCreativeReportPerformance, JOBDESKS } from "./use-creative-report-performance";

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
    load,
  } = useCreativeReportPerformance();

  return (
    <main className="w-full min-w-0 flex-1">
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
              />
              <AssessmentMobileCards group={group} onChanged={() => load()} canEdit={canEdit} />
            </GroupAccordion>
          ))}
        </section>

        <HrdRulesFooter />
      </div>
    </main>
  );
}
