"use client";

import { AgentSenderBubble } from "./agent-sender-bubble";
import { AgentReceiverBubble } from "./agent-receiver-bubble";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export type AgentChatBubblesProps = {
  messages: Message[];
  isTyping?: boolean;
  userName?: string;
};

export function AgentChatBubbles({
  messages,
  isTyping = false,
  userName = "Sobat CU",
}: AgentChatBubblesProps) {
  return (
    <div className="flex flex-col gap-4 w-full pr-1">
      {messages.map((msg, idx) => {
        if (msg.role === "user") {
          return (
            <AgentSenderBubble
              key={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              userName={userName}
            />
          );
        } else {
          return (
            <AgentReceiverBubble
              key={msg.id}
              content={msg.content}
              imageUrl={msg.imageUrl}
              timestamp={msg.timestamp}
              animate={idx === messages.length - 1}
            />
          );
        }
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center pl-1 py-1 mr-auto select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
        </div>
      )}
    </div>
  );
}
