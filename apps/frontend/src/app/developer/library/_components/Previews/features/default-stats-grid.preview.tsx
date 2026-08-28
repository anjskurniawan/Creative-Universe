import { DefaultStatsGrid } from "@/app/(core)/panel/dashboard/_components/DefaultStatsGrid/DefaultStatsGrid";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";
export function DefaultStatsGridPreview() { return <PreviewWrapper width="full"><DefaultStatsGrid stats={{ active_users: 128, roles: ["designer"], pending_users: 4, is_root: false, root_metrics: null }} /></PreviewWrapper>; }
