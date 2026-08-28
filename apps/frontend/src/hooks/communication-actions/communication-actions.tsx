"use client";

import { createContext, useContext, type ReactNode } from "react";
import type {
  ChatAttachment,
  ChatContact,
  ChatConversation,
  ChatMessage,
  SendChatMessageInput,
} from "@/types/chat";
import type { ApiPage, ApiRequestOptions } from "@/core/api/client";

export interface CommunicationBellTriggerState {
  isOpen: boolean;
  unreadCount: number;
  toggle: () => void;
}

export interface CommunicationBellProps {
  userId: number;
  variant?: "light" | "dark";
  renderTrigger?: (props: CommunicationBellTriggerState) => ReactNode;
  panelClassName?: string;
}

type CommunicationBellRenderer = (props: CommunicationBellProps) => ReactNode;

export interface CommunicationNavDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

type CommunicationNavDropdownRenderer = (props: CommunicationNavDropdownProps) => ReactNode;

interface CommunicationActionsContextValue {
  renderMessageBell: CommunicationBellRenderer;
  renderNotificationBell: CommunicationBellRenderer;
  refreshNavDropdowns: () => Promise<void>;
  renderNavMessageDropdown: CommunicationNavDropdownRenderer;
  renderNavNotificationDropdown: CommunicationNavDropdownRenderer;
  chatApi: {
    contacts: (options?: ApiRequestOptions) => Promise<ChatContact[]>;
    conversations: (options?: ApiRequestOptions) => Promise<ChatConversation[]>;
    messages: (conversationId: number | string, page?: number, options?: ApiRequestOptions) => Promise<ApiPage<ChatMessage>>;
    uploadAttachment: (file: File) => Promise<ChatAttachment>;
    send: (input: SendChatMessageInput) => Promise<ChatMessage>;
  };
  subscribeToConversationMessages: (
    conversationIds: Array<number | string>,
    onMessage: (conversationId: number, message: ChatMessage) => void,
  ) => () => void;
}

const CommunicationActionsContext = createContext<CommunicationActionsContextValue | null>(null);

export function CommunicationActionsProvider({
  children,
  renderMessageBell,
  renderNotificationBell,
  refreshNavDropdowns,
  renderNavMessageDropdown,
  renderNavNotificationDropdown,
  chatApi,
  subscribeToConversationMessages,
}: CommunicationActionsContextValue & { children: ReactNode }) {
  return (
    <CommunicationActionsContext.Provider value={{
      renderMessageBell,
      renderNotificationBell,
      refreshNavDropdowns,
      renderNavMessageDropdown,
      renderNavNotificationDropdown,
      chatApi,
      subscribeToConversationMessages,
    }}>
      {children}
    </CommunicationActionsContext.Provider>
  );
}

export function useCommunicationActions(): CommunicationActionsContextValue {
  const context = useContext(CommunicationActionsContext);

  if (!context) {
    throw new Error("useCommunicationActions must be used within CommunicationActionsProvider.");
  }

  return context;
}
