import { QuickActionsSection } from "@/app/(core)/panel/dashboard/_components/QuickActionsSection/QuickActionsSection";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";
export function QuickActionsSectionPreview() { return <PreviewWrapper width="full"><QuickActionsSection hasPermission={() => true} /></PreviewWrapper>; }
