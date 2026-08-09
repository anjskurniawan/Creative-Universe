import Cut from "@react-spectrum/s2/icons/Cut";
import Copy from "@react-spectrum/s2/icons/Copy";
import Paste from "@react-spectrum/s2/icons/Paste";
import { ActionButtonGroup, ActionButton, Text } from "@/components/spectrum/ActionButtonGroup";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumActionButtonGroupPreview() {
  return (
    <PreviewWrapper width="md">
      <ActionButtonGroup>
        <ActionButton aria-label="Cut"><Cut /><Text>Cut</Text></ActionButton>
        <ActionButton aria-label="Copy"><Copy /><Text>Copy</Text></ActionButton>
        <ActionButton aria-label="Paste"><Paste /><Text>Paste</Text></ActionButton>
      </ActionButtonGroup>
    </PreviewWrapper>
  );
}
