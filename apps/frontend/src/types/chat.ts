export interface ChatUser {
  id: number;
  name: string;
  email?: string;
  username?: string;
  avatar?: string | null;
  avatar_path?: string | null;
  roles?: string[];
}

export interface ChatTaskSummary {
  id: number;
  task_number: string;
  design_purpose: string;
  status: string;
  deadline?: string | null;
  requester_id: number;
  assigned_designer_id: number | null;
}

export interface ChatLastMessage {
  body: string;
  created_at: string;
  is_read?: boolean;
  sender_id: number;
}

export interface ChatMessage {
  id: number | string;
  conversation_id?: number;
  sender_id: number | string | undefined;
  body: string;
  read_at?: string | null;
  read_state?: "sent" | "read" | "failed" | "sending";
  reply_to_id?: number | null;
  reply_to?: {
    id: number;
    body: string;
    sender?: ChatUser;
  } | null;
  attachments?: ChatAttachment[];
  mentioned_user_ids?: number[];
  created_at: string;
  sender?: ChatUser;
}

export interface ChatAttachment {
  id: number;
  name: string;
  path: string;
  mime_type?: string | null;
  size?: number | null;
}

export interface ChatConversation {
  id: number | string;
  context_type: "direct" | "odds_task" | string;
  context_id?: number | null;
  status: "open" | "closed" | string;
  closed_at?: string | null;
  closed_reason?: string | null;
  can_send?: boolean;
  partner?: ChatUser | null;
  participants?: ChatUser[];
  task?: ChatTaskSummary | null;
  last_message?: ChatLastMessage | null;
  updated_at?: string;
}

export interface ChatContact {
  id: number;
  name: string;
  avatar_path?: string | null;
  roles?: string[];
}

export type SendChatMessageInput =
  | { conversation_id: number; body: string; reply_to_id?: number; attachment_ids?: number[] }
  | { receiver_id: number; body: string; reply_to_id?: number; attachment_ids?: number[] };
