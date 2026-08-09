import { Badge } from "@/components/spectrum/Badge";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumBadgePreview() {
  return (
    <PreviewWrapper width="md">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="positive">Approved</Badge>
        <Badge variant="notice" fillStyle="outline">In review</Badge>
        <Badge variant="informative" fillStyle="subtle">Draft</Badge>
      </div>
    </PreviewWrapper>
  );
}

