import { DefaultStatsGrid } from "@/components/dashboard/default-stats-grid";
import { PreviewWrapper } from "../preview-wrapper";
export function DefaultStatsGridPreview() { return <PreviewWrapper width="full"><DefaultStatsGrid stats={{ active_users: 128, roles: ["designer"], pending_users: 4, is_root: false, root_metrics: null }} /></PreviewWrapper>; }
