"use client";

import React, { useRef, useEffect } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export interface CreativeAiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type CreativeAiChatMessagesProps = {
  messages: CreativeAiMessage[];
  isTyping?: boolean;
  onResetChat?: () => void;
  className?: string;
};

export function CreativeAiChatMessages({
  messages,
  isTyping = false,
  onResetChat,
  className = "",
}: CreativeAiChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (messages.length === 0) return null;

  return (
    <section className={`flex-1 flex flex-col min-h-0 w-full overflow-hidden mb-4 ${className}`}>
      {/* Header controls */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <MaterialIcon name="smart_toy" size="auto" className="text-base text-[#00a4ff]" />
          Creative AI Chat Session
        </span>
        {onResetChat && (
          <button
            type="button"
            onClick={onResetChat}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            <MaterialIcon name="delete_outline" size="auto" className="text-sm" /> Reset Chat
          </button>
        )}
      </div>

      {/* Messages Scrollbox */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex items-center justify-center size-8 rounded-full flex-shrink-0 text-white font-bold text-xs ${
                  isUser
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md"
                    : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md"
                }`}
              >
                {isUser ? "U" : <MaterialIcon name="auto_awesome" size="auto" className="text-sm text-white" />}
              </div>

              {/* Bubble Content */}
              <div className="flex flex-col gap-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-[#6d46eb] text-white rounded-tr-none shadow-md"
                      : "bg-[#18181b] border border-white/10 text-slate-200 rounded-tl-none shadow-lg"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className={`text-[10px] text-slate-400 px-1 ${isUser ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs">
              <MaterialIcon name="auto_awesome" size="auto" className="text-sm text-white animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#18181b] border border-white/10 text-slate-400 text-xs flex items-center gap-1.5">
              <span className="size-1.5 bg-cyan-400 rounded-full animate-bounce" />
              <span className="size-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="size-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
}
