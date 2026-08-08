import { QuickActionsSection } from "@/components/dashboard/quick-actions-section";
import { PreviewWrapper } from "../preview-wrapper";
export function QuickActionsSectionPreview() { return <PreviewWrapper width="full"><QuickActionsSection hasPermission={() => true} /></PreviewWrapper>; }
