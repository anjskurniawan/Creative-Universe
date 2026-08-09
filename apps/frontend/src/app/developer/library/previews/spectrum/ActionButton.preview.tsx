import Cut from "@react-spectrum/s2/icons/Cut";
import { ActionButton } from "@/components/spectrum/ActionButton";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumActionButtonPreview() {
  return (
    <PreviewWrapper width="md">
      <ActionButton aria-label="Cut"><Cut />Cut</ActionButton>
    </PreviewWrapper>
  );
}
