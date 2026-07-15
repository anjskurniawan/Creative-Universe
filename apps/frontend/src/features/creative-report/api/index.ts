import { apiFetch, type ApiRequestOptions } from "@/core/api/client";
import type {
  CreativeReportAssessment,
  CreativeReportFilters,
  CreativeReportIndex,
  CreativeReportUpdateInput,
  CreativeReportUserDetail,
} from "@/features/creative-report/types";

const PREFIX = "/creative-reports";

export const creativeReportApi = {
  assessments: {
    list: (filters: CreativeReportFilters, options?: ApiRequestOptions) => {
      const query = new URLSearchParams({ month: filters.month });
      if (filters.jobdesk) query.set("jobdesk", filters.jobdesk);
      if (filters.search) query.set("search", filters.search);
      return apiFetch<CreativeReportIndex>(`${PREFIX}?${query}`, options);
    },
    detail: (assessmentId: number | string, options?: ApiRequestOptions) =>
      apiFetch<CreativeReportAssessment>(`${PREFIX}/${assessmentId}`, options),
    update: (assessmentId: number | string, body: CreativeReportUpdateInput) =>
      apiFetch<CreativeReportAssessment>(`${PREFIX}/${assessmentId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    complete: (assessmentId: number | string) =>
      apiFetch<CreativeReportAssessment>(`${PREFIX}/${assessmentId}/complete`, { method: "POST" }),
  },
  userDetail: (userId: number | string, month?: string, options?: ApiRequestOptions) => {
    const query = month ? `?${new URLSearchParams({ month })}` : "";
    return apiFetch<CreativeReportUserDetail>(`${PREFIX}/users/${userId}${query}`, options);
  },
} as const;
