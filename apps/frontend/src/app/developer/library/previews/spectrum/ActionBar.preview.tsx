import { ActionBar, ActionButton } from "@/components/spectrum/ActionBar";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumActionBarPreview() {
  return <PreviewWrapper width="md"><ActionBar selectedItemCount={3}><ActionButton aria-label="Edit">Edit</ActionButton><ActionButton aria-label="Copy">Copy</ActionButton><ActionButton aria-label="Delete">Delete</ActionButton></ActionBar></PreviewWrapper>;
}
