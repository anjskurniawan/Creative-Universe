import type { ChatItem } from "../Chat.types";

export interface ChatRowProps {
  item: ChatItem;
  isExpanded: boolean;
  isActive: boolean;
}
