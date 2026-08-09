import Copy from "@react-spectrum/s2/icons/Copy";
import Cut from "@react-spectrum/s2/icons/Cut";
import Paste from "@react-spectrum/s2/icons/Paste";
import { ActionMenu, Keyboard, MenuItem, Text } from "@/components/spectrum/ActionMenu";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumActionMenuPreview() {
  return (
    <PreviewWrapper width="md">
      <ActionMenu aria-label="More actions">
        <MenuItem textValue="Copy"><Copy /><Text slot="label">Copy</Text><Text slot="description">Copy the selected text</Text><Keyboard>⌘C</Keyboard></MenuItem>
        <MenuItem textValue="Cut"><Cut /><Text slot="label">Cut</Text><Text slot="description">Cut the selected text</Text><Keyboard>⌘X</Keyboard></MenuItem>
        <MenuItem textValue="Paste"><Paste /><Text slot="label">Paste</Text><Text slot="description">Paste the copied text</Text><Keyboard>⌘V</Keyboard></MenuItem>
      </ActionMenu>
    </PreviewWrapper>
  );
}

