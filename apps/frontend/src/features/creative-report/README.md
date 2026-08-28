# Creative Report Feature

- Page route: `/creative-report`.
- API prefix: `/api/v1/creative-reports`.
- Status: active.
- Ownership: assessment list, user detail, assessment update/completion, member workflows, dan pengaturan aspek Creative Report.

Query URL menjadi sumber identitas halaman detail; session storage bukan kontrak domain.

Public API module: `api/index.ts` (`creativeReportApi`). Pengaturan aspek, judul grup, dan pilihan detail card dimiliki `settings/`; nilai dibaca dan ditulis melalui `coreApi.settings` dengan fallback default yang sama.
