"use client";

import { useState, useRef, useEffect } from "react";
import { Title } from "@/components/creative-ai/title";
import { AgentChatbox, type CreativeAiParameters } from "@/components/creative-ai/agent-chatbox";
import { AgentChatBubbles, type Message } from "@/components/creative-ai/agent-chat-bubbles";
import { useAuth } from "@/providers/auth-provider";
import { creativeAiApi } from "@/features/creative-ai/api";

export default function CreativeAiPage() {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.trim().split(/\s+/)[0] : "Sobat CU";
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (messageText: string, model: string = "gemini-3-6-flash", parameters: CreativeAiParameters) => {
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsTyping(true);

    creativeAiApi
      .chat({
        model: model,
        ...parameters,
        message: messageText.trim(),
        history: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      })
      .then((data) => {
        const assistantMsg: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: "assistant",
          content: data.content,
          imageUrl: data.image_url ?? undefined,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      })
      .catch((error) => {
        setIsTyping(false);
        const errorMsg: Message = {
          id: `msg-${Date.now()}-error`,
          role: "assistant",
          content: `### ❌ Gagal Menghubungi Asisten AI\n\nTerjadi kesalahan saat memproses permintaan Anda: **${error?.message || "Kesalahan jaringan"}**.\n\nSilakan coba lagi beberapa saat lagi.`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      });
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-6 pb-0 flex flex-col">
      <style>{`
        @keyframes orangeGradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-orange-text {
          background: linear-gradient(270deg, #b45309, #ea580c, #f97316, #ffedd5, #b45309);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          animation: orangeGradientMove 4s linear infinite;
        }
      `}</style>
      
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 min-h-[60vh]">
          <Title align="center">
            What’s on the agenda today, <span className="animated-orange-text">{firstName}</span> ?
          </Title>
        </div>
      ) : (
        <div className="w-full mb-6 flex flex-col items-center">
          <AgentChatBubbles messages={messages} isTyping={isTyping} userName={firstName} />
          <span className="text-[10px] text-white/30 text-center select-none mt-6">
            Creative Agent can make mistakes. Check important info.
          </span>
          <div ref={messageEndRef} />
        </div>
      )}

      <div className="shrink-0 sticky bottom-0 pt-2 pb-4 z-30">
        <AgentChatbox onSend={handleSend} />
      </div>
    </div>
  );
}
