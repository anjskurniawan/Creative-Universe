import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import type { ModelItem } from "./Model";
import type { AttachmentItem } from "./Attachment";

export interface ChatBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectAttachment?: (itemId: string) => void;
  attachmentItems?: AttachmentItem[];
  onSelectModel?: (modelId: string) => void;
  models?: ModelItem[];
  selectedModel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface ChatBoxLogicProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectAttachment?: (itemId: string) => void;
  onSelectModel?: (modelId: string) => void;
  disabled?: boolean;
}
